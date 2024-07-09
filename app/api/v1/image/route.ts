import * as fs from "node:fs/promises";
import { generatedCode } from "@/types/types";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const FIGMA_BASE_URL = "https://api.figma.com";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const buffer = Buffer.from(await file.arrayBuffer());
    const chat = new ChatOpenAI({
      model: "gpt-4o",
      maxTokens: 1024,
    });

    const message = new HumanMessage({
      content: [
        {
          type: "text",
          text: ` You are a developer who needs to convert the image given into corresponding JSX code for a React component. 
        The Figma JSON object includes information about various UI elements such as buttons, text fields, and containers. 
        The task involves translating the structure and properties defined in the JSON object into JSX code, using Tailwind CSS for styling.

        Determine which elements can be nested and make sure you use em or rem units for more responsiveness. 
        Use flexbox for the layout and make sure positioning and alignment is correct. 
        Only give the return value and omit the return keyword.
        Only JSX syntax should remain and remove new line characters`
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/png;base64,${buffer.toString("base64")}`,
          },
        },
      ],
    });

    const structuredLlm = chat.withStructuredOutput(generatedCode)
    const res = await structuredLlm.invoke([message])

    return NextResponse.json({ data: res.code }, { status : 200 })

  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: error }, { status: 500 });
  }
}
