"use client"

import "@testing-library/jest-dom"

global.HTMLElement.prototype.scrollIntoView = jest.fn()

// Mock console.warn to suppress specific warnings during tests
const originalWarn = console.warn

beforeAll(() => {
  console.warn = (...args) => {
    // Suppress Radix UI Dialog accessibility warnings
    if (
      typeof args[0] === "string" &&
      args[0].includes("Missing `Description` or `aria-describedby={undefined}` for {DialogContent}")
    ) {
      return
    }
    // Call original console.warn for other warnings
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.warn = originalWarn
})

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ""
  },
}))

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />
  },
}))

// Mock fluent-methods
jest.mock("fluent-methods", () => ({
  __esModule: true,
  default: jest.fn((obj) => obj),
}))

// Mock sharp
jest.mock("sharp", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    webp: jest.fn(() => ({
      toFile: jest.fn().mockResolvedValue({}),
      toBuffer: jest.fn().mockResolvedValue(Buffer.from("test")),
    })),
  })),
}))

// Mock react-qr-code
jest.mock("react-qr-code", () => ({
  __esModule: true,
  default: ({ value }) => (
    <div data-testid="qr-code" data-value={value}>
      QR Code: {value}
    </div>
  ),
}))

// Mock server actions
jest.mock("./app/actions/booking", () => ({
  createBooking: jest.fn(),
  uploadPaymentProof: jest.fn(),
  cancelBooking: jest.fn(),
  getUserBookings: jest.fn(),
  getBookingById: jest.fn(),
  setPlayersToBooking: jest.fn(),
  completeBooking: jest.fn(),
}))

// Mock server auth
jest.mock("./lib/server-auth", () => ({
  requireAuth: jest.fn(),
  getUser: jest.fn(),
  prisma: {
    field: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    loyaltyProgram: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    userPoint: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    redemption: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    pointSource: {
      create: jest.fn(),
    },
  },
}))

// Mock next/cache
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

// Mock sonner
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
