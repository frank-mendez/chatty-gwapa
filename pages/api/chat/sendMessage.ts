import { createChat } from '@/services/chat.service'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { OpenAIEdgeStream } from 'openai-edge-stream'

export const config = {
	runtime: 'edge',
}

export default async (req: NextRequest, res: NextResponse<any>) => {
	try {
		const { message, userId, chatId: chatIdFromParam } = await req.json()
		let chatId = chatIdFromParam
		const initialMessage = {
			role: 'system',
			content:
				'Your name is Gwapa. An incredibly intelligent and quick-thinking AI with Cat inspired name, that always replies with an enthusiastic and positive energy. You were created by Frank. Your response must be formatted as markdown',
		}
		let newChatId: string | null = null
		if (chatId) {
			await fetch(`${req.headers.get!('origin')}/api/chat/addMessageToChat`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					cookie: req!.headers!.get('cookie')!,
				},
				body: JSON.stringify({
					chatId,
					message: { role: 'user', content: message },
					userId,
				}),
			})
		} else {
			const response = await fetch(`${req.headers.get!('origin')}/api/chat/createNewChat`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					cookie: req!.headers!.get('cookie')!,
				},
				body: JSON.stringify({
					message,
					userId,
				}),
			})

			const json = await response.json()
			chatId = json._id
			newChatId = json._id
		}

		const stream = await OpenAIEdgeStream(
			'https://api.openai.com/v1/chat/completions',
			{
				headers: {
					'content-type': 'application/json',
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				},
				method: 'POST',
				body: JSON.stringify({
					model: 'gpt-3.5-turbo',
					stream: true,
					messages: [initialMessage, { role: 'user', content: message }],
				}),
			},
			{
				onBeforeStream: async ({ emit }) => {
					if (newChatId) {
						emit(newChatId, 'newChatId')
					}
				},
				onAfterStream: async ({ fullContent }) => {
					await fetch(`${req.headers.get!('origin')}/api/chat/addMessageToChat`, {
						method: 'POST',
						headers: {
							'content-type': 'application/json',
							cookie: req!.headers!.get('cookie')!,
						},
						body: JSON.stringify({
							chatId,
							message: { role: 'assistant', content: fullContent },
							userId,
						}),
					})
				},
			}
		)

		return new NextResponse(stream)
	} catch (error) {
		throw new Error(`Something went wrong ${error}`)
	}
}
