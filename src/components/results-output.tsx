"use client"

import { useState } from "react"

const process = (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  progress: (output: string) => void
): Promise<string> => {
  return new Promise((resolve) => {
    let result = ""
    const decoder = new TextDecoder()

    const readChunk = ({
      done,
      value,
    }: ReadableStreamReadResult<Uint8Array>) => {
      if (done) {
        return resolve(result)
      }

      result += decoder.decode(value)
      progress(result + "\n")

      reader.read().then(readChunk)
    }

    reader.read().then(readChunk)
  })
}

function ResultsOutput() {
  const [output, setOutput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleStartProcessing = async () => {
    setOutput("")
    setIsProcessing(true)

    try {
      const res = await fetch("/api/process")

      if (!res.ok) {
        throw new Error(`Failed: ${await res.text()}`)
      }

      const reader = res.body?.getReader()

      if (reader !== undefined) {
        await process(reader, (result) => {
          setOutput(result)
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-5">
      <button
        onClick={handleStartProcessing}
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded disabled:bg-blue-500/70 disabled:cursor-not-allowed hover:bg-blue-700"
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Start Processing"}
      </button>
      <pre className="pt-3 text-slate-300">{output}</pre>
    </div>
  )
}

export default ResultsOutput
