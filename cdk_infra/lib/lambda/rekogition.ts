import * as AWS from 'aws-sdk';
const client = new AWS.Rekognition();

export const handler = async (event: any = {}): Promise<any> => {
    const firstObjectKey = event.body.id1;
    const secondObjectKey = event.body.id2;

    const params: AWS.Rekognition.CompareFacesRequest = {
        SourceImage: {
            S3Object: {
                Bucket: process.env.BUCKET_NAME,
                Name: firstObjectKey
            }
        },
        TargetImage: {
            S3Object: {
                Bucket: process.env.BUCKET_NAME,
                Name: secondObjectKey
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
