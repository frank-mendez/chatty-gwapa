import { MessageType } from '@/pages/types'
import { createChat } from '@/services/chat.service'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { OpenAIEdgeStream } from 'openai-edge-stream'

export const config = {
	runtime: 'edge',
}

export default async function handler(req: NextRequest, res: NextResponse<any>) {
	try {
		const { message, userId, chatId: chatIdFromParam } = await req.json()
		let chatId = chatIdFromParam
		const initialMessage = {
			role: 'system',
			content:
				'Your name is Gwapa. An incredibly intelligent and quick-thinking AI with Cat inspired name, that always replies with an enthusiastic and positive energy. You were created by Frank. Your response must be formatted as markdown',
		}
		let newChatId: string | null = null
		let chatMessages: MessageType[] = []
		if (chatId) {
			const response = await fetch(`${req.headers.get!('origin')}/api/chat/addMessageToChat`, {
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

			const json = await response.json()
			console.log('has chatId', json)
			chatMessages = json.messages || []
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
			console.log('no chatId', json)
			chatId = json._id
			newChatId = json._id
			chatMessages = json.messages || []
		}

		const messageToInclude: MessageType[] = []
		chatMessages.reverse()
		let usedTokens: number = 0
		for (let chatMessage of chatMessages) {
			const messageTokens = chatMessage.content.length / 4
			usedTokens = usedTokens + messageTokens
			if (usedTokens <= +process.env.MAX_TOKENS!) {
				messageToInclude.push(chatMessage)
			} else {
				break
			}
		}

		messageToInclude.reverse()
		const newMessage = messageToInclude.map((data) => {
			return {
				role: data.role,
				content: data.content,
			}
		})

		console.log('[initialMessage, ...messageToInclude]', [initialMessage, ...newMessage])
		console.log('test', [initialMessage, { role: 'user', content: message }])

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
					messages: [initialMessage, ...newMessage], //messages: [initialMessage, { role: 'user', content: message }],
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
