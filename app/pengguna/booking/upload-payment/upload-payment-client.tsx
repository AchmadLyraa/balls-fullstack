"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserJwtPayload } from "@/lib/auth"
import { toast } from "sonner"
import { Upload } from "lucide-react"
import { uploadPaymentProof } from "@/app/actions/booking"

interface UploadPaymentClientProps {
  user: UserJwtPayload
}

export default function UploadPaymentClient({ user }: UploadPaymentClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")

  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("BANK_TRANSFER")
  const [amount, setAmount] = useState<string>("450000")

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload")
      return
    }

    if (!bookingId) {
      toast.error("Booking ID is missing")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("bookingId", bookingId)
      formData.append("paymentMethod", paymentMethod)
      formData.append("amount", amount)
      formData.append("proofImage", file)

      const result = await uploadPaymentProof(formData)

      if (result.success) {
        toast.success("Payment proof uploaded successfully!")
        router.push("/pengguna/booking/success")
      } else {
        toast.error(result.error || "Failed to upload payment proof")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsUploading(false)
    }
  }

  if (!bookingId) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600">Error</h1>
              <p className="text-gray-500 mt-2">Booking ID is missing. Please try again.</p>
              <Button className="mt-4 bg-red-600 hover:bg-red-700" onClick={() => router.push("/pengguna/booking")}>
                Back to Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Upload Bukti Pembayaran</h1>
            <p className="text-gray-500">Please upload your payment proof to confirm your booking</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="QRIS">QRIS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Rp)</Label>
              <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center ${
              isDragging ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />

              {file ? (
                <div className="text-center">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Button variant="ghost" size="sm" className="mt-2 text-red-600" onClick={() => setFile(null)}>
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <p className="mb-2 text-sm font-medium">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or PDF (MAX. 10MB)</p>
                </>
              )}

              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,application/pdf"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            {!file ? (
              <label htmlFor="file-upload">
                <Button as="span" className="bg-red-600 hover:bg-red-700">
                  Browse
                </Button>
              </label>
            ) : (
              <Button onClick={handleUpload} disabled={isUploading} className="bg-red-600 hover:bg-red-700">
                {isUploading ? "Uploading..." : "Upload Bukti Pembayaran"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
