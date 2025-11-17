import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EVENT_ID = 1;
const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K']; // 10 Rows
const SEAT_PER_ROW = 50; // 50 Seats per row
const TOTAL_USERS = 10000; // สร้าง user ไว้รองรับ k6 VUs

async function main() {
  console.log('Seeding database...');

  // 1. Create a main event
  console.log('Creating event...');
  const event = await prisma.event.upsert({
    where: { id: EVENT_ID },
    update: {},
    create: {
      id: EVENT_ID,
      name: 'BLACKPINK WORLD TOUR [BORN PINK]',
      date: new Date('2025-11-28T19:00:00Z'),
    },
  });
  console.log(`Created event "${event.name}" with ID: ${event.id}`);

  // 2. Create seats for the event
  console.log(
    `Creating ${SEAT_ROWS.length * SEAT_PER_ROW} seats for event ID ${EVENT_ID}...`,
  );
  // --- CHANGED: Explicitly type the promise array ---
  const seatCreationPromises: Prisma.PrismaPromise<any>[] = [];
  for (const row of SEAT_ROWS) {
    for (let i = 1; i <= SEAT_PER_ROW; i++) {
      const seatNumber = `${row}${i}`;
      const promise = prisma.seat.upsert({
        where: {
          eventId_seatNumber: {
            eventId: EVENT_ID,
            seatNumber: seatNumber,
          },
        },
        update: {},
        create: {
          eventId: EVENT_ID,
          seatNumber: seatNumber,
          status: 'AVAILABLE',
        },
      });
      seatCreationPromises.push(promise);
    }
  }
  await Promise.all(seatCreationPromises);
  console.log('Seats created successfully.');

  // 3. Create users to simulate concurrent bookings
  console.log(`Creating ${TOTAL_USERS} users...`);
  const userCreationPromises: Prisma.PrismaPromise<any>[] = [];
  for (let i = 1; i <= TOTAL_USERS; i++) {
    const promise = prisma.user.upsert({
      where: { email: `user${i}@test.com` },
      update: {},
      create: {
        id: i, // Explicitly set ID to match k6's __VU
        email: `user${i}@test.com`,
        name: `Test User ${i}`,
      },
    });
    userCreationPromises.push(promise);
  }
  await Promise.all(userCreationPromises);
  console.log('Users created successfully.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
