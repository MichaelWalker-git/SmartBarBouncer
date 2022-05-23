import * as AWS from 'aws-sdk';
const client = new AWS.Rekognition();

export const handler = async (event: any = {}): Promise<any> => {
    const key = event.Records[0].s3.object.key
    console.log(key);

    const params: AWS.Rekognition.CompareFacesRequest = {
        SourceImage: {
            S3Object: {
                Bucket: process.env.BUCKET_NAME,
                Name: key
            }
        },
        TargetImage: {
            S3Object: {
                Bucket: process.env.BUCKET_NAME,
                Name: key
            }
        },
    };
    const response: AWS.Rekognition.CompareFacesResponse = await client.compareFaces(params).promise();

    try {
        return response
    }
    catch(err) {
        console.log(err);
    }
    return;
};
