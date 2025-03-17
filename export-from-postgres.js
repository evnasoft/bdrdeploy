const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'yedekparca',
  user: 'postgres',
  password: 'postgres'
});

async function exportData() {
  try {
    await client.connect();
    
    // Kategoriler
    const categories = await client.query('SELECT * FROM "Category"');
    const categoriesInsert = categories.rows.map(row => {
      return `('${row.id}', '${row.name.replace(/'/g, "''")}', '${row.slug}', ${row.description ? `'${row.description.replace(/'/g, "''")}'` : 'NULL'}, ${row.parentId ? `'${row.parentId}'` : 'NULL'}, ${row.isActive ? 1 : 0}, '${row.createdAt.toISOString()}', '${row.updatedAt.toISOString()}')`;
    }).join(',\n');

    // Markalar
    const brands = await client.query('SELECT * FROM "Brand"');
    const brandsInsert = brands.rows.map(row => {
      return `('${row.id}', '${row.name.replace(/'/g, "''")}', '${row.slug}', ${row.description ? `'${row.description.replace(/'/g, "''")}'` : 'NULL'}, ${row.logo ? `'${row.logo}'` : 'NULL'}, ${row.isActive ? 1 : 0}, '${row.createdAt.toISOString()}', '${row.updatedAt.toISOString()}')`;
    }).join(',\n');

    // Makine Modelleri
    const models = await client.query('SELECT * FROM "MachineModel"');
    const modelsInsert = models.rows.map(row => {
      return `('${row.id}', '${row.name.replace(/'/g, "''")}', ${row.year || 'NULL'}, '${row.type}', '${row.brandId}', ${row.isActive ? 1 : 0}, '${row.createdAt.toISOString()}', '${row.updatedAt.toISOString()}')`;
    }).join(',\n');

    // Ürünler
    const products = await client.query('SELECT * FROM "Product"');
    const productsInsert = products.rows.map(row => {
      return `('${row.id}', '${row.name.replace(/'/g, "''")}', '${row.slug}', ${row.description ? `'${row.description.replace(/'/g, "''")}'` : 'NULL'}, ${row.sku ? `'${row.sku}'` : 'NULL'}, ${row.partNumber ? `'${row.partNumber}'` : 'NULL'}, ${row.oemNumber ? `'${row.oemNumber}'` : 'NULL'}, ${row.price || 'NULL'}, ${row.stock}, '${JSON.stringify(row.specifications)}', '${JSON.stringify(row.images)}', ${row.isActive ? 1 : 0}, '${row.createdAt.toISOString()}', '${row.updatedAt.toISOString()}', ${row.categoryId ? `'${row.categoryId}'` : 'NULL'}, ${row.brandId ? `'${row.brandId}'` : 'NULL'})`;
    }).join(',\n');

    // Kullanıcılar
    const users = await client.query('SELECT * FROM "User"');
    const usersInsert = users.rows.map(row => {
      return `('${row.id}', ${row.name ? `'${row.name.replace(/'/g, "''")}'` : 'NULL'}, '${row.email}', '${row.password}', '${row.role}', ${row.isActive ? 1 : 0}, '${row.createdAt.toISOString()}', '${row.updatedAt.toISOString()}')`;
    }).join(',\n');

    // Ayarlar
    const settings = await client.query('SELECT * FROM "Settings"');
    const settingsInsert = settings.rows.map(row => {
      return `('${row.id}', '${row.key}', '${row.value.replace(/'/g, "''")}', '${row.createdAt.toISOString()}', '${row.updatedAt.toISOString()}')`;
    }).join(',\n');

    const mysqlScript = `
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Kategoriler
INSERT INTO \`Category\` (\`id\`, \`name\`, \`slug\`, \`description\`, \`parentId\`, \`isActive\`, \`createdAt\`, \`updatedAt\`) VALUES
${categoriesInsert};

-- Markalar
INSERT INTO \`Brand\` (\`id\`, \`name\`, \`slug\`, \`description\`, \`logo\`, \`isActive\`, \`createdAt\`, \`updatedAt\`) VALUES
${brandsInsert};

-- Makine Modelleri
INSERT INTO \`MachineModel\` (\`id\`, \`name\`, \`year\`, \`type\`, \`brandId\`, \`isActive\`, \`createdAt\`, \`updatedAt\`) VALUES
${modelsInsert};

-- Ürünler
INSERT INTO \`Product\` (\`id\`, \`name\`, \`slug\`, \`description\`, \`sku\`, \`partNumber\`, \`oemNumber\`, \`price\`, \`stock\`, \`specifications\`, \`images\`, \`isActive\`, \`createdAt\`, \`updatedAt\`, \`categoryId\`, \`brandId\`) VALUES
${productsInsert};

-- Kullanıcılar
INSERT INTO \`User\` (\`id\`, \`name\`, \`email\`, \`password\`, \`role\`, \`isActive\`, \`createdAt\`, \`updatedAt\`) VALUES
${usersInsert};

-- Ayarlar
INSERT INTO \`Settings\` (\`id\`, \`key\`, \`value\`, \`createdAt\`, \`updatedAt\`) VALUES
${settingsInsert};

SET FOREIGN_KEY_CHECKS = 1;
`;

    fs.writeFileSync('mysql_import.sql', mysqlScript);
    console.log('Veriler başarıyla dışa aktarıldı: mysql_import.sql');

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await client.end();
  }
}

exportData(); 