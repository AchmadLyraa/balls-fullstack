import {
  PrismaClient,
  UserRole,
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
  SourceType,
  RedemptionStatus,
} from "@prisma/client"
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

  // Create user points
  const userPoints = await prisma.userPoint.upsert({
    where: { id: "user-points-1" },
    update: { points: 100 },
    create: {
      id: "user-points-1",
      userId: customer.id,
      points: 100,
      isActive: true,
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  })

  // Create fields
  const fieldA = await prisma.field.create({
    data: {
      name: "Field A (North Wing)",
      description: "Standard field with artificial grass",
      capacity: 10,
      hourlyRate: 150000, // Rp 150,000 per hour
      isAvailable: true,
      notes: "Perfect for small teams",
    },
  })

  const fieldB = await prisma.field.create({
    data: {
      name: "Field B (South Wing)",
      description: "Premium field with natural grass",
      capacity: 22,
      hourlyRate: 200000, // Rp 200,000 per hour
      isAvailable: true,
      notes: "Full-size field for professional matches",
    },
  })

  // Create loyalty programs
  const loyaltyPrograms = await Promise.all([
    prisma.loyaltyProgram.create({
      data: {
        programName: "25% Off Booking Hour",
        description: "Get 25% discount on your next booking",
        pointsRequired: 70,
        isActive: true,
        imageUrl: "/placeholder.svg?height=200&width=200",
      },
    }),
    prisma.loyaltyProgram.create({
      data: {
        programName: "Fried Rice",
        description: "Free fried rice at BAS Cafe",
        pointsRequired: 80,
        isActive: true,
        imageUrl: "/placeholder.svg?height=200&width=200",
      },
    }),
    prisma.loyaltyProgram.create({
      data: {
        programName: "Burger BAS",
        description: "Free burger at BAS Cafe",
        pointsRequired: 60,
        isActive: true,
        imageUrl: "/placeholder.svg?height=200&width=200",
      },
    }),
    prisma.loyaltyProgram.create({
      data: {
        programName: "50% Off Booking Hour",
        description: "Get 50% discount on your next booking",
        pointsRequired: 140,
        isActive: true,
        imageUrl: "/placeholder.svg?height=200&width=200",
      },
    }),
    prisma.loyaltyProgram.create({
      data: {
        programName: "50% Off Shoes Rent",
        description: "Get 50% discount on shoes rental",
        pointsRequired: 50,
        isActive: true,
        imageUrl: "/placeholder.svg?height=200&width=200",
      },
    }),
  ])

  // Create a sample booking
  const bookingDate = new Date("2025-05-12")
  const startTime = new Date("2025-05-12T15:00:00Z")
  const endTime = new Date("2025-05-12T17:00:00Z")
  const duration = 2.0 // 2 hours

  const booking = await prisma.booking.create({
    data: {
      userId: customer.id,
      fieldId: fieldA.id,
      bookingDate: bookingDate,
      startTime: startTime,
      endTime: endTime,
      duration: duration,
      amount: 300000, // Rp 300,000 for 2 hours
      status: BookingStatus.CONFIRMED,
      notes: "Regular booking",
    },
  })

  // Create a sample payment
  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      userId: customer.id,
      amount: 300000,
      method: PaymentMethod.BANK_TRANSFER,
      status: PaymentStatus.PAID,
      transactionId: "TRX-" + Math.floor(Math.random() * 1000000),
      paymentDate: new Date(),
    },
  })

  // Create booking points
  const bookingPoints = await prisma.bookingPoint.create({
    data: {
      userId: customer.id,
      bookingId: booking.id,
      points: 30, // 30 points for this booking
    },
  })

  // Create point source record
  const pointSource = await prisma.pointSource.create({
    data: {
      userId: customer.id,
      sourceId: booking.id,
      points: 30,
      sourceType: SourceType.BOOKING,
    },
  })

  // Create a sample redemption
  const redemption = await prisma.redemption.create({
    data: {
      userId: customer.id,
      loyaltyProgramId: loyaltyPrograms[0].id,
      pointsUsed: 70,
      status: RedemptionStatus.COMPLETED,
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
