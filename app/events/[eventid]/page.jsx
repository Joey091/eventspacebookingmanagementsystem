// pages/events/[id].jsx
"use client"

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getFirestore, doc, getDoc, collection, addDoc, Timestamp } from "firebase/firestore"
import app from '@/firebase'
import { getAuth } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast, Toaster } from 'react-hot-toast' 
import { useRouter } from 'next/navigation'
function EventDetail() {

  const auth = getAuth(app)
  const userId = auth.currentUser?.uid
  console.log(userId);
  const route = useRouter()
  
  const id = usePathname().slice(-20)

  const db = getFirestore(app)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false) 

  useEffect(() => {
    if (!id) return

    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() })
        } else {
          setError("Event not found")
        }
      } catch (err) {
        console.error(err)
        setError("Failed to fetch event details")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id, db])

  const handleApply = async () => {
   
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.")
      return
    }

    if(!userId){
        route.push('/auth/sign-in')
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) {
      toast.error("Start date cannot be after end date.")
      return
    }

    setIsSubmitting(true)

    try {
      const reservationsRef = collection(db, "reservations")
      await addDoc(reservationsRef, {
        eventId: event.id,
        eventTitle: event.title,
        userId: userId,
        startDate: Timestamp.fromDate(start),
        endDate: Timestamp.fromDate(end),
        appliedAt: Timestamp.now(),
        status: 'pending',
      })
      toast.success("Reservation successful!")
      setStartDate('')
      setEndDate('')
    } catch (err) {
      console.error(err)
      toast.error("Failed to submit reservation.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>
  if (!event) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-64 object-cover mb-4 rounded-md"
        />
      )}
      <p className="text-gray-700 mb-4">{event.description}</p>
    
      <div className="text-gray-600 mb-2">
        <strong>Location:</strong> {event.location || 'TBD'}
      </div>
      <div className="text-gray-600 mb-4">
        <strong>Participants:</strong> {event.participantLimit}
      </div>
      <div className="text-gray-600 mb-4">
        <strong>Price:</strong> {event.price} RM(per day)
      </div>

    
      <div className="mb-6">
        <div className="mb-4">
          <Label htmlFor="start-date" className="block text-gray-700 mb-2">
            Start Date:
          </Label>
          <Input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="end-date" className="block text-gray-700 mb-2">
            End Date:
          </Label>
          <Input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

   
      <Button onClick={handleApply} disabled={isSubmitting}>
        {isSubmitting ? "Applying..." : "Apply"}
      </Button>
    </div>
  )
}

export default EventDetail



