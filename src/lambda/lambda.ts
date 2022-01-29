import {APIGatewayProxyEvent, SQSEvent} from "aws-lambda";

export const handler = async function (event: APIGatewayProxyEvent) {
    console.log("Invoked!", event)
    return {
        statusCode: 200,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({})
    };
};
