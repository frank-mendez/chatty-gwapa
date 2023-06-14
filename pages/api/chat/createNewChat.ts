import dbConnect from '@/lib/mongodb'
import Chat from '@/models/chat'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse<any>) {
	const conn = await dbConnect()
	if (req.method === 'POST') {
		try {
			const { message, userId } = req.body

			const newUserMessage = {
				role: 'user',
				content: message,
			}

			const payload = {
				userId,
				messages: [newUserMessage],
				title: message,
			}

			if (conn) {
				const chat = new Chat(payload)
				await chat
					.save()
					.then((data: any) => {
						return res.status(200).send(data)
					})
					.catch((err: any) => {
						return res.status(401).send(err)
					})
			}
		} catch (error) {
			return res.status(401).send(error)
		}
	}
}
