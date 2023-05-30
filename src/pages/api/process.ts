import type { NextApiRequest, NextApiResponse } from "next"
import { spawn } from "node:child_process"
import path from "node:path"

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const cmd = spawn(
    `"${path.join(process.cwd(), "src/scripts", "example.sh")}"`,
    {
      shell: true,
    }
  )

  cmd.on("close", (code) => {
    console.log("Process finished with exit code:", code)
  })

  cmd.stderr.on("data", (chunk) => {
    const chunkStr = chunk.toString("utf8")

    console.error("ERROR:", chunkStr)
  })

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Cache-Control": "no-cache",
    "Content-Encoding": "none",
  })

  cmd.stdout.pipe(res)
}
