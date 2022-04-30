"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proxy = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const apiGateway = require("aws-cdk-lib/aws-apigateway");
const constructs_1 = require("constructs");
class Proxy extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.api = new apiGateway.RestApi(this, "API", {
            restApiName: props.apiName,
            endpointConfiguration: {
                types: [props.endpointType]
            },
        });
    }
    addProxy(id, baseUrl, method = "GET") {
        const namespace = this.api.root.addResource(id);
        const proxyResource = new apiGateway.ProxyResource(this, `ProxyResource${method}${id}`, {
            parent: namespace,
            anyMethod: false,
        });
        proxyResource.addMethod(method, new apiGateway.HttpIntegration(`${baseUrl}/{proxy}`, {
            proxy: true,
            httpMethod: method,
            options: {
                requestParameters: {
                    "integration.request.path.proxy": "method.request.path.proxy"
                }
            }
        }), {
            requestParameters: {
                "method.request.path.proxy": true
            }
        });
        new aws_cdk_lib_1.CfnOutput(this, `EndPoint${method}${id}`, { value: this.api.urlForPath(proxyResource.path) });
    }
}
exports.Proxy = Proxy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm94eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBd0M7QUFDeEMseURBQXlEO0FBQ3pELDJDQUF1QztBQU92QyxNQUFhLEtBQU0sU0FBUSxzQkFBUztJQUdsQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWlCO1FBQ3pELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtZQUM3QyxXQUFXLEVBQUUsS0FBSyxDQUFDLE9BQU87WUFDMUIscUJBQXFCLEVBQUU7Z0JBQ3JCLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7YUFDNUI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sUUFBUSxDQUFDLEVBQVUsRUFBRSxPQUFlLEVBQUUsU0FBaUIsS0FBSztRQUNqRSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEQsTUFBTSxhQUFhLEdBQUcsSUFBSSxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsTUFBTSxHQUFHLEVBQUUsRUFBRSxFQUFFO1lBQ3RGLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUMsQ0FBQztRQUVILGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksVUFBVSxDQUFDLGVBQWUsQ0FBQyxHQUFHLE9BQU8sVUFBVSxFQUFFO1lBQ25GLEtBQUssRUFBRSxJQUFJO1lBQ1gsVUFBVSxFQUFFLE1BQU07WUFDbEIsT0FBTyxFQUFFO2dCQUNQLGlCQUFpQixFQUFFO29CQUNqQixnQ0FBZ0MsRUFBRSwyQkFBMkI7aUJBQzlEO2FBQ0Y7U0FDRixDQUFDLEVBQUU7WUFDRixpQkFBaUIsRUFBRTtnQkFDakIsMkJBQTJCLEVBQUUsSUFBSTthQUNsQztTQUNGLENBQUMsQ0FBQztRQUVILElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxNQUFNLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwRyxDQUFDO0NBQ0Y7QUFyQ0Qsc0JBcUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2ZuT3V0cHV0IH0gZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgKiBhcyBhcGlHYXRld2F5IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheVwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJveHlQcm9wcyB7XG4gIHJlYWRvbmx5IGFwaU5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgZW5kcG9pbnRUeXBlOiBhcGlHYXRld2F5LkVuZHBvaW50VHlwZTtcbn1cblxuZXhwb3J0IGNsYXNzIFByb3h5IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHJlYWRvbmx5IGFwaTogYXBpR2F0ZXdheS5SZXN0QXBpO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQcm94eVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMuYXBpID0gbmV3IGFwaUdhdGV3YXkuUmVzdEFwaSh0aGlzLCBcIkFQSVwiLCB7XG4gICAgICByZXN0QXBpTmFtZTogcHJvcHMuYXBpTmFtZSxcbiAgICAgIGVuZHBvaW50Q29uZmlndXJhdGlvbjoge1xuICAgICAgICB0eXBlczogW3Byb3BzLmVuZHBvaW50VHlwZV1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkUHJveHkoaWQ6IHN0cmluZywgYmFzZVVybDogc3RyaW5nLCBtZXRob2Q6IHN0cmluZyA9IFwiR0VUXCIpIHtcbiAgICBjb25zdCBuYW1lc3BhY2UgPSB0aGlzLmFwaS5yb290LmFkZFJlc291cmNlKGlkKTtcbiAgICBjb25zdCBwcm94eVJlc291cmNlID0gbmV3IGFwaUdhdGV3YXkuUHJveHlSZXNvdXJjZSh0aGlzLCBgUHJveHlSZXNvdXJjZSR7bWV0aG9kfSR7aWR9YCwge1xuICAgICAgcGFyZW50OiBuYW1lc3BhY2UsXG4gICAgICBhbnlNZXRob2Q6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgcHJveHlSZXNvdXJjZS5hZGRNZXRob2QobWV0aG9kLCBuZXcgYXBpR2F0ZXdheS5IdHRwSW50ZWdyYXRpb24oYCR7YmFzZVVybH0ve3Byb3h5fWAsIHtcbiAgICAgIHByb3h5OiB0cnVlLFxuICAgICAgaHR0cE1ldGhvZDogbWV0aG9kLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICByZXF1ZXN0UGFyYW1ldGVyczoge1xuICAgICAgICAgIFwiaW50ZWdyYXRpb24ucmVxdWVzdC5wYXRoLnByb3h5XCI6IFwibWV0aG9kLnJlcXVlc3QucGF0aC5wcm94eVwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KSwge1xuICAgICAgcmVxdWVzdFBhcmFtZXRlcnM6IHtcbiAgICAgICAgXCJtZXRob2QucmVxdWVzdC5wYXRoLnByb3h5XCI6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgYEVuZFBvaW50JHttZXRob2R9JHtpZH1gLCB7IHZhbHVlOiB0aGlzLmFwaS51cmxGb3JQYXRoKHByb3h5UmVzb3VyY2UucGF0aCkgfSk7XG4gIH1cbn1cbiJdfQ==