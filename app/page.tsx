"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, Download } from "lucide-react"
import CarPlatePreview from "@/components/car-plate-preview"
import PdfGenerator from "@/components/pdf-generator"
import TonConnectButton from "@/components/ton-connect-button"
import NftMinter from "@/components/nft-minter"
import { useTonConnect } from "@/hooks/use-ton-connect"

export default function Home() {
  const [series, setSeries] = useState("")
  const [number, setNumber] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfUrl, setPdfUrl] = useState("")
  const [activeTab, setActiveTab] = useState("create")
  const { connected } = useTonConnect()

  // Разрешённые серии для Дубая
  const allowedSeries = [
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
    "AA","BB","CC","DD"
  ]

  const handleSeriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "")
    if (value.length > 2) value = value.slice(0, 2)
    setSeries(value)
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "")
    if (value.length > 5) value = value.slice(0, 5)
    setNumber(value)
  }

  const plateNumber = series + number
  const isPlateValid =
    allowedSeries.includes(series) && number.length > 0 && number.length <= 5

  const handleGeneratePdf = async () => {
    if (!isPlateValid) return
    setIsGenerating(true)
    try {
      const url = await PdfGenerator.generate(plateNumber)
      setPdfUrl(url)
      setActiveTab("download")
    } catch (error) {
      console.error("Failed to generate PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Car Plate NFT Creator</CardTitle>
          <CardDescription className="text-center">
            Create custom car plates and mint them as NFTs on TON
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="download" disabled={!pdfUrl}>
                Download
              </TabsTrigger>
              <TabsTrigger value="mint" disabled={!pdfUrl}>
                Mint NFT
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="series" className="text-sm font-medium">
                  Plate Code
                </label>
                <Input
                  id="series"
                  value={series}
                  onChange={handleSeriesChange}
                  placeholder="AA"
                  maxLength={2}
                  className="text-center text-lg font-bold"
                />
                <label htmlFor="number" className="text-sm font-medium mt-2">
                  Plate Number
                </label>
                <Input
                  id="number"
                  value={number}
                  onChange={handleNumberChange}
                  placeholder="12345"
                  maxLength={5}
                  className="text-center text-lg font-bold"
                />
              </div>

              <div className="py-4">
                <CarPlatePreview plateNumber={plateNumber} />
              </div>

              <Button onClick={handleGeneratePdf} disabled={!isPlateValid || isGenerating} className="w-full" variant="star">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate PDF"
                )}
              </Button>
            </TabsContent>

            <TabsContent value="download" className="space-y-4 py-4">
              {pdfUrl && (
                <div className="space-y-4">
                  <div className="py-4">
                    <CarPlatePreview plateNumber={plateNumber} />
                  </div>

                  <div className="flex justify-center">
                    <a href={pdfUrl} download={`car-plate-${plateNumber}.pdf`} className="inline-flex">
                      <Button variant="star">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </a>
                  </div>

                  <Button onClick={() => setActiveTab("mint")} variant="star" className="w-full mt-2">
                    Continue to Mint NFT
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mint" className="space-y-4 py-4">
              <div className="py-4">
                <CarPlatePreview plateNumber={plateNumber} />
              </div>

              <div className="space-y-4">
                <TonConnectButton />

                {connected ? (
                  <NftMinter plateNumber={plateNumber} pdfUrl={pdfUrl} />
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Connect Wallet</AlertTitle>
                    <AlertDescription>
                      Please connect your TON wallet to mint this car plate as an NFT.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
