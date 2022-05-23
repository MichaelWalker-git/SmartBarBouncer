import * as AWS from 'aws-sdk';
import {PutObjectRequest} from 'aws-sdk/clients/s3';
import {APIGatewayProxyEventV2} from 'aws-lambda';

const s3 = new AWS.S3()

export const handler = async (event: APIGatewayProxyEventV2): Promise<any> => {
    const bucketName = process.env.BUCKET_NAME as string;
    const jsonBody = JSON.parse(event?.body || "")
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
    const file_name = jsonBody?.name
    const fileBase64 = jsonBody?.file?.split(",")[1]

    // %Y-%m-%d %H:%M:%S%
    const unique_id = (new Date().toISOString().slice(0, 10))
    const full_path = `${unique_id}/${file_name}`;

    const putObjectInput: PutObjectRequest = {
        Bucket: bucketName,
        Body: fileBase64,
        ContentType: 'image/jpg',
        Key: full_path
    }
    const response = await s3.putObject(putObjectInput).promise();
    console.log(JSON.stringify(putObjectInput))
    try {
        console.log("Successful" , response)
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'text/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': JSON.stringify({
                response
            })
        }
    } catch(err){
        return errorCode(`Error - ${JSON.stringify(err)}`);
    }
}
