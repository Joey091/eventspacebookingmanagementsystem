"use client"
import React, { useEffect, useState } from 'react'
import { getFirestore, collection, onSnapshot, query, orderBy, doc, deleteDoc, getDoc } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import app from '@/firebase'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import EditEvent from '@/components/dashboard/event/EditEvent' // 导入 EditEvent 组件

function EventList() {
  const db = getFirestore(app)
  const auth = getAuth(app)
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [editingEvent, setEditingEvent] = useState(null) // 新增状态以跟踪正在编辑的事件

  useEffect(() => {
    // 获取用户数据
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        // 从 Firestore 获取用户角色
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserRole(data.role)
        }
      } else {
        setUser(null)
        setUserRole(null)
      }
    })

    // 获取事件数据
    const q = query(collection(db, "events"), orderBy('createdAt', 'desc'))
    const unsubscribeEvents = onSnapshot(q, (querySnapshot) => {
      const eventsData = []
      querySnapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() })
      })
      setEvents(eventsData)
    })

    // 组件卸载时清理订阅
    return () => {
      unsubscribeAuth()
      unsubscribeEvents()
    }
  }, [auth, db])

  const handleEdit = (eventId) => {
    const eventToEdit = events.find(event => event.id === eventId)
    if (eventToEdit) {
      setEditingEvent(eventToEdit) // 设置正在编辑的事件
    }
  }

  const handleDelete = async (eventId) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteDoc(doc(db, "events", eventId))
        toast.success("Event deleted successfully")
      } catch (error) {
        console.error("Error deleting event:", error)
        toast.error(`Error deleting event: ${error.message}`)
      }
    }
  }

  const closeEditModal = () => {
    setEditingEvent(null) // 关闭编辑模态
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-6">Available Event Spaces</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Price</TableHead>
            {userRole === 'admin' && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-24 h-24 object-cover"
                  />
                )}
              </TableCell>
              <TableCell>{event.title}</TableCell>
              <TableCell>{event.description}</TableCell>
              <TableCell>{event.location || 'TBD'}</TableCell>
              <TableCell>{event.participantLimit}</TableCell>
              <TableCell>{event.price}</TableCell>
              {userRole === 'admin' && (
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(event.id)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingEvent && (
        <EditEvent eventData={editingEvent} onClose={closeEditModal} />
      )}
    </div>
  )
}

export default EventList
