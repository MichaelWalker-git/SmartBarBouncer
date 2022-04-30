import * as AWS from 'aws-sdk';
const client = new AWS.Textract();

export const handler = async (event: any = {}): Promise<any> => {
    const key = event.Records[0].s3.object.key
    console.log(key);

    const params: AWS.Textract.AnalyzeIDRequest = {
        DocumentPages: [{
            S3Object: {
                Bucket: event.Records[0].s3.bucket.name,
                Name: key
            }
        }]
    };

    const response: AWS.Textract.AnalyzeIDResponse = await client.analyzeID(params).promise();

    try {
        return response;
    }
    catch(err) {
        console.log(err);
    }

};
