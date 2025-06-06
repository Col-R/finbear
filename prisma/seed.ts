import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'testuser@example.com',
      portfolios: {
        create: [
          {
            name: 'Tech Stocks',
            positions: {
              create: [
                {
                  ticker: 'AAPL',
                  shares: 15,
                  costBasis: 145.0,
                },
                {
                  ticker: 'GOOGL',
                  shares: 8,
                  costBasis: 2800.0,
                },
              ],
            },
          },
          {
            name: 'Crypto Holdings',
            positions: {
              create: [
                {
                  ticker: 'BTC',
                  shares: 0.5,
                  costBasis: 20000.0,
                },
                {
                  ticker: 'ETH',
                  shares: 2,
                  costBasis: 1200.0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`🌱 Seeded user: ${user.email}`);
}

main()
    .catch((err) => {
        console.error('seed script error:', err);
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
