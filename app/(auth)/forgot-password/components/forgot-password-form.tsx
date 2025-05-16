"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // This is a placeholder for the actual password reset functionality
      // In a real application, you would call a server action to send a reset email
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitted(true)
      toast.success("Password reset instructions sent to your email")
    } catch (error) {
      toast.error("Failed to send reset instructions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-green-50 p-4 rounded-md">
          <p className="text-green-800">
            If an account exists with the email <strong>{email}</strong>, you will receive password reset instructions.
          </p>
        </div>

        <Button
          type="button"
          variant="link"
          className="text-red-700"
          onClick={() => {
            setSubmitted(false)
            setEmail("")
          }}
        >
          Try another email
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full bg-red-700 hover:bg-red-800" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Reset Instructions"}
      </Button>
    </form>
  )
}
