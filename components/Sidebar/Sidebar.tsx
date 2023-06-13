import { IChat } from '@/models/chat'
import { getChatList } from '@/services/chat.service'
import { useUser } from '@auth0/nextjs-auth0/client'
import { faMessage, faPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Sidebar = (props: { chatId?: string; userId: string }) => {
	const [chatList, setChatList] = useState<IChat[]>([])
	const { chatId, userId } = props

	const generateChatList = async () => {
		await getChatList({ userId })
			.then((data) => {
				if (data.data && data.data.length > 0) {
					setChatList(data.data)
				}
			})
			.catch((err) => {
				console.log('err', err)
			})
	}

	useEffect(() => {
		if (userId) {
			generateChatList()
		}
	}, [userId, chatId])

	return (
		<div className='flex flex-col overflow-hidden bg-gray-900 text-white'>
			<Link href='/chat' className='side-menu-item bg-emerald-500 hover:bg-emerald-600'>
				{' '}
				<FontAwesomeIcon icon={faPlus} /> New chat
			</Link>
			<div className='flex-1 overflow-auto bg-gray-950'>
				{chatList.map((data, index) => (
					<Link key={index} href={`/chat/${data._id}`} className={`side-menu-item ${chatId === data._id ? 'bg-gray-700 hover:bg-gray-700' : ''}`}>
						<FontAwesomeIcon icon={faMessage} className='text-white/50' />{' '}
						<span title={data.title} className='overflow-hidden text-ellipsis whitespace-nowrap'>
							{data.title}
						</span>
					</Link>
				))}
			</div>
			<Link href='/api/auth/logout' className='side-menu-item'>
				<FontAwesomeIcon icon={faRightFromBracket} /> Logout
			</Link>
		</div>
	)
}

export default Sidebar
