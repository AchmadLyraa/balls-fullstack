import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import LoyaltyClient from "../loyalty-client"

// Mock dependencies first, before importing anything else
jest.mock("@/app/actions/loyalty", () => ({
  redeemLoyaltyProgram: jest.fn(),
}))

// Import the mocked function after mocking
import { redeemLoyaltyProgram } from "@/app/actions/loyalty"

describe("Loyalty Integration Tests", () => {
  const mockRedeemLoyaltyProgram = redeemLoyaltyProgram as jest.MockedFunction<typeof redeemLoyaltyProgram>

  const mockPrograms = [
    {
      id: "program-1",
      programName: "Free Coffee",
      description: "Get a free coffee",
      pointsRequired: 100,
      isActive: true,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  beforeEach(() => {
    mockRedeemLoyaltyProgram.mockReset()
  })

  test("complete redemption flow from start to QR code display", async () => {
    mockRedeemLoyaltyProgram.mockResolvedValue({
      success: true,
      redemptionId: "test-redemption-123",
      programId: "program-1",
    })

    render(<LoyaltyClient loyaltyPrograms={mockPrograms} userPoints={150} userRedemptions={[]} />)

    // 1. Verify initial state
    expect(screen.getByText("Free Coffee")).toBeInTheDocument()
    expect(screen.getByText("150")).toBeInTheDocument()
    expect(screen.getByText("Redeem")).toBeInTheDocument()

    // 2. Click redeem button
    fireEvent.click(screen.getByText("Redeem"))

    // 3. Verify confirmation dialog appears
    await waitFor(() => {
      expect(screen.getByText("Hold on!")).toBeInTheDocument()
      expect(screen.getByText(/Are you sure you want to exchange 100 points/)).toBeInTheDocument()
    })

    // 4. Confirm the redemption
    fireEvent.click(screen.getByText("Sure"))

    // 5. Verify API call was made
    expect(mockRedeemLoyaltyProgram).toHaveBeenCalledWith("program-1")

    // 6. Verify QR code dialog appears
    await waitFor(() => {
      expect(screen.getByText("Show this QR Code to the BAS cashier!")).toBeInTheDocument()
      expect(screen.getByTestId("qr-code")).toBeInTheDocument()
      expect(screen.getByTestId("qr-code")).toHaveAttribute("data-value", "test-redemption-123")
    })
  })

  test("handles redemption failure gracefully", async () => {
    mockRedeemLoyaltyProgram.mockResolvedValue({
      success: false,
      error: "Program temporarily unavailable",
    })

    render(<LoyaltyClient loyaltyPrograms={mockPrograms} userPoints={150} userRedemptions={[]} />)

    // Attempt redemption
    fireEvent.click(screen.getByText("Redeem"))

    await waitFor(() => {
      fireEvent.click(screen.getByText("Sure"))
    })

    // Verify QR code dialog doesn't appear
    await waitFor(() => {
      expect(screen.queryByText("Show this QR Code to the BAS cashier!")).not.toBeInTheDocument()
    })
  })
})
