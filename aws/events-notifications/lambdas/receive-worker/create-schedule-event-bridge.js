
import { SchedulerClient, CreateScheduleCommand } from "@aws-sdk/client-scheduler";
import dotenv from "dotenv";
dotenv.config();

const client = new SchedulerClient({ region: "us-west-2" });

export async function createScheduleEventBridge({ scheduleName, scheduleAt, payload }) {
    try {
        const iso = scheduleAt.replace(" ", "T") + ":00";
        const isoWithTimezone = iso + "-03:00"; 
        const localDate = new Date(isoWithTimezone);

        if (isNaN(localDate.getTime())) {
            throw new Error("Data inválida: " + scheduleAt);
        }

        const nowUTC = new Date();
        
        if (localDate.getTime() <= nowUTC.getTime() + 60000) {
            throw new Error(`A data agendada é para o passado ou minuto atual. Por favor, envie um 'scheduleAt' mais adiante.`);
        }
        
        const scheduleExpressionString = localDate.toISOString().substring(0, 19); 
        
        const baseString = scheduleExpressionString.substring(0, 17);
        const scheduleUTC = baseString + "00"; 

        console.log("Data UTC a ser agendada (Última Tentativa - Sem 'Z'):", scheduleUTC);

        const command = new CreateScheduleCommand({
            Name: scheduleName,
            GroupName: "default",
            ScheduleExpression: `at(${scheduleUTC})`, 
            FlexibleTimeWindow: { Mode: "OFF" },
            Target: {
                Arn: process.env.SQS_QUEUE_ARN,
                RoleArn: process.env.SCHEDULER_ROLE_ARN,
                Input: JSON.stringify(payload),
            },
        });

        const resp = await client.send(command);
        console.log("Schedule criado:", resp);
        return resp;

    } catch (err) {
        console.error("Erro ao criar schedule:", err);
        throw err;
    }
}