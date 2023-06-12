import Sidebar from '@/components/Sidebar/Sidebar'
import Head from 'next/head'
import React, { useState } from 'react'

const Chat = () => {
	const [message, setMessage] = useState<string>('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log('message', message)
	}

	return (
		<>
			<Head>
				<title>New Chat</title>
			</Head>
			<div className='grid h-screen grid-cols-[260px_1fr]'>
				<Sidebar />
				<div className='bg-gray-700 flex flex-col'>
					<div className='flex-1'>chat window</div>
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
