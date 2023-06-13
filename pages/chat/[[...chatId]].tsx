import Sidebar from '@/components/Sidebar/Sidebar'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { streamReader } from 'openai-edge-stream'
import { ChatRole, MessageType } from '../types'
import { v4 as uuid } from 'uuid'
import Message from '@/components/Message'
import { sendMessage } from '@/services/chat.service'
import { useRouter } from 'next/router'
import { getSession } from '@auth0/nextjs-auth0'
import dbConnect from '@/lib/mongodb'
import Chat from '@/models/chat'

const ChatPage = (props: { chatId?: string; title?: string; messages?: MessageType[]; userId: string }) => {
	const router = useRouter()
	const { chatId, messages = [], userId } = props
	const [message, setMessage] = useState<string>('')
	const [newChatId, setNewChatId] = useState<string | null>(null)
	const [incomingMessage, setIncomingMessage] = useState<string>('')
	const [newMessages, setNewMessages] = useState<MessageType[]>([])
	const [generatingResponse, setGeneratingResponse] = useState<boolean>(false)
	const [fullMessage, setFullMessage] = useState<string | null>('')

	//Redirect when route changes
	useEffect(() => {
		if (chatId) {
			setNewMessages([])
			setNewChatId(null)
		}
	}, [chatId, setNewMessages, setNewChatId])

	// if we create new chat
	useEffect(() => {
		if (!generatingResponse && newChatId) {
			setNewChatId(null)
			router.push(`/chat/${newChatId}`)
		}
	}, [newChatId, generatingResponse, router])

	//save the new stream message
	useEffect(() => {
		if (!generatingResponse && fullMessage) {
			setNewMessages((prev) => [
				...prev,
				{
					id: uuid(),
					role: ChatRole.ASSISTANT,
					content: fullMessage,
				},
			])
		}
	}, [generatingResponse, fullMessage])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setGeneratingResponse(true)
		setMessage('')
		setNewMessages([...newMessages, { id: uuid(), role: ChatRole.USER, content: message }])
		const response = await sendMessage({ message, userId, chatId })
		const data = response.body
		if (!data) {
			return
		}

		const reader = data.getReader()
		let content: string = ''
		await streamReader(reader, (message) => {
			if (message.event === 'newChatId') {
				setNewChatId(message.content)
			} else {
				setIncomingMessage((prevState) => `${prevState}${message.content}`)
				content = content + message.content
			}
		})

		setFullMessage(content)
		setIncomingMessage('')
		setGeneratingResponse(false)
	}

	const allMessages = [...messages, ...newMessages]

	return (
		<>
			<Head>
				<title>New Chat</title>
			</Head>
			<div className='grid h-screen grid-cols-[260px_1fr]'>
				<Sidebar chatId={chatId} userId={userId} />
				<div className='bg-gray-700 flex flex-col overflow-hidden'>
					<div className='flex-1 text-white overflow-y-scroll'>
						{allMessages.map((message, index) => (
							<Message key={index} role={message.role} content={message.content} />
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

export default ChatPage

export const getServerSideProps = async (context: any) => {
	const chatId = context && context.params && context.params.chatId ? context.params.chatId?.[0] : null
	const session = await getSession(context.req, context.res)
	const user = session?.user

	if (chatId && user) {
		const conn = await dbConnect()
		if (conn) {
			const chat = await Chat.findOne({ userId: user.sub, _id: chatId }).sort('-1').exec()
			if (chat) {
				return {
					props: {
						chatId,
						title: chat.title,
						messages: JSON.parse(JSON.stringify(chat.messages)),
						userId: user.sub,
					},
				}
			}
			return {
				props: {},
			}
		} else {
			return {
				props: {},
			}
		}
	}

	if (user) {
		return {
			props: {
				userId: user.sub,
			},
		}
	}

	return {
		props: {},
	}
}
