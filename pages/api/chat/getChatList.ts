import dbConnect from '@/lib/mongodb'
import Chat from '@/models/chat'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	const { userId } = req.query
	console.log('userId', userId)
	if (req.method === 'GET') {
		try {
			const conn = await dbConnect()
			if (conn) {
				const chat = await Chat.findById(userId).exec()
				if (chat) {
					return res.send(chat)
				} else {
					throw new Error('chat not found')
				}
			}
		} catch (error) {
			console.error('error', error)
			return res.status(404).send('chat not found')
		}
	}
}
