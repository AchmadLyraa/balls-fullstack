import { PrismaClient, UserRole, BookingStatus, PaymentStatus, PaymentMethod } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seeding...")

  // Create users
  const superAdminPassword = await hash("password123", 10)
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@example.com" },
    update: {},
    create: {
      email: "superadmin@example.com",
      username: "superadmin",
      password: superAdminPassword,
      fullName: "Super Admin",
      phoneNumber: "081234567890",
      role: UserRole.SUPER_ADMIN,
    },
  })

  const adminPassword = await hash("password123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      username: "admin",
      password: adminPassword,
      fullName: "Admin User",
      phoneNumber: "081234567891",
      role: UserRole.ADMIN,
    },
  })

  const customerPassword = await hash("password123", 10)
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      username: "customer",
      password: customerPassword,
      fullName: "Customer User",
      phoneNumber: "081234567892",
      role: UserRole.CUSTOMER,
    },
  })

  // Create loyalty card for customer
  const loyaltyCard = await prisma.loyaltyCard.upsert({
    where: { userId: customer.id },
    update: { stamps: 15 },
    create: {
      userId: customer.id,
      stamps: 15,
    },
  })

  // Create fields
  const fieldA = await prisma.field.create({
    data: {
      name: "Field A (North Wing)",
      description: "Standard field with artificial grass",
      hourlyRate: 150000, // Rp 150,000 per hour
    },
  })

  const fieldB = await prisma.field.create({
    data: {
      name: "Field B (South Wing)",
      description: "Premium field with natural grass",
      hourlyRate: 200000, // Rp 200,000 per hour
    },
  })

  // Create rewards
  const rewards = await Promise.all([
    prisma.reward.create({
      data: {
        name: "25% Off Booking Hour",
        description: "Get 25% discount on your next booking",
        stampsRequired: 7,
      },
    }),
    prisma.reward.create({
      data: {
        name: "Fried Rice",
        description: "Free fried rice at BAS Cafe",
        stampsRequired: 8,
      },
    }),
    prisma.reward.create({
      data: {
        name: "Burger BAS",
        description: "Free burger at BAS Cafe",
        stampsRequired: 6,
      },
    }),
    prisma.reward.create({
      data: {
        name: "50% Off Booking Hour",
        description: "Get 50% discount on your next booking",
        stampsRequired: 14,
      },
    }),
    prisma.reward.create({
      data: {
        name: "50% Off Shoes Rent",
        description: "Get 50% discount on shoes rental",
        stampsRequired: 5,
      },
    }),
  ])

  // Create a sample booking
  const booking = await prisma.booking.create({
    data: {
      userId: customer.id,
      fieldId: fieldA.id,
      startTime: new Date("2025-05-12T15:00:00Z"),
      endTime: new Date("2025-05-12T17:00:00Z"),
      totalAmount: 300000, // Rp 300,000 for 2 hours
      status: BookingStatus.CONFIRMED,
    },
  })

  // Create a sample payment
  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      userId: customer.id,
      amount: 300000,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      status: PaymentStatus.PAID,
      paidAt: new Date(),
    },
  })

  // Create a sample redemption
  const redemption = await prisma.redemption.create({
    data: {
      userId: customer.id,
      loyaltyCardId: loyaltyCard.id,
      rewardId: rewards[0].id,
      stampsUsed: 7,
      status: "COMPLETED",
    },
  })

  console.log("Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
