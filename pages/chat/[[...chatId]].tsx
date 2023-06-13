import Sidebar from '@/components/Sidebar/Sidebar'
import Head from 'next/head'
import React, { useState } from 'react'
import { streamReader } from 'openai-edge-stream'
import { ChatRole, NewMessage } from '../types'
import { v4 as uuid } from 'uuid'
import Message from '@/components/Message'
import { useUser } from '@auth0/nextjs-auth0/client'
import { createChat, sendMessage } from '@/services/chat.service'

const Chat = () => {
	const [message, setMessage] = useState<string>('')
	const [incomingMessage, setIncomingMessage] = useState<string>('')
	const [newMessages, setNewMessages] = useState<NewMessage[]>([])
	const [generatingResponse, setGeneratingResponse] = useState<boolean>(false)
	const { user } = useUser()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setGeneratingResponse(true)
		setNewMessages([...newMessages, { id: uuid(), role: ChatRole.USER, message }])
		const response = await sendMessage({ message, userId: user!.sid as string })
		const data = response.body
		if (!data) {
			return
		}

		const reader = data.getReader()
		await streamReader(reader, (message) => {
			setIncomingMessage((prevState) => `${prevState}${message.content}`)
		})
		setGeneratingResponse(false)
	}

	return (
		<>
			<Head>
				<title>New Chat</title>
			</Head>
			<div className='grid h-screen grid-cols-[260px_1fr]'>
				<Sidebar />
				<div className='bg-gray-700 flex flex-col overflow-hidden'>
					<div className='flex-1 text-white overflow-y-scroll'>
						{newMessages.map((message) => (
							<Message key={message.id} role={message.role} content={message.message} />
						))}
						{!!incomingMessage && <Message role={ChatRole.ASSISTANT} content={incomingMessage} />}
					</div>
					<footer className='bg-gray-800 p-10'>
						<form onSubmit={handleSubmit}>
							<fieldset className='flex gap-2' disabled={generatingResponse}>
								<textarea
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									placeholder={generatingResponse ? '' : 'Send message...'}
									className='w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500'
								/>
								<button type='submit' className='btn'>
									Send
								</button>
							</fieldset>
						</form>
					</footer>
				</div>
			</div>
		</>
	)
}

export default Chat
