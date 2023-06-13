import dbConnect from '@/lib/mongodb'
import Chat from '@/models/chat'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	const conn = await dbConnect()
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
					console.error(err)
					return res.status(401).send(err)
				})
		}

		throw new Error('No DB connection')
	} catch (error) {
		throw new Error(`Something wrong: ${error}`)
	}
}
