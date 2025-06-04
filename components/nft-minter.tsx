"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertCircle, Upload } from "lucide-react"
import { useTonConnect } from "@/hooks/use-ton-connect"
import { beginCell, Cell, toNano } from "@ton/core"
import IPFSService, { type IPFSUploadResult } from "@/services/ipfs-service"

interface NftMinterProps {
  plateNumber: string
  pdfUrl: string
}

interface MintedNFT {
  plateNumber: string
  txHash: string
  ipfsData: IPFSUploadResult
  mintedAt: string
  owner: string
}

export default function NftMinter({ plateNumber, pdfUrl }: NftMinterProps) {
  const { wallet, connected, tonConnectUI } = useTonConnect()
  const [minting, setMinting] = useState(false)
  const [mintStatus, setMintStatus] = useState<"idle" | "uploading" | "minting" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState("")
  const [ipfsData, setIpfsData] = useState<IPFSUploadResult | null>(null)

  const handleMint = async () => {
    if (!connected || !wallet || !tonConnectUI) return

    setMinting(true)
    setMintStatus("idle")

    const canvas = document.querySelector("canvas") as HTMLCanvasElement
    if (!canvas) {
        throw new Error("Canvas not found")
      }

    const uploadResult = await IPFSService.uploadPlateToIPFS(plateNumber, canvas)
    setIpfsData(uploadResult)

    const mintedNFT: MintedNFT = {
        plateNumber,
        txHash: "test test test",
        ipfsData: uploadResult,
        mintedAt: new Date().toISOString(),
        owner: wallet.address,
      }

      const existingNFTs = JSON.parse(localStorage.getItem("minted_nfts") || "[]")
      existingNFTs.push(mintedNFT)
      localStorage.setItem("minted_nfts", JSON.stringify(existingNFTs))
    try {
      // Example collection address (replace with your own)
      const collectionAddress = "EQAWlfKQc5SNC0qpYGdsmlCcxwSCPuuoAcSpmSitceIS0k0R"

      // Build payload cell manually (adjust to your contract's ABI)
      // Here we simulate op=1 (deploy new NFT) + item_index + amount + content as per your contract

      const itemIndex = 0 // example, should be dynamic
      const amountNano = toNano("0.05") // example amount to send

      // For the payload, you need to create the function call data in FunC format, or raw boc
      
      // Simplified example to create payload for op=1, item_index, amount, and content (pdfUrl)
      // Replace this with your real payload builder for the contract

      const payload = beginCell()
        .storeUint(1, 32) // op = 1 (deploy new nft)
        .storeUint(itemIndex, 64) // item_index
        .storeCoins(amountNano) // amount to pay for minting
        .storeStringTail(pdfUrl) // store pdfUrl as string tail in the cell
        .endCell()

      const response = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: collectionAddress,
            amount: amountNano.toString(),
            payload: payload.toBoc().toString("base64"),
          },
        ],
      })

      setTxHash(response.transactionId)
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
        <Button onClick={handleMint} disabled={!connected} className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Upload to IPFS & Mint NFT
        </Button>
      )}

      {mintStatus === "uploading" && (
        <Alert className="bg-blue-50 border-blue-200">
          <Upload className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Uploading to IPFS...</AlertTitle>
          <AlertDescription className="text-blue-700">
            Uploading your car plate image and metadata to IPFS storage.
          </AlertDescription>
        </Alert>
      )}

      {mintStatus === "minting" && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />
          <AlertTitle className="text-yellow-800">Minting NFT...</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Creating your NFT on the TON blockchain. This may take a few moments.
          </AlertDescription>
        </Alert>
      )}

      {mintStatus === "success" && ipfsData &&(
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your car plate NFT has been minted successfully.
            <div className="mt-3 space-y-2 text-sm">
              <div>
              <span className="font-medium">Transaction:</span>{" "}
              <a
                href={`https://tonscan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {txHash}
              </a>
            </div>
            <div>
                <span className="font-medium">IPFS Image:</span>{" "}
                <a
                  href={ipfsData.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {ipfsData.imageHash.slice(0, 20)}...
                </a>
              </div>
              <div>
                <span className="font-medium">IPFS Metadata:</span>{" "}
                <a
                  href={ipfsData.metadataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {ipfsData.metadataHash.slice(0, 20)}...
                </a>
              </div>
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
