"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserJwtPayload } from "@/lib/auth"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { QrCode } from "lucide-react"
import { getUserLoyaltyCard, getAvailableRewards, getUserRedemptions, redeemReward } from "@/app/actions/loyalty"

interface LoyaltyClientProps {
  user: UserJwtPayload
}

export default function LoyaltyClient({ user }: LoyaltyClientProps) {
  const [selectedReward, setSelectedReward] = useState<any | null>(null)
  const [showQrCode, setShowQrCode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loyaltyCard, setLoyaltyCard] = useState<any>(null)
  const [rewards, setRewards] = useState<any[]>([])
  const [redemptionHistory, setRedemptionHistory] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [cardData, rewardsData, redemptionsData] = await Promise.all([
          getUserLoyaltyCard(),
          getAvailableRewards(),
          getUserRedemptions(),
        ])

        setLoyaltyCard(cardData)
        setRewards(rewardsData || [])
        setRedemptionHistory(redemptionsData || [])
      } catch (error) {
        console.error("Error loading loyalty data:", error)
        toast.error("Failed to load loyalty data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleRedeemReward = async (reward: any) => {
    if (!loyaltyCard || loyaltyCard.stamps < reward.stampsRequired) {
      toast.error("You don't have enough stamps to redeem this reward")
      return
    }

    try {
      const result = await redeemReward(reward.id)

      if (result.success) {
        setSelectedReward(reward)
        setShowQrCode(true)

        // Update stamps count
        setLoyaltyCard({
          ...loyaltyCard,
          stamps: loyaltyCard.stamps - reward.stampsRequired,
        })

        // Add to redemption history
        setRedemptionHistory([
          {
            id: result.redemptionId,
            reward: reward,
            stampsUsed: reward.stampsRequired,
            status: "PENDING",
            redeemedAt: new Date().toISOString(),
          },
          ...redemptionHistory,
        ])

        toast.success("Reward redeemed successfully!")
      } else {
        toast.error(result.error || "Failed to redeem reward")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-40">
              <p>Loading loyalty data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Loyalty Card Digital</h1>
              <p className="text-gray-500">Pilih hadiah dan tukar stampel kamu!</p>
            </div>
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg">
              <p className="text-sm">Your Stamps</p>
              <p className="text-2xl font-bold">{loyaltyCard?.stamps || 0}</p>
            </div>
          </div>

          <Tabs defaultValue="rewards" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
              <TabsTrigger value="history">Gift History</TabsTrigger>
            </TabsList>

            <TabsContent value="rewards" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map((reward) => (
                  <Card key={reward.id} className="overflow-hidden">
                    <img
                      src={reward.imageUrl || "/placeholder.svg?height=200&width=200"}
                      alt={reward.name}
                      className="w-full h-40 object-cover"
                    />
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{reward.name}</h3>
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          {reward.stampsRequired} Stamp
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{reward.description}</p>
                      <Button
                        onClick={() => handleRedeemReward(reward)}
                        disabled={!loyaltyCard || loyaltyCard.stamps < reward.stampsRequired}
                        className="w-full mt-2 bg-red-600 hover:bg-red-700"
                        size="sm"
                      >
                        {!loyaltyCard || loyaltyCard.stamps < reward.stampsRequired ? "Not Enough Stamps" : "Redeem"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history">
              {redemptionHistory.length > 0 ? (
                <div className="space-y-4">
                  {redemptionHistory.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{item.reward.name}</h3>
                          <p className="text-sm text-gray-500">{item.stampsUsed} Stamp</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{new Date(item.redeemedAt).toLocaleDateString()}</p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : item.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No redemption history yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tunjukkan QR Code ini kepada kasir BAS!</DialogTitle>
            <DialogDescription>Scan this QR code to redeem your reward</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="bg-white p-4 rounded-lg border">
              <QrCode className="w-48 h-48" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowQrCode(false)}>Oke</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
