import expressLambda from '../src/express-lambda';

const app = expressLambda({
    region: 'eu-north-1',
    accountId: '792153104280'
});

app.sqs('slackbot-message-queue-dlq.fifo', (event) => {
    console.log('received sqs event', event);
});

