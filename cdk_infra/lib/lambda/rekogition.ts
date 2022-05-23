import * as AWS from 'aws-sdk';
const client = new AWS.Rekognition();
import {PutObjectRequest} from 'aws-sdk/clients/s3';
const s3 = new AWS.S3()

export const handler = async (event: any = {}): Promise<any> => {
    const bucketName = process.env.BUCKET_NAME as string;
    // @ts-ignore
    const jsonBody = JSON.parse(Buffer.from(event.body, 'base64').toString());
    const errorCode = (message: string) => {
        return {
            statusCode: 400,
            'headers': {
                'Content-Type': 'text/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': JSON.stringify({
                message: message || 'No body',
            })
        }
    }
    if (!jsonBody) {
        return errorCode("No input body");
    }
    const file_name = jsonBody?.name;
    const fileBase64 = jsonBody?.file?.split(",")[1];
    const firstImagePath = jsonBody.firstBodyPath;

    // %Y-%m-%d %H:%M:%S%
    const unique_id = (new Date().toISOString().slice(0, 10))
    const full_path = `selfie/${unique_id}/${file_name}`;
    const buf = Buffer.from(fileBase64.replace(/^data:image\/\w+;base64,/, ""),'base64')

    const putObjectInput: PutObjectRequest = {
        Bucket: bucketName,
        Body: buf,
        ContentType: 'image/jpg',
        ContentEncoding: 'base64',
        Key: full_path
    }
    const s3Response = await s3.putObject(putObjectInput).promise();


    try {
        console.log("Successful s3Response " , s3Response)

        const params: AWS.Rekognition.CompareFacesRequest = {
            SourceImage: {
                S3Object: {
                    Bucket: process.env.BUCKET_NAME,
                    Name: firstImagePath
                }
            },
            TargetImage: {
                S3Object: {
                    Bucket: process.env.BUCKET_NAME,
                    Name: full_path
                }
            },
        };
        const rekognitionResponse: AWS.Rekognition.CompareFacesResponse = await client.compareFaces(params).promise();
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'text/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': JSON.stringify({
                response: rekognitionResponse,
                compareFacesLicenseKey: `${full_path}`
            })
        }
    } catch(err) {
        console.log(err);
    }
    return;
};
