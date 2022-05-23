import {Duration, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Bucket} from "aws-cdk-lib/aws-s3";
import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import {join} from "path";

export class CdkInfraStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        const pictureBucket = new Bucket(this, "pictureBucket", {
            bucketName: "picturebucket-assets",
        });

        const restGateway = new RestApi(this, "assets-api", {
            restApiName: "Static assets provider",
            description: "Serves assets from the S3 bucket.",
            binaryMediaTypes: ["*/*"],
            minimumCompressionSize: 0,
        });

        const executeRole = new Role(this, "api-gateway-s3-assume-tole", {
            assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
            roleName: "API-Gateway-S3-Integration-Role",
        });

        executeRole.addToPolicy(
            new PolicyStatement({
                resources: [pictureBucket.bucketArn],
                actions: ["s3:Get"],
            })
        );
        const s3WriteACcess = new PolicyDocument({
            statements: [
                new PolicyStatement({
                    resources: ['arn:aws:s3:::picturebucket-assets/*'],
                    actions: ['s3:PutObject'],
                    effect: Effect.ALLOW,
                }),
            ],
        });

        const inlineUploadPictures = new Role(this, 'inlineUploadPictures', {
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            inlinePolicies: {
                S3Access: s3WriteACcess
            }
        });


        const uploadFileLambda = new NodejsFunction(this, 'writeToS3Function', {
            memorySize: 1024,
            timeout: Duration.seconds(5),
            runtime: Runtime.NODEJS_14_X,
            handler: 'handler',
            entry: join(__dirname, '/lambda/imageUploader.ts'),
            environment: {
                'BUCKET_NAME': pictureBucket.bucketName,
            }
        });

        const s3PictureBucketAccess = new PolicyDocument({
            statements: [
                new PolicyStatement({
                    resources: ['arn:aws:s3:::picturebucket-assets/*'],
                    actions: ['s3:GetObject'],
                    effect: Effect.ALLOW,
                }),
            ],
        });

        const textractAccess = new PolicyDocument({
            statements: [
                new PolicyStatement({
                    resources: ['*'],
                    actions: ['textract:AnalyzeID'],
                    effect: Effect.ALLOW,
                }),
            ],
        });

        const inlinePolicyForTextractLambdaRole = new Role(this, 'inlinePolicyForTextractLambdaRole', {
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            inlinePolicies: {
                Textract: textractAccess,
                S3Access: s3PictureBucketAccess
            }
        });

        const textractPullDriverLicenseInfoLambda = new NodejsFunction(this, 'textractPullDriverLicenseInfoLambda', {
            memorySize: 1024,
            timeout: Duration.seconds(5),
            runtime: Runtime.NODEJS_14_X,
            handler: 'handler',
            entry: join(__dirname, '/lambda/textract.ts'),
            environment: {
                'BUCKET_NAME': pictureBucket.bucketName,
            },
            role: inlinePolicyForTextractLambdaRole,
        });

        const rekogitionAccess = new PolicyDocument({
            statements: [
                new PolicyStatement({
                    resources: ['*'],
                    actions: ['rekognition:CompareFaces'],
                    effect: Effect.ALLOW,
                }),
            ],
        });


        const compareTwoFacesRole = new Role(this, 'inlinePolicyForRekogitionAccess', {
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            inlinePolicies: {
                Rekogition: rekogitionAccess,
                S3Access: s3PictureBucketAccess
            }
        });
        const compareTwoImagesLambda = new NodejsFunction(this, 'compareTwoImagesLambda', {
            memorySize: 1024,
            timeout: Duration.seconds(5),
            runtime: Runtime.NODEJS_14_X,
            handler: 'handler',
            entry: join(__dirname, '/lambda/rekogition.ts'),
            environment: {
                'BUCKET_NAME': pictureBucket.bucketName,
            },
            role: compareTwoFacesRole
        });


        const images_api = restGateway.root.addResource("images");
        images_api.addMethod('Post', new LambdaIntegration(uploadFileLambda))
    }
}