const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importData() {
  try {
    // Foreign key checks'i devre dışı bırak
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS=0`;

    // Categories
    const categories = JSON.parse(fs.readFileSync(path.join('C:', 'temp', 'categories.json')));
    for (const category of categories) {
      await prisma.category.create({
        data: category
      });
    }

    // Brands
    const brands = JSON.parse(fs.readFileSync(path.join('C:', 'temp', 'brands.json')));
    for (const brand of brands) {
      await prisma.brand.create({
        data: brand
      });
    }

    // Machine Models
    const machineModels = JSON.parse(fs.readFileSync(path.join('C:', 'temp', 'machine_models.json')));
    for (const model of machineModels) {
      await prisma.machineModel.create({
        data: model
      });
    }

    // Products
    const products = JSON.parse(fs.readFileSync(path.join('C:', 'temp', 'products.json')));
    for (const product of products) {
      // images ve specifications alanlarını JSON'a dönüştür
      const data = {
        ...product,
        images: Array.isArray(product.images) ? JSON.stringify(product.images) : product.images,
        specifications: product.specifications ? JSON.stringify(product.specifications) : null
      };
      await prisma.product.create({
        data
      });
    }

    // Users
    const users = JSON.parse(fs.readFileSync(path.join('C:', 'temp', 'users.json')));
    for (const user of users) {
      await prisma.user.create({
        data: user
      });
    }

    // Settings
    const settings = JSON.parse(fs.readFileSync(path.join('C:', 'temp', 'settings.json')));
    for (const setting of settings) {
      await prisma.settings.create({
        data: setting
      });
    }

    // Foreign key checks'i tekrar etkinleştir
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS=1`;

    console.log('Veri aktarımı başarıyla tamamlandı!');
  } catch (error) {
    console.error('Veri aktarımı sırasında hata oluştu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importData(); 