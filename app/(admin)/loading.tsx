


import Avatar from '@/components/avatar'
import React from 'react'

function Loading() {
  return (
    <div className='animate-spin mx-auto p-10'>
        <Avatar seed='loader' />
    </div>
  )
}

export default Loading