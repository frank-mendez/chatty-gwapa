import { NextRequest, NextResponse } from 'next/server'
import { OpenAIEdgeStream } from 'openai-edge-stream'

export const config = {
	runtime: 'edge',
}

export default async (request: NextRequest) => {
	try {
		const { message } = await request.json()
		console.log('message', message)
		const stream = await OpenAIEdgeStream('https://api.openai.com/v1/chat/completions', {
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
			},
			method: 'POST',
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				stream: true,
				messages: [{ role: 'user', content: message }],
			}),
		})

		return new NextResponse(stream)
	} catch (error) {
		console.log('error', error)
	}
}
