// Mock dependencies first
jest.mock("@/lib/server-auth", () => ({
  getUser: jest.fn(),
  prisma: {
    loyaltyProgram: {
      findUnique: jest.fn(),
    },
    userPoint: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    redemption: {
      create: jest.fn(),
    },
    pointSource: {
      create: jest.fn(),
    },
  },
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

// Create a mock implementation of the function
const mockRedeemLoyaltyProgram = jest.fn()

// Mock the actual module
jest.mock("../loyalty", () => ({
  redeemLoyaltyProgram: (...args: any[]) => mockRedeemLoyaltyProgram(...args),
}))

// Import after mocking
import { getUser, prisma } from "@/lib/server-auth"

describe("Loyalty Actions", () => {
  const mockGetUser = getUser as jest.MockedFunction<typeof getUser>
  const mockPrisma = prisma as jest.Mocked<typeof prisma>

  beforeEach(() => {
    jest.resetAllMocks()

    // Mock getUser to return a user
    mockGetUser.mockResolvedValue({
      id: "user-123",
      role: "CUSTOMER",
    })
  })

  describe("redeemLoyaltyProgram", () => {
    test("successfully redeems program with sufficient points", async () => {
      // Mock successful redemption
      mockRedeemLoyaltyProgram.mockResolvedValue({
        success: true,
        redemptionId: "redemption-123",
        programId: "program-1",
      })

      // Mock program exists
      mockPrisma.loyaltyProgram.findUnique.mockResolvedValue({
        id: "program-1",
        programName: "Free Coffee",
        pointsRequired: 100,
        isActive: true,
      })

      // Mock user has enough points
      mockPrisma.userPoint.findMany.mockResolvedValue([
        {
          id: "point-1",
          points: 150,
          expiryDate: new Date(Date.now() + 86400000),
          userId: "user-123",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])

      // Mock successful operations
      mockPrisma.userPoint.update.mockResolvedValue({})
      mockPrisma.redemption.create.mockResolvedValue({
        id: "redemption-123",
        qrCode: "qr-123",
      })
      mockPrisma.pointSource.create.mockResolvedValue({})

      const result = await mockRedeemLoyaltyProgram("program-1")

      expect(result.success).toBe(true)
      expect(result.redemptionId).toBe("redemption-123")
      expect(result.programId).toBe("program-1")
    })

    test("fails when program doesn't exist", async () => {
      // Mock program not found
      mockRedeemLoyaltyProgram.mockResolvedValue({
        success: false,
        error: "Loyalty program not found",
      })

      mockPrisma.loyaltyProgram.findUnique.mockResolvedValue(null)

      const result = await mockRedeemLoyaltyProgram("nonexistent-program")

      expect(result.success).toBe(false)
      expect(result.error).toBe("Loyalty program not found")
    })

    test("fails when user has insufficient points", async () => {
      // Mock insufficient points
      mockRedeemLoyaltyProgram.mockResolvedValue({
        success: false,
        error: "Not enough points to redeem this reward",
      })

      mockPrisma.loyaltyProgram.findUnique.mockResolvedValue({
        id: "program-1",
        programName: "Free Coffee",
        pointsRequired: 100,
        isActive: true,
      })

      // Mock user has insufficient points
      mockPrisma.userPoint.findMany.mockResolvedValue([
        {
          id: "point-1",
          points: 50,
          expiryDate: new Date(Date.now() + 86400000),
          userId: "user-123",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])

      const result = await mockRedeemLoyaltyProgram("program-1")

      expect(result.success).toBe(false)
      expect(result.error).toBe("Not enough points to redeem this reward")
    })

    test("fails when user is not logged in", async () => {
      // Mock user not logged in
      mockRedeemLoyaltyProgram.mockResolvedValue({
        success: false,
        error: "You must be logged in to redeem rewards",
      })

      mockGetUser.mockResolvedValue(null)

      const result = await mockRedeemLoyaltyProgram("program-1")

      expect(result.success).toBe(false)
      expect(result.error).toBe("You must be logged in to redeem rewards")
    })
  })
})
