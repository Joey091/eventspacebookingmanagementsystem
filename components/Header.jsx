"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import UserMenu from "./UserMenu"



function Header() {

    const pathName = usePathname()
    const [show,setShow] = useState(true)
    useEffect(()=>{
        if(pathName.includes('dashboard')){
            setShow(false)
        }

    },[pathName])
    

    const NavLink = ({children,href}) =>{
        let flag = false
        if(pathName === href){
            flag = true
        }

        return (
            <Link   href={href}
                    className={`text-sm font-medium text-muted-foreground transition-colors 
                                hover:text-primary hover:bg-gray-200 px-2 py-2 rounded-md 
                                ${flag && 'text-black bg-gray-200'}
                            `}
                                >
                {children}
            </Link>
        )
    }
    return (
        <>
            {
                        
            
                    <div className=' border-b flex justify-between p-5 items-center'>

                        <div className='space-x-5'>
                            <NavLink href={'/'} className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-gray-200 px-4 py-2 rounded-md'>
                                HomePage
                            </NavLink>
            
                            <NavLink href={'/events'} className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-gray-200 px-4 py-2 rounded-md'>
                                Events
                            </NavLink>

                            <NavLink href={'/about-us'} className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-gray-200 px-4 py-2 rounded-md'>
                                About Us
                            </NavLink>

                            <NavLink href={'/contact-us'} className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-gray-200 px-4 py-2 rounded-md'>
                                Contact Us
                            </NavLink>
            
               
                        </div>
            
                        <div>
                            <UserMenu/>
                        </div>
            
                    </div>
            }
        </>

       
    )
}

export default Header
