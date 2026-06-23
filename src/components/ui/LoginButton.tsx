'use client'
import { usePrivy } from '@privy-io/react-auth'

export function LoginButton() {
  const { ready, authenticated, login, logout, user } = usePrivy()

  if (!ready) {
    return (
      <div className="h-10 w-28 rounded-xl bg-white/5 animate-pulse" />
    )
  }

  if (authenticated && user) {
    const walletAddress = user.wallet?.address
    const displayAddress = walletAddress
      ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
      : null

    return (
      <div className="flex items-center gap-3">
        {displayAddress && (
          <span className="text-xs font-mono text-white/50 bg-white/5 px-3 py-1.5 rounded-lg">
            {displayAddress}
          </span>
        )}
        <button
          onClick={logout}
          className="px-4 py-2 text-sm font-medium text-white/60 border border-white/10 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={login}
      className="px-5 py-2.5 text-sm font-bold text-black bg-[#C5F236] rounded-xl hover:brightness-110 transition-all cursor-pointer"
    >
      Sign In
    </button>
  )
}
