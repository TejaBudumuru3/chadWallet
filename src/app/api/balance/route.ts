import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

const connection = new Connection(process.env.ALCHEMY_RPC!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')
  if (!wallet) {
    return Response.json({ error: 'Missing wallet param' }, { status: 400 })
  }

  try {
    const pk = new PublicKey(wallet)
    const lamports = await connection.getBalance(pk)
    return Response.json({ sol: lamports / LAMPORTS_PER_SOL })
  } catch {
    return Response.json({ sol: 0 })
  }
}
