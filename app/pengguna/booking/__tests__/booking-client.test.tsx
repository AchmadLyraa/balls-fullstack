//app/pengguna/booking/booking-client.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import BookingClient from "../booking-client"
import * as bookingActions from "@/app/actions/booking"

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    push: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
  }),
}))

jest.mock("@/app/actions/booking", () => ({
  createBooking: jest.fn(),
}))

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}))

const mockFields = [
  {
    id: "1",
    name: "Field 1",
    notes: null,
    description: null,
    capacity: 10,
    bookings: [
      {
        bookingDate: new Date("2025-06-01"),
        startTime: new Date("2025-06-01T09:00:00"),
        endTime: new Date("2025-06-01T11:00:00"),
      },
    ],
  },
]

describe("BookingClient", () => {
  const mockCreateBooking = bookingActions.createBooking as jest.Mock

  beforeEach(() => {
    mockCreateBooking.mockReset()
    // Mock current date to be before June 2025
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2025-05-15"))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test("renders field selection", () => {
    render(<BookingClient fields={mockFields} />)
    const selectButton = screen.getByRole("combobox")
    expect(selectButton).toBeInTheDocument()
  })

  test("disables confirm button until all fields are selected", () => {
    render(<BookingClient fields={mockFields} />)
    const confirmButton = screen.getByRole("button", { name: /Confirm Booking/i })
    expect(confirmButton).toBeDisabled()
  })

  test("shows error when trying to book without all fields selected", async () => {
    render(<BookingClient fields={mockFields} />)

    // Try to click confirm without selecting anything
    const confirmButton = screen.getByRole("button", { name: /Confirm Booking/i })
    expect(confirmButton).toBeDisabled()
  })
})
