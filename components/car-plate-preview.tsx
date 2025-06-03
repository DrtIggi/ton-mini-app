"use client"

import { useRef, useEffect } from "react"

interface CarPlatePreviewProps {
  plateNumber: string
}

export default function CarPlatePreview({ plateNumber }: CarPlatePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw plate background
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw plate border
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 4
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

    // Draw blue strip on the left side (EU style)
    ctx.fillStyle = "#003399"
    ctx.fillRect(20, 20, 40, canvas.height - 40)

    // Draw country code
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("TON", 40, 50)

    // Draw flag symbol
    ctx.fillStyle = "#FFCC00"
    ctx.beginPath()
    ctx.arc(40, 80, 15, 0, Math.PI * 2)
    ctx.fill()

    // Draw plate number
    ctx.fillStyle = "#000000"
    ctx.font = "bold 72px Arial"
    ctx.textAlign = "center"
    ctx.fillText(plateNumber || "ABC123", canvas.width / 2 + 20, canvas.height / 2 + 10)
  }, [plateNumber])

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} width={400} height={120} className="border rounded shadow-sm" />
    </div>
  )
}
