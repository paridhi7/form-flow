'use client'

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import Image from "next/image"

export default function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome to FormFlow</h1>
          <p className="text-gray-500">Sign in to create and manage your forms</p>
        </div>

        <Button
          className="w-full flex items-center justify-center gap-2"
          onClick={() => signIn('google', { callbackUrl: '/' })}
        >
          <Image
            src="/google.svg"
            alt="Google"
            width={20}
            height={20}
          />
          Sign in with Google
        </Button>
      </div>
    </div>
  )
} 