#!/bin/bash

# Bağımlılıkları yükle
echo "Bağımlılıklar yükleniyor..."
npm install

# Build işlemini çalıştır
echo "Build işlemi başlatılıyor..."
npm run build

# Başarılı mesajı
echo "Deployment tamamlandı!" 