import {QueueListener} from "./queue-listener";
import {LocalLambdaProps} from "./local-lambda-props";
import {SQSEvent} from "aws-lambda";


type SQSEventReceived = (event: SQSEvent) => void;
type ErrorCallback = (error: Error) => void;

export default function localLambda(props?: LocalLambdaProps) {
    const args: LocalLambdaProps = {
        //defaults
        region: props?.region || process.env.AWS_REGION,
        accountId: props?.accountId || process.env.AWS_ACCOUNT_ID,
        ...props
    }
    return {
        sqs: (queueUrl: string, callback: SQSEventReceived, errorCallback?: ErrorCallback): void => {
            errorCallback = errorCallback || ((error) => console.error(error));
            if (!args.region) {
                throw new Error("AWS_REGION is not set");
            }

            if (!(queueUrl.startsWith("https") || queueUrl.startsWith("http://sqs."))) {
                queueUrl = `https://sqs.${args.region}.amazonaws.com/${args.accountId}/${queueUrl}`;
            }

            const queueListener = new QueueListener(args.region);
            queueListener.listen(queueUrl, callback, errorCallback).then(_ => _);
        },
        sns: () => {

        },
        dynamoStream: () => {

        },
        s3: () => {

        },
        get: () => {

        },
        put: () => {

        },
        delete: () => {

        },
        post: () => {

        },
        executeInOrder: () => {

        },
    }
}

const sqsUrl = "https://sqs.eu-north-1.amazonaws.com/792153104280/slackbot-message-queue-dlq.fifo";

/*lambdaLocal.execute({
    event: {sqsEvent: message},
    lambdaPath: path.join(__dirname, `./lambda/lambda.ts`),
    profilePath: "~/.aws/credentials",
    profileName: "iot",
    timeoutMs: 300000
}).then(function (done) {
    console.log("---------Success---------");
    // @ts-ignore
    console.log(JSON.stringify(JSON.parse(done.body), null, 2));
}).catch(function (err) {
    console.log(err);
})*/

function getEvent(body: undefined | string, method: string, pathParams: { [key: string]: string } | undefined) {
    return {
        "body": body,
        "resource": "/{proxy+}",
        "path": "/path/to/resource",
        "httpMethod": method,
        "queryStringParameters": {
            "foo": "bar"
        },
        "pathParameters": {
            ...pathParams
        },
        "stageVariables": {
            "baz": "qux"
        },
        "headers": {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, sdch",
            "Accept-Language": "en-US,en;q=0.8",
            "Cache-Control": "max-age=0",
            "CloudFront-Forwarded-Proto": "https",
            "CloudFront-Is-Desktop-Viewer": "true",
            "CloudFront-Is-Mobile-Viewer": "false",
            "CloudFront-Is-SmartTV-Viewer": "false",
            "CloudFront-Is-Tablet-Viewer": "false",
            "CloudFront-Viewer-Country": "US",
            "Host": "1234567890.execute-api.{dns_suffix}",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Custom User Agent String",
            "Via": "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
            "X-Amz-Cf-Id": "cDehVQoZnx43VYQb9j2-nvCh-9z396Uhbp027Y2JvkCPNLmGJHqlaA==",
            "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
            "X-Forwarded-Port": "443",
            "X-Forwarded-Proto": "https"
        },
        "requestContext": {
            "accountId": "123456789012",
            "resourceId": "123456",
            "stage": "prod",
            "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
            "identity": {
                "cognitoIdentityPoolId": null,
                "accountId": null,
                "cognitoIdentityId": null,
                "caller": null,
                "apiKey": null,
                "sourceIp": "127.0.0.1",
                "cognitoAuthenticationType": null,
                "cognitoAuthenticationProvider": null,
                "userArn": null,
                "userAgent": "Custom User Agent String",
                "user": null
            },
            "resourcePath": "/{proxy+}",
            "httpMethod": "POST",
            "apiId": "1234567890"
        }
    };
}
