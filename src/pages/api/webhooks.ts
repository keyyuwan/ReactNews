import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Evento recebido')

  res.status(200).json({ ok: true })
}
