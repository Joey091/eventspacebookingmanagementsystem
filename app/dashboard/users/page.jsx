// Users.jsx
"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  query, 
  where, 
  getDocs, 
  orderBy // Ensure orderBy is imported
} from "firebase/firestore"
import app from '@/firebase'
import { Badge } from '@/components/ui/badge' 
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table' // Adjust the import path based on your project structure
import { FiSearch, FiArrowUp, FiArrowDown } from 'react-icons/fi' // For search and sorting icons

function Users() {
  const db = getFirestore(app)
  const [users, setUsers] = useState([])
  const [bookingCounts, setBookingCounts] = useState({}) // { userId: count }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: 'email', direction: 'asc' })

  useEffect(() => {
    // Fetch all users, ordered by email ascending
    const usersRef = collection(db, "users")
    const usersQuery = query(usersRef, orderBy('email', 'asc')) // Now orderBy is defined
    
    const unsubscribe = onSnapshot(
      usersQuery,
      (querySnapshot) => {
        const usersData = []
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() })
        })
        setUsers(usersData)
        console.log(`Fetched ${usersData.length} users.`)
      },
      (error) => {
        console.error("Error fetching users:", error)
        setError("Failed to fetch users.")
      }
    )

    return () => unsubscribe()
  }, [db])

  useEffect(() => {
    if (users.length === 0) {
      setLoading(false)
      return
    }

    // Fetch reservations and calculate booking counts
    const fetchBookingCounts = async () => {
      try {
        const reservationsRef = collection(db, "reservations")
        const reservationsQuery = query(reservationsRef, where("status", "==", "approved"))
        const reservationsSnapshot = await getDocs(reservationsQuery)

        const counts = {}
        reservationsSnapshot.forEach((doc) => {
          const data = doc.data()
          const userId = data.userId
          if (userId) {
            counts[userId] = (counts[userId] || 0) + 1
          }
        })

        setBookingCounts(counts)
        console.log(`Calculated booking counts for users.`)
      } catch (err) {
        console.error("Error fetching reservations:", err)
        setError("Failed to fetch booking counts.")
      } finally {
        setLoading(false)
      }
    }

    fetchBookingCounts()
  }, [db, users])

  // Handle search filtering
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [users, searchTerm])

  // Handle sorting
  const sortedUsers = useMemo(() => {
    const sortableUsers = [...filteredUsers]
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        let aKey = a[sortConfig.key]
        let bKey = b[sortConfig.key]
        
        // Handle undefined or null values
        if (aKey === undefined || aKey === null) aKey = ""
        if (bKey === undefined || bKey === null) bKey = ""
        
        if (typeof aKey === 'string') {
          aKey = aKey.toLowerCase()
          bKey = bKey.toLowerCase()
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
    return sortableUsers
  }, [filteredUsers, sortConfig])

  const requestSort = key => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  if (loading) {
    return <div>Loading users...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        <FiSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search by email"
          className="border border-gray-300 rounded px-4 py-2 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader>
            <TableRow>
              {/* Email Column with Sorting */}
              <TableHead 
                className="text-center cursor-pointer" 
                onClick={() => requestSort('email')}
              >
                <span className="flex items-center justify-center">
                  Email
                  {sortConfig.key === 'email' && (
                    sortConfig.direction === 'asc' ? 
                      <FiArrowUp className="ml-1" /> : 
                      <FiArrowDown className="ml-1" />
                  )}
                </span>
              </TableHead>
              {/* Booking Counts Column with Sorting */}
              <TableHead 
                className="text-center cursor-pointer" 
                onClick={() => requestSort('bookingCount')}
              >
                <span className="flex items-center justify-center">
                  Bookings
                  {sortConfig.key === 'bookingCount' && (
                    sortConfig.direction === 'asc' ? 
                      <FiArrowUp className="ml-1" /> : 
                      <FiArrowDown className="ml-1" />
                  )}
                </span>
              </TableHead>
              {/* Role Column */}
              <TableHead className="text-center">
                Role
              </TableHead>
              {/* Photo Column */}
              <TableHead className="text-center">
                Photo
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user) => {
              const count = bookingCounts[user.id] || 0
              return (
                <TableRow key={user.id}>
                  <TableCell className="text-center px-6 py-4 whitespace-nowrap">
                    {user.email || "N/A"}
                  </TableCell>
                  <TableCell className="text-center px-6 py-4 whitespace-nowrap">
                    {count}
                  </TableCell>
                  <TableCell className="text-center px-6 py-4 whitespace-nowrap">
                    {user.role === 'admin' ? (
                      <Badge variant="destructive">Admin</Badge>
                    ) : (
                      <Badge variant="success">User</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center px-6 py-4 whitespace-nowrap">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={`${user.email}'s profile`} 
                        className="w-12 h-12 rounded-full mx-auto" 
                      />
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {sortedUsers.length === 0 && (
          <div className="text-center py-4">No users found.</div>
        )}
      </div>
    </div>
  )
}

export default Users
