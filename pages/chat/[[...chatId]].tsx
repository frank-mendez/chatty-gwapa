import Sidebar from '@/components/Sidebar/Sidebar'
import Head from 'next/head'
import React, { useState } from 'react'
import { streamReader } from 'openai-edge-stream'
import { ChatRole, NewMessage } from '../types'
import { v4 as uuid } from 'uuid'
import Message from '@/components/Message'

const Chat = () => {
	const [message, setMessage] = useState<string>('')
	const [incomingMessage, setIncomingMessage] = useState<string>('')
	const [newMessages, setNewMessages] = useState<NewMessage[]>([])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		console.log('message', message)
		setNewMessages([...newMessages, { id: uuid(), role: ChatRole.USER, message }])
		const response = await fetch(`/api/chat/sendMessage`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ message }),
		})

		const data = response.body
		if (!data) {
			return
		}

		const reader = data.getReader()
		await streamReader(reader, (message) => {
			console.log('steamReader message', message)
			setIncomingMessage((prevState) => `${prevState}${message.content}`)
		})
	}

	return (
		<>
			<Head>
				<title>New Chat</title>
			</Head>
			<div className='grid h-screen grid-cols-[260px_1fr]'>
				<Sidebar />
				<div className='bg-gray-700 flex flex-col'>
					<div className='flex-1 text-white'>
						{newMessages.map((message) => (
							<Message key={message.id} role={message.role} content={message.message} />
						))}
						{!!incomingMessage && <Message role={ChatRole.ASSISTANT} content={incomingMessage} />}
					</div>
					<footer className='bg-gray-800 p-10'>
						<form onSubmit={handleSubmit}>
							<fieldset className='flex gap-2'>
								<textarea
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									placeholder='Send message...'
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
