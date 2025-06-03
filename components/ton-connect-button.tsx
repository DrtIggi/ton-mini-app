"use client";
import { useTonConnect } from "@/hooks/use-ton-connect"

export default function TonConnectButton() {
  const { connect, disconnect, connected, wallet } = useTonConnect()

  return (
    <div>
      {connected ? (
        <div>
          <p>Connected: {wallet?.address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  )
}
