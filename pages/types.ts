export enum ChatRole {
	USER = 'user',
	ASSISTANT = 'assistant',
}

export type NewMessage = {
	id: string
	role: ChatRole
	message: string
}

export interface MessageProps {
	role: ChatRole
	content: string
}
