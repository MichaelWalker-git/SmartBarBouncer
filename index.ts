import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

import {aws_apigateway,} from "aws-cdk-lib";

export class ProxyStack extends cdk.Stack {
    constructor(app: cdk.App, id: string, props?: cdk.StackProps) {
        super(app, id, props);
        // Create S3 Bucket
        const imageBucket = new s3.Bucket(this, 'Bucket', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });


        // create Lambda function
        const rekoginitionLambdaFunction = new lambda.Function(this, 'RekFunction', {
            handler: 'rekfunction.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
            environment: {
                'BUCKET_NAME': imageBucket.bucketName,
            }
        });

        // Textract Analyze ID Lambda function
        const textractFunction = new lambda.Function(this, 'Textract Analyze ID', {
            handler: 'textract.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
            environment: {
                'BUCKET_NAME': imageBucket.bucketName,
            }
        });

        // write to S3 Lambda function
        const writeToS3Function = new lambda.Function(this, 'writeToS3Function', {
            handler: 'imageUploader.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
            environment: {
                'BUCKET_NAME': imageBucket.bucketName,
            }
        });

        // get from S3 Lambda function
        const getFromS3Function = new lambda.Function(this, 'getFromS3Function', {
            handler: 'rekfunction.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
            environment: {
                'BUCKET_NAME': imageBucket.bucketName,
            }
        });
        // add Rekognition permissions for Lambda function
        const statement = new iam.PolicyStatement();
        statement.addActions("rekognition:DetectLabels");
        statement.addResources("*");
        rekoginitionLambdaFunction.addToRolePolicy(statement);


        const api = new aws_apigateway.RestApi(
            this,
            'Api',
        );

        const imagesApi = api.root.addResource('images');
        imagesApi.addMethod('POST', new aws_apigateway.LambdaIntegration(textractFunction), {
            operationName: "Textract Extract information"
        });

        imagesApi.addMethod('GET', new aws_apigateway.LambdaIntegration(getFromS3Function), {
            operationName: "Get Image from S3 information"
        });
        imagesApi.addMethod('POST', new aws_apigateway.LambdaIntegration(writeToS3Function), {
            operationName: "Write Image to S3 information"
        });
    }
}

const app = new cdk.App();
app.synth();
