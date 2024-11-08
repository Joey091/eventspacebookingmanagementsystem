
"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy
} from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import app from '@/firebase'
import { Badge } from '@/components/ui/badge' 
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table' 
import { FiSearch, FiArrowUp, FiArrowDown } from 'react-icons/fi' 
import { useRouter } from 'next/navigation'

const Reservation = () => {
  const db = getFirestore(app)
  const auth = getAuth(app)
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")

  // Initialize sortConfig with a default key and direction
  const [sortConfig, setSortConfig] = useState({ key: 'appliedAt', direction: 'desc' })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
        router.push('/login')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [auth, router])

  useEffect(() => {
    if (!user) return

    const fetchReservations = async () => {
      try {
        const reservationsRef = collection(db, "reservations")
        const reservationsQuery = query(
          reservationsRef,
          where("userId", "==", user.uid),
          orderBy("appliedAt", "desc") // Initial ordering by appliedAt
        )
        const querySnapshot = await getDocs(reservationsQuery)
        
        console.log(`Number of documents fetched: ${querySnapshot.size}`) // Debugging log

        const reservationsData = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          console.log(`Reservation ID: ${doc.id}, Data:`, data) // Debugging log
          reservationsData.push({ id: doc.id, ...data })
        })
        setReservations(reservationsData)
        console.log(`Fetched ${reservationsData.length} reservations.`)
      } catch (err) {
        console.error("Error fetching reservations:", err)
        setError("Failed to fetch reservations.")
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [db, user])

  // Handle search filtering
  const filteredReservations = useMemo(() => {
    return reservations.filter(reservation =>
      (reservation.eventTitle && reservation.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (reservation.status && reservation.status.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [reservations, searchTerm])

  // Handle sorting
  const sortedReservations = useMemo(() => {
    const sortableReservations = [...filteredReservations]
    if (sortConfig !== null) {
      sortableReservations.sort((a, b) => {
        let aKey = a[sortConfig.key]
        let bKey = b[sortConfig.key]
        
        // Handle undefined or null values
        if (aKey === undefined || aKey === null) aKey = ""
        if (bKey === undefined || bKey === null) bKey = ""
        
        // If sorting by date, use toDate() method
        if (['appliedAt', 'startDate', 'endDate'].includes(sortConfig.key)) {
          aKey = aKey instanceof Object && typeof aKey.toDate === 'function' ? aKey.toDate() : new Date(0)
          bKey = bKey instanceof Object && typeof bKey.toDate === 'function' ? bKey.toDate() : new Date(0)
        } else {
          if (typeof aKey === 'string') aKey = aKey.toLowerCase()
          if (typeof bKey === 'string') bKey = bKey.toLowerCase()
        }

        if (aKey < bKey) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aKey > bKey) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return sortableReservations
  }, [filteredReservations, sortConfig])

  const requestSort = key => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  if (loading) {
    return <div className="text-center mt-10">Loading reservations...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Reservations</h2>

      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        <FiSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search by event title or status"
          className="border border-gray-300 rounded px-4 py-2 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader>
            <TableRow>
              {/* Event Title Column with Sorting */}
              <TableHead 
                className="text-center cursor-pointer" 
                onClick={() => requestSort('eventTitle')}
              >
                <span className="flex items-center justify-center">
                  Event Title
                  {sortConfig.key === 'eventTitle' && (
                    sortConfig.direction === 'asc' ? 
                      <FiArrowUp className="ml-1" /> : 
                      <FiArrowDown className="ml-1" />
                  )}
                </span>
              </TableHead>

              {/* Applied At Column with Sorting */}
              <TableHead 
                className="text-center cursor-pointer" 
                onClick={() => requestSort('appliedAt')}
              >
                <span className="flex items-center justify-center">
                  Applied At
                  {sortConfig.key === 'appliedAt' && (
                    sortConfig.direction === 'asc' ? 
                      <FiArrowUp className="ml-1" /> : 
                      <FiArrowDown className="ml-1" />
                  )}
                </span>
              </TableHead>

              {/* Start Date Column with Sorting */}
              <TableHead 
                className="text-center cursor-pointer" 
                onClick={() => requestSort('startDate')}
              >
                <span className="flex items-center justify-center">
                  Start Date
                  {sortConfig.key === 'startDate' && (
                    sortConfig.direction === 'asc' ? 
                      <FiArrowUp className="ml-1" /> : 
                      <FiArrowDown className="ml-1" />
                  )}
                </span>
              </TableHead>

              {/* End Date Column with Sorting */}
              <TableHead 
                className="text-center cursor-pointer" 
                onClick={() => requestSort('endDate')}
              >
                <span className="flex items-center justify-center">
                  End Date
                  {sortConfig.key === 'endDate' && (
                    sortConfig.direction === 'asc' ? 
                      <FiArrowUp className="ml-1" /> : 
                      <FiArrowDown className="ml-1" />
                  )}
                </span>
              </TableHead>

              {/* Status Column with Sorting */}
              <TableHead 
                className="text-center cursor-pointer" 
                onClick={() => requestSort('status')}
              >
                <span className="flex items-center justify-center">
                  Status
                  {sortConfig.key === 'status' && (
                    sortConfig.direction === 'asc' ? 
                      <FiArrowUp className="ml-1" /> : 
                      <FiArrowDown className="ml-1" />
                  )}
                </span>
              </TableHead>
            
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReservations.map((reservation) => (
              <TableRow key={reservation.id}>

                <TableCell className="text-center px-6 py-4 whitespace-nowrap">
                  {reservation.eventTitle || "N/A"}
                </TableCell>

                <TableCell className="text-center px-6 py-4 whitespace-nowrap">
                  {reservation.appliedAt && typeof reservation.appliedAt.toDate === 'function' 
                    ? reservation.appliedAt.toDate().toLocaleString() 
                    : "N/A"}
                </TableCell>
                
                <TableCell className="text-center px-6 py-4 whitespace-nowrap">
                  {reservation.startDate && typeof reservation.startDate.toDate === 'function' 
                    ? reservation.startDate.toDate().toLocaleDateString()
                    : "N/A"}
                </TableCell>

                <TableCell className="text-center px-6 py-4 whitespace-nowrap">
                  {reservation.endDate && typeof reservation.endDate.toDate === 'function' 
                    ? reservation.endDate.toDate().toLocaleDateString() 
                    : "N/A"}
                </TableCell>

                <TableCell className="text-center px-6 py-4 whitespace-nowrap">
                  {reservation.status ? (
                    <Badge variant={
                      reservation.status.toLowerCase() === 'approved' ? "success" : 
                      reservation.status.toLowerCase() === 'pending' ? "warning" : "destructive"
                    }>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </Badge>
                  ) : (
                    "N/A"
                  )}
                </TableCell>

          
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {sortedReservations.length === 0 && (
          <div className="text-center py-4">No reservations found.</div>
        )}
      </div>
    </div>
  )
}

export default Reservation
