import Link from 'next/link'
import React from 'react'

const Siderbar = () => {
  return (
    <div className='border-r w-60 text-center border-gray-200 flex flex-col '>
        <p className=' border-b p-5 font-bold'>
            Event Management
        </p>

        <Link href={"/dashboard/events"} className='hover:bg-gray-100 py-2' >
            Events
        </Link>

        <Link href={"/dashboard/reservations"} className='hover:bg-gray-100 py-2' >
            Reservations
        </Link>

        <Link href={"/dashboard/users"} className='hover:bg-gray-100 py-2' >
            Users
        </Link>
        
    </div>
  )
}

export default Siderbar