import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

const Home = () => {
	const { user, error, isLoading } = useUser()

	if (isLoading) return <div>Loading...</div>
	if (error) return <div>{error.message}</div>
	return (
		<>
			<Head>
				<title>Chatty Gwapa - Login or Sign Up</title>
			</Head>
			<div className='flex justify-center items-center min-h-screen w-full bg-gray-800 text-white text-center'>
				<div>
					{user && <Link href='/api/auth/logout'>Logout</Link>}
					{!user && (
						<>
							<Link className='rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600' href='/api/auth/login'>
								Log In
							</Link>
							<Link className='ml-2 rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600' href='/api/auth/login'>
								Sign Up
							</Link>
						</>
					)}
				</div>
			</div>
		</>
	)
}

export default Home
