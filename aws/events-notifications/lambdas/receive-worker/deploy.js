import { LambdaClient, UpdateFunctionCodeCommand } from "@aws-sdk/client-lambda";
import archiver from "archiver";
import fs from "fs";
import path from "path";

const FUNCTION_NAME = "receive-worker";

const zipPath = path.resolve("lambda.zip");
const output = fs.createWriteStream(zipPath);
const archive = archiver("zip", { zlib: { level: 9 } });

archive.glob("**/*", {
  ignore: ["lambda.zip", "deploy.js"]
});
archive.finalize();

output.on("close", async () => {
  console.log(`Zip criado: ${archive.pointer()} bytes`);

  const client = new LambdaClient({ region: "us-west-2" });

  const zipFile = fs.readFileSync(zipPath);

  const command = new UpdateFunctionCodeCommand({
    FunctionName: FUNCTION_NAME,
    ZipFile: zipFile,
    Publish: true, 
  });

  try {
    const response = await client.send(command);
    console.log("Deploy feito com sucesso!");
    console.log(response);
  } catch (err) {
    console.error("Erro no deploy:", err);
  }
});

archive.pipe(output);
