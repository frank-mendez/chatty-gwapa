import { ChatRole, MessageProps } from '@/pages/types'
import { useUser } from '@auth0/nextjs-auth0/client'
import Image from 'next/image'
import React from 'react'
import ReactMarkdown from 'react-markdown'

const Message = (props: MessageProps) => {
	const { role, content } = props
	const { user } = useUser()
	return (
		<div className={`grid grid-cols-[30px_1fr] gap-5 p-5 ${role === ChatRole.ASSISTANT ? 'bg-gray-600' : ''}`}>
			<div>
				{role === ChatRole.USER && user && (
					<Image src={user.picture!} width={30} height={30} className='rounded-sm shadow-md shadow/black-50' alt='User avatar' />
				)}
				{role === ChatRole.ASSISTANT && (
					<Image src={'/gwapa.png'} width={30} height={30} className='rounded-sm shadow-md shadow/black-50' alt='Gwapa avatar' />
				)}
			</div>
			<div className='prose prose-invert'>
				<ReactMarkdown>{content}</ReactMarkdown>
			</div>
		</div>
	)
}

export default Message
