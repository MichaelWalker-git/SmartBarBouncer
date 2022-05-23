"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const handler = async (event = {}) => {
    const bucketName = process.env.BUCKET_NAME;
    const json_body = event.body;
    const file_name = json_body.name;
    const file_content = json_body.file;
    const fileBase64 = file_content.split(",")[1];
    // %Y-%m-%d %H:%M:%S%
    const unique_id = (new Date().toISOString().slice(0, 10));
    const full_path = `${unique_id}/${file_name}`;
    const putObjectInput = {
        Bucket: bucketName,
        Body: fileBase64,
        ContentType: 'image/jpg',
        Key: full_path
    };
    const bucketResponse = await s3.putObject(putObjectInput);
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
    };
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2VVcGxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImltYWdlVXBsb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0JBQStCO0FBSS9CLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBRWhCLE1BQU0sT0FBTyxHQUFHLEtBQUssRUFBRSxRQUFhLEVBQUUsRUFBZ0IsRUFBRTtJQUMzRCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQXFCLENBQUM7SUFDckQsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQTtJQUM1QixNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFBO0lBQ2hDLE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUE7SUFDbkMsTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUU3QyxxQkFBcUI7SUFDckIsTUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUN6RCxNQUFNLFNBQVMsR0FBRyxHQUFHLFNBQVMsSUFBSSxTQUFTLEVBQUUsQ0FBQztJQUU5QyxNQUFNLGNBQWMsR0FBcUI7UUFDckMsTUFBTSxFQUFFLFVBQVU7UUFDbEIsSUFBSSxFQUFFLFVBQVU7UUFDaEIsV0FBVyxFQUFFLFdBQVc7UUFDeEIsR0FBRyxFQUFFLFNBQVM7S0FDakIsQ0FBQTtJQUVELE1BQU0sY0FBYyxHQUEwQyxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUE7SUFFaEcsT0FBTztRQUNILFlBQVksRUFBRSxHQUFHO1FBQ2pCLFNBQVMsRUFBRTtZQUNQLGNBQWMsRUFBRSxXQUFXO1lBQzNCLDZCQUE2QixFQUFFLEdBQUc7U0FDckM7UUFDRCxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNuQixPQUFPLEVBQUUsU0FBUztZQUNsQixjQUFjO1NBQ2pCLENBQUM7S0FDTCxDQUFBO0FBQ0wsQ0FBQyxDQUFBO0FBL0JZLFFBQUEsT0FBTyxXQStCbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBV1MgZnJvbSAnYXdzLXNkayc7XG5pbXBvcnQge0FXU0Vycm9yLCBSZXF1ZXN0LCBTM30gZnJvbSAnYXdzLXNkayc7XG5pbXBvcnQge1B1dE9iamVjdFJlcXVlc3R9IGZyb20gJ2F3cy1zZGsvY2xpZW50cy9zMyc7XG5cbmNvbnN0IHMzID0gbmV3IEFXUy5TMygpXG5cbmV4cG9ydCBjb25zdCBoYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnkgPSB7fSk6IFByb21pc2U8YW55PiA9PiB7XG4gICAgY29uc3QgYnVja2V0TmFtZSA9IHByb2Nlc3MuZW52LkJVQ0tFVF9OQU1FIGFzIHN0cmluZztcbiAgICBjb25zdCBqc29uX2JvZHkgPSBldmVudC5ib2R5XG4gICAgY29uc3QgZmlsZV9uYW1lID0ganNvbl9ib2R5Lm5hbWVcbiAgICBjb25zdCBmaWxlX2NvbnRlbnQgPSBqc29uX2JvZHkuZmlsZVxuICAgIGNvbnN0IGZpbGVCYXNlNjQgPSBmaWxlX2NvbnRlbnQuc3BsaXQoXCIsXCIpWzFdXG5cbiAgICAvLyAlWS0lbS0lZCAlSDolTTolUyVcbiAgICBjb25zdCB1bmlxdWVfaWQgPSAobmV3IERhdGUoKS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKSlcbiAgICBjb25zdCBmdWxsX3BhdGggPSBgJHt1bmlxdWVfaWR9LyR7ZmlsZV9uYW1lfWA7XG5cbiAgICBjb25zdCBwdXRPYmplY3RJbnB1dDogUHV0T2JqZWN0UmVxdWVzdCA9IHtcbiAgICAgICAgQnVja2V0OiBidWNrZXROYW1lLFxuICAgICAgICBCb2R5OiBmaWxlQmFzZTY0LFxuICAgICAgICBDb250ZW50VHlwZTogJ2ltYWdlL2pwZycsXG4gICAgICAgIEtleTogZnVsbF9wYXRoXG4gICAgfVxuXG4gICAgY29uc3QgYnVja2V0UmVzcG9uc2U6IFJlcXVlc3Q8UzMuUHV0T2JqZWN0T3V0cHV0LCBBV1NFcnJvcj4gPSBhd2FpdCBzMy5wdXRPYmplY3QocHV0T2JqZWN0SW5wdXQpXG5cbiAgICByZXR1cm4ge1xuICAgICAgICAnc3RhdHVzQ29kZSc6IDIwMCxcbiAgICAgICAgJ2hlYWRlcnMnOiB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvanNvbicsXG4gICAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgICB9LFxuICAgICAgICAnYm9keSc6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgIGJ1Y2tldFJlc3BvbnNlXG4gICAgICAgIH0pXG4gICAgfVxufVxuIl19