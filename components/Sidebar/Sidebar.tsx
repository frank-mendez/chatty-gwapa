import { getChatList } from '@/services/chat.service'
import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import React, { useEffect } from 'react'

const Sidebar = () => {
	const { user } = useUser()

	const generateChatList = async () => {
		await getChatList({ userId: user!.sid! as string })
			.then((data) => {
				console.log('data', data)
			})
			.catch((err) => {
				console.log('err', err)
			})
	}

	useEffect(() => {
		if (user) {
			generateChatList()
		}
	}, [user])

	return (
		<div className='bg-gray-900 text-white'>
			<Link href='/api/auth/logout'>Logout</Link>
		</div>
	)
}

export default Sidebar
