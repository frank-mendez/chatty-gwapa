import dbConnect from '@/lib/mongodb'
import Chat from '@/models/chat'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse<any>) {
	const { userId } = req.query
	if (req.method === 'GET') {
		try {
			const conn = await dbConnect()
			if (conn) {
				const chat = await Chat.findById(userId).sort('-1').exec()
				if (chat) {
					return res.send(chat)
				} else {
					return res.status(404).send('No Chat found')
				}
			}
		} catch (error) {
			return res.status(404).send('chat not found')
		}
	}
}
