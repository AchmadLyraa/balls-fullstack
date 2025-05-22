"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import type { getRewards } from "./page";

interface RewardsProps {
  rewards: Awaited<ReturnType<typeof getRewards>>;
}

export default function Rewards({ rewards }: RewardsProps) {
  return (
    <TabsContent value="rewards" className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward) => (
          <Card>
            <CardContent className="flex flex-col items-center p-6">
              <div className="-mx-6 -mt-4 mb-4 flex h-40 w-full items-center justify-center rounded-md bg-gray-200">
                <span className="text-gray-500">Gambar Produk</span>
              </div>
              <h3 className="font-medium">{reward.programName}</h3>
              <p className="text-sm text-gray-500">
                {reward.pointsRequired} Points
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardContent className="flex h-full flex-col items-center justify-center p-6">
            <Button variant="outline" className="h-16 w-16 rounded-full">
              <Plus className="h-8 w-8" />
            </Button>
            <p className="mt-4 font-medium">Add New Reward</p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
