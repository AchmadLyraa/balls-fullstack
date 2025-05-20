import { prisma, requireAuth } from "@/lib/server-auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, Edit, Trash } from "lucide-react";
import type { SearchParams } from "next/dist/server/request/search-params";
import {
  formatDate,
  formatHM,
  formatMoney,
  snakeCaseToTitleCase,
  ucFirst,
} from "@/lib/utils";
import Verify from "./verify";

interface TransactionsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  await requireAuth("ADMIN");

  const search = await searchParams;
  let page = Number(search.page);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  const transactions = await prisma.payment.findMany({
    skip: (page - 1) * 50,
    take: 50,
    include: {
      user: {
        select: {
          fullName: true,
        },
      },
    },
    orderBy: {
      paymentDate: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Manajemen Transaksi
        </h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date Time</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {formatDate(transaction.paymentDate)}{" "}
                  {formatHM(transaction.paymentDate)}
                </TableCell>
                <TableCell>
                  {snakeCaseToTitleCase(transaction.method.toLowerCase())}
                </TableCell>
                <TableCell>{transaction.user.fullName}</TableCell>
                <TableCell>{formatMoney(transaction.amount)}</TableCell>
                <TableCell>
                  {ucFirst(transaction.status.toLowerCase())}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {transaction.status === "PENDING" ? (
                      <Verify transactionId={transaction.id} />
                    ) : (
                      <Button variant="ghost" size="icon" disabled>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
