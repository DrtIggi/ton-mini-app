"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, Download, GalleryThumbnailsIcon as Gallery } from "lucide-react"
import CarPlatePreview from "@/components/car-plate-preview"
import PdfGenerator from "@/components/pdf-generator"
import TonConnectButton from "@/components/ton-connect-button"
import NftMinter from "@/components/nft-minter"
import MintedPlatesGallery from "@/components/minted-plates-gallery"
import { useTonConnect } from "@/hooks/use-ton-connect"

export default function Home() {
  const [plateNumber, setPlateNumber] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfUrl, setPdfUrl] = useState("")
  const [activeTab, setActiveTab] = useState("create")
  const { connected } = useTonConnect()

  const handlePlateNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only alphanumeric characters
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
    setPlateNumber(value)
  }

  const handleGeneratePdf = async () => {
    if (!plateNumber) return

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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Car Plate NFT Creator</CardTitle>
          <CardDescription className="text-center">
            Create custom car plates and mint them as NFTs on TON
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="download" disabled={!pdfUrl}>
                Download
              </TabsTrigger>
              <TabsTrigger value="mint" disabled={!pdfUrl}>
                Mint NFT
              </TabsTrigger>
              <TabsTrigger value="gallery">
                <Gallery className="w-4 h-4 mr-1" />
                Gallery
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="plate-number" className="text-sm font-medium">
                  Enter Plate Number
                </label>
                <Input
                  id="plate-number"
                  value={plateNumber}
                  onChange={handlePlateNumberChange}
                  placeholder="ABC123"
                  maxLength={7}
                  className="text-center text-lg font-bold"
                />
              </div>

              <div className="py-4">
                <CarPlatePreview plateNumber={plateNumber} />
              </div>

              <Button onClick={handleGeneratePdf} disabled={!plateNumber || isGenerating} className="w-full">
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
                      <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </a>
                  </div>

                  <Button onClick={() => setActiveTab("mint")} variant="outline" className="w-full mt-2">
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

            <TabsContent value="gallery" className="py-4">
              <MintedPlatesGallery />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
