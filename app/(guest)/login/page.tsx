


import Avatar from '@/components/avatar'
import { SignIn } from '@clerk/nextjs'
import React from 'react'

function Login() {
  return (
    <div className='py-10 md:py-0 flex-1 flex items-center justify-center flex-col bg-[#64b5f5]'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="text-white space-y-5 flex items-center justify-center flex-col">

                <div className="rounded-full p-5 text-white">
                    <Avatar className='w-40 h-40 xl:w-60 xl:h-60' seed='God is good'/>
                </div>

                <div className="text-center">
                    <h1 className="text-4xl">
                        Inquira
                    </h1>
                    <h2 className="text-base font-light">
                        Your customizable AI Chat Agent
                    </h2>
                    <h3 className="my-5 font-bold">
                        Sign in to get started
                    </h3>
                </div>
            </div>
            <SignIn routing='hash' fallbackRedirectUrl={"/"}/>
        </div>
    </div>
  )
}

export default Login