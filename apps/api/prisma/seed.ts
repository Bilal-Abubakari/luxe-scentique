import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Seed Super Admins
  const superAdmins = [
    {
      email: process.env['SUPER_ADMIN_EMAIL'] ?? 'abubakaribilal99@gmail.com',
      name: 'Bilal Abubakari',
    },
    {
      email: process.env['SUPER_ADMIN_EMAIL_2'] ?? 'bawahuda22@gmail.com',
      name: 'Bawa Huda',
    },
  ];

  for (const admin of superAdmins) {
    const superAdmin = await prisma.user.upsert({
      where: { email: admin.email },
      update: { role: 'SUPER_ADMIN' },
      create: {
        email: admin.email,
        name: admin.name,
        role: 'SUPER_ADMIN',
      },
    });
    console.log(`Super admin seeded: ${superAdmin.email}`);
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => { //NOSONAR
    await prisma.$disconnect();
  });
