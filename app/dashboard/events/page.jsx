
"use client"
import React, { useState, useEffect } from 'react'
import EventList from '@/components/dashboard/event/EventList'
import { Button } from '@/components/ui/button'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import app from '@/firebase'
import { toast } from 'react-hot-toast'
import NewEvent from '@/components/dashboard/event/Event'

function Events() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const auth = getAuth(app)
  const db = getFirestore(app)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserRole(data.role)
        }
      } else {
        setUser(null)
        setUserRole(null)
        toast.error("Please sign in to continue.")
      
      }
    })
    return () => unsubscribe()
  }, [auth, db])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="container mx-auto p-6">
      {userRole === 'admin' && (
        <Button onClick={openModal} className="mb-4">
          Create a New Event Space
        </Button>
      )}

      {/* Render Event Modal */}
      {isModalOpen && (
        <NewEvent onClose={closeModal} />
      )}

      {/* Event List Component */}
      <EventList />
    </div>
  )
}

export default Events
