import {
    DynamoDBStreamsClient,
    DescribeStreamCommand,
    DescribeStreamCommandInput
} from "@aws-sdk/client-dynamodb-streams";

export class DynamodbStreamListener {

    constructor(
        private readonly region: string,
        private readonly accountId: string,
    ) {
    }


    async listen(stream: string): Promise<void> {
        const client = new DynamoDBStreamsClient({region: this.region});

        if (!stream.startsWith('arn:aws:dynamodb:')) {
            stream = `arn:aws:dynamodb:${this.region}:${this.accountId}:table/${stream}`;
        }

        const params: DescribeStreamCommandInput = {
            StreamArn: stream
        };
        const command = new DescribeStreamCommand(params);
        try {
            const data = await client.send(command);
            data.StreamDescription?.Shards?.forEach(shard => {
                console.log(shard.ShardId);
            });
        } catch (error) {
            console.error(error);
        }
    }

}