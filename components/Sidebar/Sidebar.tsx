import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
	return (
		<div className='bg-gray-900 text-white'>
			<Link href='/api/auth/logout'>Logout</Link>
		</div>
	)
}

export default Sidebar
