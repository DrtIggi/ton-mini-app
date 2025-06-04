export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded">
      {children}
    </span>
  )
}
