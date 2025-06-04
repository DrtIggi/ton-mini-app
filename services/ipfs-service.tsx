"use client"

export interface IPFSUploadResult {
  imageHash: string
  metadataHash: string
  imageUrl: string
  metadataUrl: string
}

export interface PlateMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
  plateNumber: string
  createdAt: string
}

class IPFSService {
  // Mock IPFS gateway URL - in production, use a real IPFS gateway
  private static readonly IPFS_GATEWAY = "https://ipfs.io/ipfs/"

  static async uploadPlateToIPFS(plateNumber: string, canvasElement: HTMLCanvasElement): Promise<IPFSUploadResult> {
    try {
      // Convert canvas to blob
      const imageBlob = await new Promise<Blob>((resolve) => {
        canvasElement.toBlob((blob) => {
          if (blob) resolve(blob)
        }, "image/png")
      })

      // In a real implementation, you would upload to IPFS here
      // For demo purposes, we'll create mock hashes
      const imageHash = this.generateMockHash()
      const imageUrl = `${this.IPFS_GATEWAY}${imageHash}`

      // Create metadata
      const metadata: PlateMetadata = {
        name: `Car Plate #${plateNumber}`,
        description: `Unique car plate NFT with number ${plateNumber} on TON blockchain`,
        image: imageUrl,
        attributes: [
          {
            trait_type: "Plate Number",
            value: plateNumber,
          },
          {
            trait_type: "Country",
            value: "TON",
          },
          {
            trait_type: "Style",
            value: "European",
          },
          {
            trait_type: "Created",
            value: new Date().toISOString().split("T")[0],
          },
        ],
        plateNumber,
        createdAt: new Date().toISOString(),
      }

      // Upload metadata to IPFS (mock)
      const metadataHash = this.generateMockHash()
      const metadataUrl = `${this.IPFS_GATEWAY}${metadataHash}`

      // Store metadata locally for demo
      localStorage.setItem(`ipfs_metadata_${metadataHash}`, JSON.stringify(metadata))

      return {
        imageHash,
        metadataHash,
        imageUrl,
        metadataUrl,
      }
    } catch (error) {
      console.error("IPFS upload failed:", error)
      throw new Error("Failed to upload to IPFS")
    }
  }

  static async getMetadata(metadataHash: string): Promise<PlateMetadata | null> {
    try {
      // In a real implementation, you would fetch from IPFS
      const stored = localStorage.getItem(`ipfs_metadata_${metadataHash}`)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error("Failed to fetch metadata:", error)
      return null
    }
  }

  private static generateMockHash(): string {
    // Generate a mock IPFS hash (46 characters starting with Qm)
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    let hash = "Qm"
    for (let i = 0; i < 44; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return hash
  }
}

export default IPFSService
