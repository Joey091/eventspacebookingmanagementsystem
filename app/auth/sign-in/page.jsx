// SignIn.jsx
"use client"
import React from 'react'
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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import app from "@/firebase" 
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

function SignIn() {
  const auth = getAuth(app)
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values) {
    const { email, password } = values


    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success("User signed in successfully")
      router.push('/')
      console.log("User signed in successfully")
    } catch (error) {
      console.error("Error signing in:", error)
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
        style={{ backgroundImage: "url('/sign-in.jpg')" }}
      ></div>

      {/* Right side with form */}
      <div className="basis-full md:basis-1/2 flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
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
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Login button */}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
            {/* Sign up link */}
            <div className="mt-4 text-center">
              Don't have an account?{" "}
              <Link href="/auth/sign-up" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default SignIn
