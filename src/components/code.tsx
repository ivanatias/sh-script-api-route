function Code({ code }: { code: string }) {
  return (
    <code className="px-1 font-mono font-semibold text-center rounded-lg bg-zinc-900 border-[1px] border-zinc-700 text-slate-100">
      {code}
    </code>
  )
}

export default Code
