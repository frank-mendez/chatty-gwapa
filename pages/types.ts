export enum ChatRole {
	USER = 'user',
	ASSISTANT = 'assistant',
}

export type MessageType = {
	id: string
	role: ChatRole
	content: string
}

export interface MessageProps {
	role: ChatRole
	content: string
}
