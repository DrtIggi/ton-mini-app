"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { useTonConnect } from "@/hooks/use-ton-connect"

interface NftMinterProps {
  plateNumber: string
  pdfUrl: string
}

export default function NftMinter({ plateNumber, pdfUrl }: NftMinterProps) {
  const { wallet, connected } = useTonConnect()
  const [minting, setMinting] = useState(false)
  const [mintStatus, setMintStatus] = useState<"idle" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState("")

  const handleMint = async () => {
    if (!connected || !wallet) return

    setMinting(true)
    setMintStatus("idle")

    try {
      // In a real implementation, you would:
      // 1. Upload the image to IPFS or another storage
      // 2. Create metadata JSON
      // 3. Call the TON contract to mint the NFT

      // Simulate minting process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock successful transaction
      setTxHash("0x" + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10))
      setMintStatus("success")
    } catch (error) {
      console.error("Minting failed:", error)
      setMintStatus("error")
    } finally {
      setMinting(false)
    }
  }

  return (
    <div className="space-y-4">
      {mintStatus === "idle" && (
        <Button onClick={handleMint} disabled={minting || !connected} className="w-full">
          {minting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Minting...
            </>
          ) : (
            "Mint as NFT"
          )}
        </Button>
      )}

      {mintStatus === "success" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your car plate NFT has been minted successfully.
            <div className="mt-2">
              <span className="font-medium">Transaction:</span>{" "}
              <a
                href={`https://tonscan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {txHash}
              </a>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {mintStatus === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to mint your NFT. Please try again.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
