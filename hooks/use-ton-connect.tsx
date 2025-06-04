"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { TonConnectUI, type WalletInfoRemote } from "@tonconnect/ui"

interface Wallet {
  address: string
  publicKey?: string
  network?: string
}

interface TonConnectContextType {
  connected: boolean
  connecting: boolean
  wallet: Wallet | null
  connect: () => void
  disconnect: () => void
  tonConnectUI: TonConnectUI | null
}

const TonConnectContext = createContext<TonConnectContextType>({
  connected: false,
  connecting: false,
  wallet: null,
  connect: () => {},
  disconnect: () => {},
  tonConnectUI: null,
})

export function TonConnectProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)

  const tonConnectUIRef = useRef<TonConnectUI | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (!tonConnectUIRef.current) {
      tonConnectUIRef.current = new TonConnectUI({
        manifestUrl:
          "https://78e5-2a02-3103-409c-2e00-5358-af1c-ed8a-1780.ngrok-free.app/manifest.json",
      })
    }

    const unsubscribe = tonConnectUIRef.current.onStatusChange((walletInfo) => {
      if (walletInfo) {
        setWallet({
          address: walletInfo.account.address,
          publicKey: walletInfo.account.publicKey,
          network: walletInfo.account.chain,
        })
        setConnected(true)
      } else {
        setWallet(null)
        setConnected(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const connect = () => {
    if (!tonConnectUIRef.current) return
    setConnecting(true)
    tonConnectUIRef.current.openModal()
    setConnecting(false)
  }

  const disconnect = () => {
    if (!tonConnectUIRef.current) return
    tonConnectUIRef.current.disconnect()
  }

  return (
    <TonConnectContext.Provider
      value={{
        wallet,
        connected,
        connecting,
        connect,
        disconnect,
        tonConnectUI: tonConnectUIRef.current,
      }}
    >
      {children}
    </TonConnectContext.Provider>
  )
}

export function useTonConnect() {
  return useContext(TonConnectContext)
}
