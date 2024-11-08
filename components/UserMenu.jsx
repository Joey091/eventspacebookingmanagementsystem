// UserMenu.jsx
"use client"
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { useRouter } from 'next/navigation'
import { getFirestore, doc, getDoc } from "firebase/firestore"
import app from '@/firebase'

function UserMenu() {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const auth = getAuth(app)
  const db = getFirestore(app)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        }
      } else {
        setUser(null)
        setUserData(null)
      }
    })
    return () => unsubscribe()
  }, [auth, db])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/auth/sign-in') // Redirect to sign-in page after logout
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.photoURL || "/default-avatar.png"} />
          <AvatarFallback>
            {user.displayName ? user.displayName.charAt(0) : "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          My Account {userData && `(${userData.role})`}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => router.push('/resevation')}>
          Resevation
        </DropdownMenuItem>

        
        {
          userData?.role === "admin" && 
          <DropdownMenuItem onSelect={() => router.push('/dashboard/events')}>
            Dashboard
          </DropdownMenuItem>
        }

        

        <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
