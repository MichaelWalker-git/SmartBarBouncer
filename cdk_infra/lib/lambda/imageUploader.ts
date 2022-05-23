import * as AWS from 'aws-sdk';
import {PutObjectRequest} from 'aws-sdk/clients/s3';
import {APIGatewayProxyEventV2} from 'aws-lambda';

const s3 = new AWS.S3()
const client = new AWS.Textract();

export const handler = async (event: APIGatewayProxyEventV2): Promise<any> => {
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
    const file_name = jsonBody?.name
    const fileBase64 = jsonBody?.file?.split(",")[1]

    // %Y-%m-%d %H:%M:%S%
    const unique_id = (new Date().toISOString().slice(0, 10))
    const full_path = `driverLicense/${unique_id}/${file_name}`;
    const buf = Buffer.from(fileBase64.replace(/^data:image\/\w+;base64,/, ""),'base64')

    const putObjectInput: PutObjectRequest = {
        Bucket: bucketName,
        Body: buf,
        ContentType: 'image/jpg',
        ContentEncoding: 'base64',
        Key: full_path
    }
    const response = await s3.putObject(putObjectInput).promise();
    try {
        console.log("Successful" , response)
        const params: AWS.Textract.AnalyzeIDRequest = {
            DocumentPages: [{
                S3Object: {
                    Bucket: bucketName,
                    Name: full_path
                }
            }]
        };
        const textractResponse: AWS.Textract.AnalyzeIDResponse = await client.analyzeID(params).promise();

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'text/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': JSON.stringify({
                response: textractResponse,
                driverLicenseKey: `${full_path}`
            })
        }
    } catch(err){
        return errorCode(`Error - ${JSON.stringify(err)}`);
    }

}
