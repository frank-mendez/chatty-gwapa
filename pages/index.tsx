import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { getSession } from '@auth0/nextjs-auth0'
import { NextPageContext } from 'next'

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
							<Link className='btn mr-2' href='/api/auth/login'>
								Log In
							</Link>
							<Link className='btn' href='/api/auth/signup'>
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

export const getServerSideProps = async (context: NextPageContext) => {
	const session = await getSession(context.req!, context.res!)
	if (session) {
		return {
			redirect: {
				destination: '/chat',
			},
		}
	}

	return {
		props: {},
	}
}
