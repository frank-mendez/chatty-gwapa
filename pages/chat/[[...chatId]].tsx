import Head from 'next/head'
import React from 'react'

const Chat = () => {
	return (
		<>
			<Head>
				<title>New Chat</title>
			</Head>
			<div className='grid h-screen grid-cols-[260px_1fr]'>
				<div>sidebar</div>
				<div className='bg-gray-700 flex flex-col'>
					<div className='flex-1'>chat window</div>
					<footer className='bg-gray-800 p-10'>footer</footer>
				</div>
			</div>
		</>
	)
}

export default Chat
