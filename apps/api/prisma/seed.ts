import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Seed Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: process.env['SUPER_ADMIN_EMAIL'] ?? 'abubakaribilal99@gmail.com' },
    update: { role: 'SUPER_ADMIN' },
    create: {
      email: process.env['SUPER_ADMIN_EMAIL'] ?? 'abubakaribilal99@gmail.com',
      name: 'Bilal Abubakari',
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`Super admin seeded: ${superAdmin.email}`);

  // Seed Sample Products
  const products = [
    {
      title: 'SPECTRE',
      brand: 'French Avenue',
      vibe: 'CORPORATE' as const,
      description:
        'A commanding corporate fragrance with dark woods and crisp citrus. Authority in a bottle.',
      topNotes: ['Bergamot', 'Black Pepper', 'Lemon'],
      middleNotes: ['Cardamom', 'Violet', 'Geranium'],
      baseNotes: ['Sandalwood', 'Vetiver', 'Musk', 'Oakmoss'],
      price: 450,
      stock: 50,
      images: [],
      isActive: true,
    },
    {
      title: 'MIRAGE',
      brand: 'Desert Rose',
      vibe: 'EVENING' as const,
      description:
        'An enchanting evening scent blending exotic oud with rose and amber for an unforgettable presence.',
      topNotes: ['Saffron', 'Rose', 'Pink Pepper'],
      middleNotes: ['Oud', 'Patchouli', 'Jasmine'],
      baseNotes: ['Amber', 'Vanilla', 'Musk'],
      price: 620,
      stock: 30,
      images: [],
      isActive: true,
    },
    {
      title: 'SOLEIL',
      brand: 'Côte d\'Azur',
      vibe: 'CASUAL' as const,
      description:
        'A bright, fresh daytime fragrance capturing the essence of the Mediterranean coast.',
      topNotes: ['Mandarin', 'Grapefruit', 'Sea Salt'],
      middleNotes: ['Neroli', 'White Tea', 'Iris'],
      baseNotes: ['Cedarwood', 'Musk', 'Ambergris'],
      price: 380,
      stock: 75,
      images: [],
      isActive: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: `seed-${product.title.toLowerCase()}` },
      update: {},
      create: { id: `seed-${product.title.toLowerCase()}`, ...product },
    });
    console.log(`Product seeded: ${product.title}`);
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
