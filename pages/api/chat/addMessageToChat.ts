import dbConnect from '@/lib/mongodb'
import Chat from '@/models/chat'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	const conn = await dbConnect()
	if (req.method === 'POST') {
		try {
			const { message, userId, chatId } = req.body

			const newUserMessage = {
				role: 'user',
				content: message,
			}

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
					throw new Error('chat not found')
				}
			}

			throw new Error('No DB connection')
		} catch (error) {
			throw new Error(`Something wrong: ${error}`)
		}
	}
}
