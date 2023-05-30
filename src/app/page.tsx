import ResultsOutput from "@/components/results-output"
import Code from "@/components/code"

export default function Home() {
  return (
    <main className="flex flex-col max-w-lg gap-5 p-8 mx-auto">
      <h1 className="text-2xl font-bold text-center">
        Running shell script on API route and streaming output to the
        client-side
      </h1>
      <p className="text-lg font-semibold text-center">Relevant files:</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Code code="scripts/example.sh" />
        <Code code="components/output.tsx" />
        <Code code="pages/api/process.ts" />
      </div>
      <ResultsOutput />
    </main>
  )
}
