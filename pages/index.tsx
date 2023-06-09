import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

const Home = () => {
	const { user, error, isLoading } = useUser()

	if (isLoading) return <div>Loading...</div>
	if (error) return <div>{error.message}</div>
	return (
		<div>
			<Head>
				<title>Chatty Gwapa</title>
			</Head>
			<h1>Welcome</h1>
			<div>
				{user && (
					<div>
						{user.picture && user.name && <img src={user.picture} alt={user.name} />}
						<h2>{user.name}</h2>
						<p>{user.email}</p>
						<Link href='/api/auth/logout'>Logout</Link>
					</div>
				)}
				{!user && <Link href='/api/auth/login'>Login</Link>}
			</div>
		</div>
	)
}

export default Home
