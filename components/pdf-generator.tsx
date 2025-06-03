"use client"

import { jsPDF } from "jspdf"

class PdfGenerator {
  static async generate(plateNumber: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Create a new PDF document
        const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        })

        // Get canvas element to convert to image
        const canvas = document.querySelector("canvas") as HTMLCanvasElement
        if (!canvas) {
          reject(new Error("Canvas element not found"))
          return
        }

        // Convert canvas to image
        const imgData = canvas.toDataURL("image/png")

        // Add title
        doc.setFontSize(24)
        doc.text("Car Plate Certificate", 150, 20, { align: "center" })

        // Add plate image
        doc.addImage(imgData, "PNG", 65, 40, 160, 48)

        // Add metadata
        doc.setFontSize(12)
        doc.text(`Plate Number: ${plateNumber}`, 150, 110, { align: "center" })
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, 120, { align: "center" })
        doc.text(
          "This certificate confirms the registration of this plate number as an NFT on TON blockchain.",
          150,
          130,
          { align: "center" },
        )

        // Convert to blob URL
        const pdfBlob = doc.output("blob")
        const url = URL.createObjectURL(pdfBlob)

        resolve(url)
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default PdfGenerator
