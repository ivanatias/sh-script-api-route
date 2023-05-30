import { cl } from "@ivnatsr/color-logs"
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
    const msg = `Process finished with exit code: ${code}`
    console.log(code === 0 ? cl.green(msg) : cl.red(msg))
  })

  cmd.stderr.on("data", (chunk) => {
    const chunkStr = chunk.toString("utf8")

    console.error(cl.red(`ERROR: ${chunkStr}`))
  })

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Cache-Control": "no-cache",
    "Content-Encoding": "none",
  })

  cmd.stdout.pipe(res)
}
