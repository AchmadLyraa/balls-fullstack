import { requireAdminAuth } from "@/lib/server-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for the chart
const data = [
  {
    name: "01 Apr",
    "Lapangan A": 4,
    "Lapangan B": 3,
  },
  {
    name: "12 Apr",
    "Lapangan A": 3,
    "Lapangan B": 5,
  },
  {
    name: "30 Apr",
    "Lapangan A": 6,
    "Lapangan B": 4,
  },
]

export default async function ReportPage() {
  await requireAdminAuth()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Report</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Filter laporan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-date">Dari Tanggal</Label>
              <Input id="from-date" type="date" defaultValue="2024-04-01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-date">Sampai Tanggal</Label>
              <Input id="to-date" type="date" defaultValue="2024-04-30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-id">ID Lapangan (Opsional)</Label>
              <Input id="field-id" placeholder="ID Lapangan" />
            </div>
          </div>
          <Button className="mt-4">Tampilkan Laporan</Button>
        </CardContent>
      </Card>

      <div className="bg-green-50 border border-green-200 p-4 rounded-md">
        <p className="text-green-800">Booking report generated successfully (Simulated Data)</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-2">Ringkasan Laporan</h2>
          <p className="text-sm text-gray-500 mb-4">2024-04-01 - 2024-04-30</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-md border">
              <h3 className="text-sm font-medium text-gray-500">Total Booking</h3>
              <p className="text-2xl font-bold">51</p>
            </div>
            <div className="bg-white p-4 rounded-md border">
              <h3 className="text-sm font-medium text-gray-500">Booking Selesai</h3>
              <p className="text-2xl font-bold">42</p>
            </div>
            <div className="bg-white p-4 rounded-md border">
              <h3 className="text-sm font-medium text-gray-500">Booking Dibatalkan</h3>
              <p className="text-2xl font-bold">9</p>
            </div>
            <div className="bg-white p-4 rounded-md border">
              <h3 className="text-sm font-medium text-gray-500">Total Pendapatan</h3>
              <p className="text-2xl font-bold">Rp 12.750.000</p>
            </div>
          </div>

          <Separator className="my-6" />

          <h2 className="text-lg font-semibold mb-4">Penggunaan Lapangan</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Lapangan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Lapangan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah Booking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Jam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pendapatan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">field-123abc</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Lapangan A (Contoh)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">45</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp 4.500.000</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">field-456def</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Lapangan B (Contoh)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">23</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp 3.200.000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 h-80">
            <h3 className="text-md font-medium mb-4">Jumlah Booking</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Lapangan A" fill="#8884d8" />
                <Bar dataKey="Lapangan B" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <Separator className="my-6" />

          <h2 className="text-lg font-semibold mb-4">Detail Booking Harian</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah Booking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pendapatan Harian (Rp)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2024-04-01</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp 750.000</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2024-04-02</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp 1.100.000</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2024-04-03</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp 1.200.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
