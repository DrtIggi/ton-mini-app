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

    // Очистка
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Фон
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Рамка
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 6
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10)

    // Парсим plateNumber: серия (буквы) и номер (цифры)
    const match = plateNumber.match(/^([A-Z]{1,2})(\d{1,5})$/)
    let series = "XX"
    let number = "00000"
    if (match) {
      series = match[1]
      number = match[2].padStart(5, "0")
    }

    // Серия (буквы) слева
    ctx.fillStyle = "#111"
    ctx.font = "bold 54px 'SF Pro', 'Arial', sans-serif"
    ctx.textAlign = "left"

    let xSeries = 38
    let ySeries = 85
    // Рисуем серию с интервалом между буквами
    if (series.length === 2) {
      ctx.fillText(String(series[0]), xSeries, ySeries)
      ctx.fillText(String(series[1]), xSeries + 38, ySeries)
    } else {
      ctx.fillText(String(series), xSeries, ySeries)
    }

    // DUBAI и арабский текст по центру
    // Арабский текст
    ctx.font = "bold 32px 'Arial', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("دبي", canvas.width / 2, 48)
    // DUBAI
    ctx.font = "bold 18px 'SF Pro', 'Arial', sans-serif"
   
    let dubai = "DUBAI"
    let xDubai = canvas.width / 2 - 38
    for (let i = 0; i < dubai.length; i++) {
      ctx.fillText(String(dubai[i]), xDubai + i * 18, 72)
    }

    // Номер (цифры) справа
    ctx.font = "bold 54px 'SF Pro', 'Arial', sans-serif"
    ctx.textAlign = "right"
    let xNumber = canvas.width - 38
    // Рисуем цифры с интервалом между ними
    for (let i = 0; i < number.length; i++) {
      ctx.fillText(String(number[i]), xNumber - i * 32, ySeries)
    }
  }, [plateNumber])

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} width={400} height={120} className="border rounded shadow-sm" />
    </div>
  )
}
