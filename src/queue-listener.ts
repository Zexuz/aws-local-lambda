import {
    DeleteMessageCommand,
    DeleteMessageCommandInput,
    ReceiveMessageCommand,
    ReceiveMessageCommandInput,
    SQSClient
} from "@aws-sdk/client-sqs";


type MessageReceivedCallback = (message: any) => void;
type ErrorCallback = (error: any) => void;

export class QueueListener {
    private sqsClient: SQSClient;
    private isActive: boolean;

    constructor(
        private readonly region: string
    ) {
        this.isActive = true;
        this.sqsClient = new SQSClient({region: region});
    }

    async listen(queueUrl: string, callback: MessageReceivedCallback, errorCallback: ErrorCallback) {
        while (this.isActive) {
            try {
                const pollingCommand = QueueListener.GetReceiveMessageCommand(queueUrl);
                const result = await this.sqsClient.send(pollingCommand);

                if (!result.Messages) {
                    continue;
                }
                try {
                    callback(result.Messages);
                    for (const message of result.Messages) {
                        if (!message.ReceiptHandle) {
                            errorCallback(new Error("ReceiptHandle is missing"));
                            return
                        }
                        try {
                            const deleteCommandInput = QueueListener.getDeleteCommand(queueUrl, message.ReceiptHandle);
                            await this.sqsClient.send(deleteCommandInput);
                        } catch (error) {
                            console.error(`Error deleting message `, error);
                            errorCallback(error);
                        }
                    }
                } catch (e: any) {
                    errorCallback(e);
                }

            } catch (e) {
                console.error(`Error receiving message `, e);
                errorCallback(e);
            }
        }
    }

    private static getDeleteCommand(queueUrl: string, receiptHandle: string): DeleteMessageCommand {
        const input: DeleteMessageCommandInput = {
            QueueUrl: queueUrl,
            ReceiptHandle: receiptHandle,
        };

        return new DeleteMessageCommand(input);
    }

    private static GetReceiveMessageCommand(queueUrl: string): ReceiveMessageCommand {
        const receiveMessageParams: ReceiveMessageCommandInput = {
            MaxNumberOfMessages: 10,
            QueueUrl: queueUrl,
            VisibilityTimeout: 20,
            WaitTimeSeconds: 20,
        }
        return new ReceiveMessageCommand(receiveMessageParams)
    }

    stop() {
        this.isActive = false;
    }

    start() {
        this.isActive = true;
    }


}