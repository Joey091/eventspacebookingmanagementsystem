// EventList.jsx
"use client"

import React, { useEffect, useState } from 'react'
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  where, 
  Timestamp 
} from "firebase/firestore"
import app from '@/firebase'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge' 

function EventList() {
  const db = getFirestore(app)
  const [events, setEvents] = useState([])
  const [reservedEvents, setReservedEvents] = useState(new Map())

  useEffect(() => {

    const eventsQuery = query(collection(db, "events"), orderBy('createdAt', 'desc'))

    const eventsUnsubscribe = onSnapshot(eventsQuery, (querySnapshot) => {
      const eventsData = []
      querySnapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() })
      })
      setEvents(eventsData)
      console.log(`Fetched ${eventsData.length} events.`)
    })

    return () => eventsUnsubscribe()
  }, [db])

  useEffect(() => {

    const today = new Date()
    const utcToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
    console.log(`UTC Today: ${utcToday.toISOString()}`)

    const reservationsQuery = query(
      collection(db, "reservations"),
      where("status", "==", "approved"),
      where("startDate", "<=", Timestamp.fromDate(utcToday)),
      where("endDate", ">=", Timestamp.fromDate(utcToday))
    )

    const reservationsUnsubscribe = onSnapshot(
      reservationsQuery,
      (querySnapshot) => {
        const tempMap = new Map()
        console.log(`Fetched ${querySnapshot.size} reservations.`)

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          const eventId = data.eventId
          const endDate = data.endDate.toDate()

          console.log(`Reservation for Event ID: ${eventId}, Ends on: ${endDate}`)

          if (tempMap.has(eventId)) {
         
            if (endDate > tempMap.get(eventId)) {
              tempMap.set(eventId, endDate)
            }
          } else {
            tempMap.set(eventId, endDate)
          }
        })

        setReservedEvents(tempMap)
        console.log(`Reserved Events Map Size: ${tempMap.size}`)
      },
      (error) => {
        console.error("Error fetching reservations:", error)
      }
    )

    return () => reservationsUnsubscribe()
  }, [db])

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-6">Available Event Spaces</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link
            href={`/events/${event.id}`}
            key={event.id}
            className="block bg-white shadow-md rounded p-4 hover:shadow-lg transition-shadow relative"
          >
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
            )}
            {/* Reservation Status Badge */}
            <div className="absolute top-6 right-6">
              {reservedEvents.has(event.id) ? (
                <Badge variant="destructive">Reserved</Badge>
              ) : (
                <Badge>Available</Badge>
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-gray-700 mb-2">{event.description}</p>
            <p className="text-gray-600 mb-2">
              <strong>Location:</strong> {event.location || 'TBD'}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Participants:</strong> {event.participantLimit}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Price (RM /day):</strong> {event.price}
            </p>
            {/* Display next available date if reserved */}
            {reservedEvents.has(event.id) && (
              <p className="text-sm text-gray-500 mt-2">
                Available again on: {reservedEvents.get(event.id).toLocaleDateString()}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default EventList
