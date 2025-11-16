'use client'
import Navbar from '@/components/navbar'
import { usePathname } from 'next/navigation'

export default function NavbarContainer({ authed }: { authed: boolean }) {
  const pathname = usePathname()
  if (!authed) return null
  if (pathname === '/signin' || pathname === '/signup') return null
  return <Navbar />
}