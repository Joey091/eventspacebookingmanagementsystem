// SignUp.jsx
"use client"
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import app from "@/firebase" 
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

function SignUp() {
  const auth = getAuth(app)
  const storage = getStorage(app)
  const db = getFirestore(app)
  const router = useRouter()
  const [profileImage, setProfileImage] = useState(null)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Handle profile image selection
  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0])
    }
  }

  //Function to handle form submission
  async function onSubmit(values) {
    const { email, password, confirmPassword } = values

    //check if the password and confirm password is match 
    if (password !== confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      })
      return
    }

    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // If a profile image is selected, upload it to Firebase Storage
      let photoURL = null
      if (profileImage) {
        const imageRef = storageRef(storage, `profileImages/${user.uid}/${profileImage.name}`)
        await uploadBytes(imageRef, profileImage)
        photoURL = await getDownloadURL(imageRef)
      }

      // Update the user's profile with the photoURL
      await updateProfile(user, {
        photoURL: photoURL,
      })

      // Assign default role of 'user' by adding user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        role: "user",
        email: user.email,
        photoURL: photoURL,
        createdAt: new Date(),
      })

      // Redirect to the dashboard or desired page
      toast.success("User registered successfully")
      router.push('/')
      console.log("User registered successfully")
    } catch (error) {
      toast.error(`Error signing up: ${error.message}`)
      console.error("Error signing up:", error)
      form.setError("email", {
        type: "manual",
        message: error.message,
      })
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left side with background image */}
      <div
        className="basis-1/2 bg-cover bg-center hidden md:block"
        style={{ backgroundImage: "url('/sign-up.jpg')" }}
      ></div>

      {/* Right side with form */}
      <div className="basis-full md:basis-1/2 flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Create an Account</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email field */}
              <FormField
                control={form.control}
                name="email"
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password field */}
              <FormField
                control={form.control}
                name="password"
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Confirm Password field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{ required: "Please confirm your password" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Profile Image Upload */}
              <FormItem>
                <FormLabel className="text-gray-600">Profile Picture (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              {/* Sign Up button */}
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
            {/* Sign in link */}
            <div className="mt-4 text-center">
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="text-blue-500 hover:underline">
                Sign in
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default SignUp
