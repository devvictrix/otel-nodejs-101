/*app.ts*/

// 1. โหลด environment variables เข้ามาก่อนเป็นอันดับแรก
import "dotenv/config";

// 2. เริ่มการทำงานของ OpenTelemetry SDK เป็นอันดับสอง
import "./instrumentation";

import { instrumentRollDice } from "./manual-instrumentation";

import express, { Express } from "express";
import axios, { isCancel, AxiosError } from "axios";

const PORT: number = parseInt(process.env.PORT || "8080");
const app: Express = express();

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

app.get("/", async (req, res) => {
  try {
    // Use service names for Docker networking
    const nestjsServiceUrl = process.env.NESTJS_SERVICE_URL || "http://nestjs:8080";
    const ollamaUrl = process.env.OLLAMA_URL || "http://ollama:11434";
    
    const response = await axios.get(nestjsServiceUrl);
    console.log("Response from service B:", response.data);

    // Generate a response from Ollama
    const ollamaResponse = await axios.post(
      `${ollamaUrl}/api/generate`,
      {
        model: "llama3.2",
        prompt: `Generate a friendly greeting message that includes the following text: "${response.data}"`,
        stream: false,
      }
    );

    const ollamaText = ollamaResponse.data.response;
    console.log("Ollama response:", ollamaText);
    res.send(`Response from Ollama: ${ollamaText}`);

  } catch (error) {
    if (isCancel(error)) {
      console.log("Request canceled", error.message);
      res.status(499).send("Client Closed Request");
    } else if (error instanceof AxiosError) {
      console.error("Axios error:", error.message);
      res.status(502).send("Bad Gateway");
    } else {
      console.error("Unexpected error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
});

app.get("/rolldice", (req, res) => {
  try {
    // Option 1: Simple manual instrumentation
    const result = instrumentRollDice(() => getRandomNumber(1, 6));
    res.send(result.toString());
    
    // Option 2: Context-aware instrumentation (commented out)
    // const ctx = trace.getContext();
    // const result = instrumentRollDiceWithContext(() => getRandomNumber(1, 6), ctx);
    // res.send(result.toString());
    
  } catch (error) {
    console.error('Error in rolldice:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
