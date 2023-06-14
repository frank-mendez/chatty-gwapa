import dbConnect from '@/lib/mongodb'
import Chat from '@/models/chat'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse<any>) {
	const conn = await dbConnect()
	if (req.method === 'POST') {
		try {
			const { message, userId, chatId } = req.body

			if (conn) {
				const condition = { _id: chatId, userId }
				const chat = await Chat.findOneAndUpdate(
					condition,
					{
						$push: { messages: message },
					},
					{ returnDocument: 'after' }
				).exec()

				if (chat) {
					return res.status(200).send(chat)
				} else {
					return res.status(401).send('No chat found')
				}
			}

			return res.status(401).send('No DB connection')
		} catch (error) {
			return res.status(401).send(error)
		}
	}
}
