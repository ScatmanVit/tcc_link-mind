import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import dotenv from "dotenv";
dotenv.config();

const aws_client = new SQSClient({ region: "us-west-2" });

export async function sendToQueue(JOB_BODY) {
    const command = new SendMessageCommand({
        QueueUrl: process.env.RECEIVE_SQS_URL,
        MessageBody: JSON.stringify(JOB_BODY),
    });

    const response = await aws_client.send(command);
    return response;
}