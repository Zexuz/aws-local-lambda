import expressLambda from '../src/express-lambda';

const app = expressLambda({
    region: 'eu-north-1',
    accountId: '792153104280'
});

app.sqs('slackbot-message-queue-dlq.fifo', (event) => {
    console.log('received sqs event', event);
});


app.dynamoStream('arn:aws:dynamodb:eu-north-1:792153104280:table/transport-engine-event-store-oskar-engine/stream/2021-12-21T09:39:51.179');
