"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, Calendar, User, Hash } from "lucide-react"

interface MintedNFT {
  plateNumber: string
  txHash: string
  ipfsData: {
    imageHash: string
    metadataHash: string
    imageUrl: string
    metadataUrl: string
  }
  mintedAt: string
  owner: string
}

interface PlateImageProps {
  plateNumber: string
  onClick: () => void
}

function PlateImage({ plateNumber, onClick }: PlateImageProps) {
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
    ctx.fillText(plateNumber, canvas.width / 2 + 20, canvas.height / 2 + 10)
  }, [plateNumber])

  return (
    <div
      className="w-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
      onClick={onClick}
    >
      <canvas ref={canvasRef} width={400} height={120} className="w-full border rounded shadow-md bg-white" />
    </div>
  )
}

export default function MintedPlatesGallery() {
  const [mintedNFTs, setMintedNFTs] = useState<MintedNFT[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlate, setSelectedPlate] = useState<MintedNFT | null>(null)

  useEffect(() => {
    const loadMintedNFTs = async () => {
      try {
        const stored = localStorage.getItem("minted_nfts")
        if (stored) {
          const nfts = JSON.parse(stored)
          setMintedNFTs(nfts.reverse()) // Show newest first
        }
      } catch (error) {
        console.error("Failed to load minted NFTs:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMintedNFTs()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading minted plates...</div>
      </div>
    )
  }

  if (mintedNFTs.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">No car plates have been minted yet.</div>
        <div className="text-sm text-gray-400">Be the first to create and mint a car plate NFT!</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Minted Car Plates</h2>
        <p className="text-gray-600">Click on any plate to view details</p>
        <Badge variant="secondary" className="mt-2">
          {mintedNFTs.length} plate{mintedNFTs.length !== 1 ? "s" : ""} minted
        </Badge>
      </div>

      {/* Scrollable List of Plates */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {mintedNFTs.map((nft, index) => (
          <div key={index} className="flex-shrink-0">
            <PlateImage plateNumber={nft.plateNumber} onClick={() => setSelectedPlate(nft)} />
          </div>
        ))}
      </div>

      {/* Plate Details Dialog */}
      <Dialog open={!!selectedPlate} onOpenChange={() => setSelectedPlate(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Car Plate #{selectedPlate?.plateNumber}
              <Badge variant="outline">NFT</Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedPlate && (
            <div className="space-y-4">
              {/* Large Plate Preview */}
              <div className="bg-gray-100 rounded-lg p-6 flex justify-center">
                <div className="bg-white border-4 border-black rounded-lg px-6 py-3 relative shadow-lg">
                  <div className="absolute left-2 top-2 bottom-2 w-8 bg-blue-900 rounded-sm flex flex-col items-center justify-center text-white text-xs">
                    <div className="font-bold">TON</div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mt-1"></div>
                  </div>
                  <div className="ml-10 font-bold text-2xl tracking-wider">{selectedPlate.plateNumber}</div>
                </div>
              </div>

              {/* NFT Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">Owner</div>
                    <div className="font-mono text-sm">{formatAddress(selectedPlate.owner)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">Minted</div>
                    <div className="text-sm">{formatDate(selectedPlate.mintedAt)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Hash className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Transaction</div>
                    <a
                      href={`https://tonscan.org/tx/${selectedPlate.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-mono text-sm break-all"
                    >
                      {selectedPlate.txHash}
                    </a>
                  </div>
                </div>
              </div>

              {/* IPFS Links */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">IPFS Resources</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={selectedPlate.ipfsData.imageUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Image
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={selectedPlate.ipfsData.metadataUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Metadata
                    </a>
                  </Button>
                </div>
              </div>

              {/* IPFS Hashes */}
              <div className="space-y-2 text-xs text-gray-500">
                <div>
                  <span className="font-medium">Image Hash:</span>
                  <div className="font-mono break-all">{selectedPlate.ipfsData.imageHash}</div>
                </div>
                <div>
                  <span className="font-medium">Metadata Hash:</span>
                  <div className="font-mono break-all">{selectedPlate.ipfsData.metadataHash}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
