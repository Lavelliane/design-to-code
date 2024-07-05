import { z } from "zod"

const generatedCode = z.object({
    code: z.string().describe("JSX Code only. Omitted return keyword")
})

export { generatedCode }