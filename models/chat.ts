import mongoose, { Document, Types } from 'mongoose'
const { Schema } = mongoose

export interface IChat extends Document {
	userId: string
	messages: Types.DocumentArray<Messages>
	title: string
}

export interface Messages {
	role: {
		type: String
		required: true
	}
	content: {
		type: String
		required: true
	}
}

const chatSchema = new Schema<IChat>({
	userId: {
		type: String,
		required: true,
	},
	messages: {
		type: [{ role: String, content: String }],
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
})

export const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema)

export default Chat
