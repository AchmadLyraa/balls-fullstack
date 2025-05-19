import { requireAdminAuth } from "@/lib/auth"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Edit, Trash } from "lucide-react"

export default async function TransactionsPage() {
  await requireAdminAuth()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Transaksi</h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Metode pembayaran</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>ID Pembayaran</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verifikasi</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>20 April 2025</TableCell>
              <TableCell>Transfer bank</TableCell>
              <TableCell>Azhka</TableCell>
              <TableCell>Rp. 300.000</TableCell>
              <TableCell>54tgs676</TableCell>
              <TableCell>Lunas</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Verifikasi
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Verifikasi Pembayaran</DialogTitle>
                      <DialogDescription>ID Pembayaran: 54tgs676</DialogDescription>
                    </DialogHeader>
                    <RadioGroup defaultValue="lunas" className="py-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lunas" id="lunas" />
                        <Label htmlFor="lunas">Lunas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dp" id="dp" />
                        <Label htmlFor="dp">DP</Label>
                      </div>
                    </RadioGroup>
                    <DialogFooter>
                      <Button variant="outline">Batal</Button>
                      <Button>Konfirmasi</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>26 April 2025</TableCell>
              <TableCell>Qris</TableCell>
              <TableCell>Khanza</TableCell>
              <TableCell>Rp. 250.000</TableCell>
              <TableCell>47shs766</TableCell>
              <TableCell>Lunas</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Verifikasi
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>27 April 2025</TableCell>
              <TableCell>COD</TableCell>
              <TableCell>Haqi</TableCell>
              <TableCell>Rp. 200.000</TableCell>
              <TableCell>86e37193</TableCell>
              <TableCell>Belum</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Verifikasi
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
