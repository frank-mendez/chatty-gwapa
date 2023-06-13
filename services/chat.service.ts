import axios from 'axios'

export type CreateChatDto = {
	userId: string
	message: string
}

export const createChat = async (payload: CreateChatDto) => {
	try {
		return await axios.post('/api/chat/createNewChat', payload).then((data) => {
			return data
		})
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
