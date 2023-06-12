import { NextRequest, NextResponse } from 'next/server'
import { OpenAIEdgeStream } from 'openai-edge-stream'

export const config = {
	runtime: 'edge',
}

export default async (request: NextRequest) => {
	try {
		const { message } = await request.json()
		const initialMessage = {
			role: 'system',
			content:
				'Your name is Gwapa. An incredibly intelligent and quick-thinking AI with Cat inspired name, that always replies with an enthusiastic and positive energy. You were created by Frank. Your response must be formatted as markdown',
		}
		const stream = await OpenAIEdgeStream('https://api.openai.com/v1/chat/completions', {
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
		})

		return new NextResponse(stream)
	} catch (error) {
		throw new Error(`Something went wrong ${error}`)
	}
}
