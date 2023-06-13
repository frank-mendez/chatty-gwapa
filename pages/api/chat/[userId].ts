import dbConnect from '@/lib/mongodb'
import Chat from '@/models/chat'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
	const { userId } = req.query
	console.log('userId', userId)
	if (req.method === 'GET') {
		console.log('userId', userId)
		try {
			const conn = await dbConnect()
			if (conn) {
				const chat = await Chat.find({ userId }).exec()
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
