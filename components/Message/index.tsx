import { MessageProps } from '@/pages/types'
import React from 'react'

const Message = (props: MessageProps) => {
	const { role, content } = props
	return (
		<div className='grid grid-cols-[30px_1fr] gap-5 p-5'>
			<div>avatar</div>
			<div>{content}</div>
		</div>
	)
}

export default Message
