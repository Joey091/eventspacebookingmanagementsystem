// Event.jsx
"use client"
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { getAuth } from "firebase/auth"
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore"
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"
import app from "@/firebase"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'react-hot-toast'

function Event({ onClose }) {
  const auth = getAuth(app)
  const db = getFirestore(app)
  const storage = getStorage(app)
  const [imageFile, setImageFile] = useState(null)
  const user = auth.currentUser

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      participantLimit: "",
      location: "",
    },
  })

  // Handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const onSubmit = async (data) => {
    try {
      let imageUrl = null
      if (imageFile) {
        const imageRef = storageRef(storage, `eventImages/${imageFile.name}`)
        await uploadBytes(imageRef, imageFile)
        imageUrl = await getDownloadURL(imageRef)
      }

      // Add event data to Firestore
      await addDoc(collection(db, "events"), {
        title: data.title,
        description: data.description,
        startDate: Timestamp.fromDate(new Date(data.startDate)),
        endDate: Timestamp.fromDate(new Date(data.endDate)),
        participantLimit: parseInt(data.participantLimit),
        location: data.location,
        imageUrl: imageUrl,
        createdAt: Timestamp.now(),
        createdBy: user.uid,
      })

      toast.success("Event created successfully!")
      form.reset()
      onClose()
    } catch (error) {
      console.error("Error adding event:", error)
      toast.error(`Error adding event: ${error.message}`)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new event.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Event description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* End Date */}
              <FormField
                control={form.control}
                name="endDate"
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Participant Limit */}
              <FormField
                control={form.control}
                name="participantLimit"
                rules={{ required: "Participant limit is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participant Limit</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="Maximum participants" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Event location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Event Image */}
              <FormItem>
                <FormLabel>Event Image</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create Event</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default Event
