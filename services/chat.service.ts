import dbConnect from '@/lib/mongodb'
import Chat from '@/models/chat'
import axios from 'axios'

export type CreateChatDto = {
	userId: string
	message: string
}

//https://github.com/axios/axios/issues/5523
//I ended up removing axios and using native fetch.

export const createChat = async (payload: CreateChatDto) => {
	try {
		const response = await fetch(`/api/chat/createNewChat`, {})
	} catch (error) {
		throw new Error(`Something went wrong ${error}`)
	}
}

export const sendMessage = async (payload: { message: string; userId: string; chatId?: string }) => {
	try {
		const response = await fetch('/api/chat/sendMessage', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(payload),
		})
		return response
	} catch (error) {
		throw new Error(`Something went wrong ${error}`)
	}
}

export const getChatList = async (payload: { userId: string }) => {
	const { userId } = payload
	try {
		return await axios.get(`/api/chat/${userId}`).then((data) => {
			return data
		})
	} catch (error) {
		throw new Error(`Something went wrong ${error}`)
	}
}
