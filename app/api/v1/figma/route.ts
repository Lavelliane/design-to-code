import { generatedCode } from "@/types/types";
import { ChatOpenAI } from "@langchain/openai";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const FIGMA_BASE_URL = "https://api.figma.com";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { projectId, nodeIds } = body;
    const figmaConfig = await axios.get(
      `${FIGMA_BASE_URL}/v1/files/${projectId}/nodes?ids=${nodeIds}`,
      {
        headers: {
          "X-FIGMA-TOKEN": `${process.env.NEXT_PUBLIC_FIGMA_TOKEN}`,
        },
      }
    );

    if (figmaConfig.data) {
      //generate code
      const model = new ChatOpenAI({
        model: "gpt-4o",
        temperature: 0.5,
        maxTokens: 4000
      });

      const generatedLlm = model.withStructuredOutput(generatedCode);

      const generated = await generatedLlm.invoke(`
        ${JSON.stringify(figmaConfig.data)}\n\n

        You are a developer who needs to convert a Figma configuration JSON object into corresponding JSX code for a React component. 
        The Figma JSON object includes information about various UI elements such as buttons, text fields, and containers. 
        The task involves translating the structure and properties defined in the JSON object into JSX code, using Tailwind CSS for styling.

        Determine which elements can be nested and make sure you use em or rem units for more responsiveness. 
        Use flexbox for the layout and make sure positioning and alignment is correct. 
        Only give the return value and omit the return keyword.
        Only JSX syntax should remain and remove new line characters
    `);

      return NextResponse.json({ data: generated }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: error }, { status: 500 });
  }
}
