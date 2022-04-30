import * as AWS from 'aws-sdk';
import {AWSError, Request, S3} from 'aws-sdk';
import {PutObjectRequest} from 'aws-sdk/clients/s3';

const s3 = new AWS.S3()

export const handler = async (event: any = {}): Promise<any> => {
    const bucketName = process.env.BUCKET_NAME as string;
    const json_body = event.body
    const file_name = json_body.name
    const file_content = json_body.file
    const fileBase64 = file_content.split(",")[1]

    // %Y-%m-%d %H:%M:%S%
    const unique_id = (new Date().toISOString().slice(0, 10))
    const full_path = `${unique_id}/${file_name}`;

    const putObjectInput: PutObjectRequest = {
        Bucket: bucketName,
        Body: fileBase64,
        ContentType: 'image/jpg',
        Key: full_path
    }

    const bucketResponse: Request<S3.PutObjectOutput, AWSError> = await s3.putObject(putObjectInput)

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/json',
            'Access-Control-Allow-Origin': '*',
        },
        'body': JSON.stringify({
            message: 'success',
            bucketResponse
        })
    }
}
