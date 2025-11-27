import { SchedulerClient, CreateScheduleCommand } from "@aws-sdk/client-scheduler";
import dotenv from "dotenv";
dotenv.config();

const client = new SchedulerClient({ region: process.env.AWS_REGION });

export async function createScheduleEventBridge({ scheduleName, dateTime, payload }) {
  const command = new CreateScheduleCommand({
    Name: scheduleName,    
    GroupName: "default",      
    ScheduleExpression: `at(${dateTime})`,   
    FlexibleTimeWindow: { Mode: "OFF" },

    Target: {
      Arn: process.env.SQS_QUEUE_ARN,  
      RoleArn: process.env.SCHEDULER_ROLE_ARN, 

      Input: JSON.stringify(payload) 
    }
  });

  return await client.send(command);
}
