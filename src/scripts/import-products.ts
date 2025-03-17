import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import slugify from 'slugify';
import * as path from 'path';

const prisma = new PrismaClient();

async function importProducts() {
  try {
    // Excel dosyasını oku
    console.log('Excel dosyası okunuyor...');
    const workbook = XLSX.readFile('ürün listesi.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // JSON'a çevir
    const products = XLSX.utils.sheet_to_json(worksheet) as Array<{ [key: string]: string }>;
    
    console.log(`Toplam ${products.length} satır bulundu.`);
    
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < products.length; i++) {
      try {
        const row = products[i];
        // İlk ve tek sütundaki değeri al
        const columnName = Object.keys(row)[0]; // '*07145-00050'
        const partNumber = row[columnName];
        
        console.log(`\nSatır ${i + 1} işleniyor:`);
        console.log('- Sütun adı:', columnName);
        console.log('- Parça numarası:', partNumber);

        if (!partNumber || typeof partNumber !== 'string') {
          console.log(`- HATA: Geçersiz parça numarası, atlanıyor.`);
          errorCount++;
          continue;
        }

        // Parça numarasından * işaretini kaldır
        const cleanPartNumber = partNumber.replace(/^\*/, '');
        console.log('- Temizlenmiş parça numarası:', cleanPartNumber);
        
        // Slug oluştur
        const slug = slugify(cleanPartNumber, { 
          lower: true, 
          strict: true,
          locale: 'tr',
          remove: /[*+~.()'"!:@]/g
        });
        console.log('- Oluşturulan slug:', slug);

        const productData = {
          name: cleanPartNumber, // Parça numarasını ürün adı olarak kullan
          partNumber: cleanPartNumber,
          slug: slug,
          stock: 0,
          price: 0,
        };

        // Aynı slug'a sahip ürün var mı kontrol et
        const existingProduct = await prisma.product.findUnique({
          where: { slug: productData.slug }
        });

        if (existingProduct) {
          console.log(`- ATLANDI: "${cleanPartNumber}" zaten mevcut.`);
          continue;
        }

        // Ürünü veritabanına ekle
        console.log('- Ürün veritabanına ekleniyor...');
        const createdProduct = await prisma.product.create({
          data: productData,
        });

        console.log(`- BAŞARILI: Ürün eklendi (${createdProduct.name})`);
        successCount++;
      } catch (error) {
        console.error(`- HATA: Satır ${i + 1} işlenirken hata oluştu:`, error);
        errorCount++;
      }
    }

    console.log('\nİşlem tamamlandı:');
    console.log(`- Başarıyla eklenen ürün sayısı: ${successCount}`);
    console.log(`- Hata oluşan ürün sayısı: ${errorCount}`);
    console.log(`- Toplam işlenen satır sayısı: ${products.length}`);

  } catch (error) {
    console.error('Genel hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importProducts(); 