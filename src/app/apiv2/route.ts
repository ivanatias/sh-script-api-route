import { cl } from "@ivnatsr/color-logs"
import path from "node:path"
import { type ChildProcessWithoutNullStreams, spawn } from "node:child_process"

interface AsyncIterator {
  next(): Promise<{ value: Uint8Array; done: boolean }>
}

function iteratorToStream(asyncIteratorFn: () => AsyncIterator) {
  const iterator = asyncIteratorFn()

  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()

      if (done) {
        controller.close()
      } else {
        controller.enqueue(new Uint8Array(value))
      }
    },
  })
}

async function* readCmdOutput(cmd: ChildProcessWithoutNullStreams) {
  const onDataReceivedPromiseWrapper = (): Promise<{
    chunk?: Uint8Array
    closed?: boolean
  }> => {
    return new Promise((resolve, reject) => {
      cmd.stdout.on("data", (chunk) => resolve({ chunk }))

      cmd.stderr.on("data", (errChunk) => {
        reject(new Error(errChunk.toString("utf8")))
      })

      cmd.on("close", () => resolve({ closed: true }))
    })
  }

  while (true) {
    try {
      const { chunk, closed } = await onDataReceivedPromiseWrapper()

      if (closed) break

      yield chunk as Uint8Array
    } catch (e) {
      if (e instanceof Error) console.error(cl.red(`ERROR: ${e.message}`))
      break
    }
  }
}

export async function GET() {
  const cmd = spawn(
    `"${path.join(process.cwd(), "src/scripts", "example.sh")}"`,
    {
      shell: true,
    }
  )

  const stream = iteratorToStream(() => readCmdOutput(cmd) as AsyncIterator)

  const headers = new Headers({
    "Content-Type": "text/plain",
    "Content-Encoding": "none",
  })

  return new Response(stream, {
    status: 200,
    headers,
  })
}
