"use server"

import { PrismaClient, BookingStatus } from "@prisma/client"
import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { z } from "zod"

const prisma = new PrismaClient()

// Validation schema
const createBookingSchema = z.object({
  fieldId: z.string().min(1, "Field is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
})

export async function createBooking(formData: FormData) {
  const user = await getUser()

  if (!user) {
    return { success: false, error: "You must be logged in to create a booking" }
  }

  const fieldId = formData.get("fieldId") as string
  const date = formData.get("date") as string
  const startTime = formData.get("startTime") as string
  const endTime = formData.get("endTime") as string

  try {
    // Validate form data
    createBookingSchema.parse({
      fieldId,
      date,
      startTime,
      endTime,
    })

    // Get field details
    const field = await prisma.field.findUnique({
      where: { id: fieldId },
    })

    if (!field) {
      return { success: false, error: "Field not found" }
    }

    // Parse date and times
    const startDateTime = new Date(`${date}T${startTime}:00`)
    const endDateTime = new Date(`${date}T${endTime}:00`)

    // Calculate duration in hours
    const durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60)

    // Calculate total amount
    const totalAmount = field.hourlyRate.toNumber() * durationHours

    // Check if field is available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        fieldId,
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
        OR: [
          {
            AND: [{ startTime: { lte: startDateTime } }, { endTime: { gt: startDateTime } }],
          },
          {
            AND: [{ startTime: { lt: endDateTime } }, { endTime: { gte: endDateTime } }],
          },
          {
            AND: [{ startTime: { gte: startDateTime } }, { endTime: { lte: endDateTime } }],
          },
        ],
      },
    })

    if (existingBooking) {
      return { success: false, error: "Field is not available at the selected time" }
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        fieldId,
        startTime: startDateTime,
        endTime: endDateTime,
        totalAmount,
        status: BookingStatus.PENDING,
      },
    })

    return { success: true, bookingId: booking.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "An unknown error occurred" }
  }
}

export async function uploadPaymentProof(formData: FormData) {
  const user = await getUser()

  if (!user) {
    return { success: false, error: "You must be logged in to upload payment proof" }
  }

  const bookingId = formData.get("bookingId") as string
  const paymentMethod = formData.get("paymentMethod") as string
  const amount = formData.get("amount") as string
  const proofImage = formData.get("proofImage") as File

  try {
    // Validate booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    })

    if (!booking) {
      return { success: false, error: "Booking not found" }
    }

    if (booking.userId !== user.id) {
      return { success: false, error: "You are not authorized to upload payment for this booking" }
    }

    // In a real application, you would upload the image to a storage service
    // and get a URL to store in the database
    const proofImageUrl = "/placeholder.svg" // Placeholder for demo

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        userId: user.id,
        amount: Number.parseFloat(amount),
        paymentMethod: paymentMethod,
        status: "PENDING",
        proofImageUrl,
      },
    })

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.PENDING },
    })

    return { success: true, paymentId: payment.id }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "An unknown error occurred" }
  }
}

export async function cancelBooking(bookingId: string) {
  const user = await getUser()

  if (!user) {
    return { success: false, error: "You must be logged in to cancel a booking" }
  }

  try {
    // Validate booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    })

    if (!booking) {
      return { success: false, error: "Booking not found" }
    }

    if (booking.userId !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return { success: false, error: "You are not authorized to cancel this booking" }
    }

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED },
    })

    // Update payment status if exists
    await prisma.payment.updateMany({
      where: { bookingId },
      data: { status: "CANCELLED" },
    })

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "An unknown error occurred" }
  }
}

export async function getUserBookings() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        field: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return bookings
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return []
  }
}

export async function getBookingById(bookingId: string) {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        field: true,
        payments: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            phoneNumber: true,
          },
        },
      },
    })

    if (!booking) {
      return null
    }

    // Check if user is authorized to view this booking
    if (booking.userId !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return null
    }

    return booking
  } catch (error) {
    console.error("Error fetching booking:", error)
    return null
  }
}
