"use client"
import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { getAuth } from "firebase/auth"
import { getFirestore, doc, updateDoc, Timestamp } from "firebase/firestore"
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

function EditEvent({ eventData, onClose }) {
  const auth = getAuth(app)
  const db = getFirestore(app)
  const storage = getStorage(app)
  const [imageFile, setImageFile] = useState(null)
  const user = auth.currentUser

  const form = useForm({
    defaultValues: {
      title: eventData.title || "",
      description: eventData.description || "",
      participantLimit: eventData.participantLimit || "",
      location: eventData.location || "",
    },
  })

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const onSubmit = async (data) => {
    try {
      let imageUrl = eventData.imageUrl || null
      if (imageFile) {
        const imageRef = storageRef(storage, `eventImages/${imageFile.name}`)
        await uploadBytes(imageRef, imageFile)
        imageUrl = await getDownloadURL(imageRef)
      }

      const eventDocRef = doc(db, "events", eventData.id)
      await updateDoc(eventDocRef, {
        title: data.title,
        description: data.description,
        participantLimit: parseInt(data.participantLimit),
        location: data.location,
        imageUrl: imageUrl,
        price: data.price,
        updatedAt: Timestamp.now(),
        updatedBy: user.uid,
      })

      toast.success("Event updated successfully!")
      form.reset()
      onClose()
    } catch (error) {
      console.error("Error updating event:", error)
      toast.error(`Error updating event: ${error.message}`)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Modify the details of the event below.
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
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (RM /day)</FormLabel>
                    <FormControl>
                      <Input placeholder="Price" {...field} />
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
              <Button type="submit">Update Event</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditEvent
