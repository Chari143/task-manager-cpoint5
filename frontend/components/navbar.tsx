'use client'
const Navbar = () => {
  return (
    <div>
        <div className="flex justify-between items-center p-3 bg-gray-800 text-white">
            <h1 className="text-2xl font-bold">Task Manager</h1>
            {/* logout button */}
            <button className="bg-red-600 p-3 text-white rounded-md hover:opacity-90 hover:cursor-pointer flex justify-center items-center text-sm font-bold"
            onClick={async () => {
                const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
                await fetch(`${base}/auth/logout`, { method: 'POST', credentials: 'include' })
                window.location.href = '/signin'
            }}>
                Logout
            </button>
        </div>
    </div>
  )
}

export default Navbar