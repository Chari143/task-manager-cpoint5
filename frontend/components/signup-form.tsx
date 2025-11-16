'use client'
import { signUpCredentialProps, SignUpSchema } from '@/types/types'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import React, { useState } from 'react'

const SignUpForm = () => {
    const router = useRouter()
    const [credentials, setCredentials] = useState<signUpCredentialProps>({ name: '', email: '', password: '' })
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [serverMessage, setServerMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }))
        setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSignup = async () => {
        const parsedData = SignUpSchema.safeParse(credentials)
        if (!parsedData.success) {
            const error: Record<string, string> = {}
            parsedData.error.issues.forEach((issue) => {
                const fieldname = issue.path[0] as string
                error[fieldname] = issue.message
            })
            setFieldErrors(error)
            return
        }
        setLoading(true)
        setServerMessage('')
        try {
            const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
            const res = await fetch(`${base}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(credentials)
            })
            const data = await res.json()
            if (!res.ok) {
                setServerMessage(data?.message || 'Signup failed')
                return
            }
            setServerMessage('Signup successful! Redirecting...')
            router.push('/signin')
        } catch {
            setServerMessage('Network error')
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='flex items-center h-full'>
            <div className='p-10 space-y-6 flex flex-col mx-auto w-[400px] h-full shadow-xl rounded-2xl'>
                <h2 className='font-bold text-3xl capitalize items-center flex justify-center'>Sign Up</h2>
                <div className='flex flex-col gap-y-2'>
                    <label htmlFor="name" className='font-semibold'>Name:</label>
                    <input name='name' type='name' required value={credentials.name} onChange={handleChange}
                        placeholder="name" className='border border-gray-300 rounded-md p-2' />
                    {fieldErrors.name &&
                        <span className='text-red-400'>{fieldErrors.name}</span>
                    }
                </div>
                <div className='flex flex-col gap-y-2'>
                    <label htmlFor="email" className='font-semibold'>Email:</label>
                    <input name='email' type='email' required value={credentials.email} onChange={handleChange}
                        placeholder="email" className='border border-gray-300 rounded-md p-2' />
                    {fieldErrors.email &&
                        <span className='text-red-400'>{fieldErrors.email}</span>
                    }
                </div>
                <div className='flex flex-col gap-y-2'>
                    <label htmlFor="password" className='font-semibold'>Password:</label>
                    <input name='password' type='password' required min={4} value={credentials.password} onChange={handleChange}
                        placeholder="Password" className='border border-gray-300 rounded-md p-2' />
                    {fieldErrors.password &&
                        <span className='text-red-400'>{fieldErrors.password}</span>
                    }
                </div>
                <button className='bg-blue-600 p-3 text-white rounded-md hover:opacity-90 hover:cursor-pointer flex justify-center items-center disabled:opacity-60'
                    onClick={handleSignup} disabled={loading}
                >{loading ? 'Signing up...' : 'Sign Up'}</button>
                {serverMessage && (
                    <span className='text-center text-sm text-gray-600'>{serverMessage}</span>
                )}
                <Link href={'/signin'} className='flex justify-center text-blue-500  hover:underline'>Already Have an Account?</Link>
            </div>
        </div>
    )
}

export default SignUpForm
