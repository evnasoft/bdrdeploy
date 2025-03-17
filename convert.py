import re

def convert_postgres_to_mysql(sql):
    # PostgreSQL'e özgü komutları kaldır
    sql = re.sub(r'SET .*?;', '', sql)
    sql = re.sub(r'SELECT .*?;', '', sql)
    
    # Tüm COPY komutlarını bul
    copy_blocks = re.findall(r'COPY public."(\w+)" \((.*?)\) FROM stdin;\n(.*?)\n\\.', sql, re.DOTALL)
    
    mysql_sql = ""
    for table_name, columns, data in copy_blocks:
        # Meta verileri kaldır (örneğin, "class 2615 OID 20444")
        columns = re.sub(r'class \d+ OID \d+', '', columns).strip()
        
        # Sütun adlarını temizle
        columns = columns.replace('"', '').strip()
        
        # Verileri satır satır işle
        rows = data.split('\n')
        for row in rows:
            if not row.strip():
                continue  # Boş satırları atla
            
            # Verileri MySQL formatına dönüştür
            values = row.replace('\t', "', '")
            mysql_insert = f"INSERT INTO {table_name} ({columns}) VALUES ('{values}');\n"
            mysql_sql += mysql_insert
    
    return mysql_sql

# PostgreSQL yedeğini UTF-8 kodlamasıyla oku
try:
    with open('backup.sql', 'r', encoding='utf-8') as file:
        postgres_sql = file.read()
except UnicodeDecodeError:
    print("Dosya UTF-8 kodlamasıyla okunamadı. Farklı bir kodlama deneyin.")
    exit(1)

# MySQL SQL'ine dönüştür
mysql_sql = convert_postgres_to_mysql(postgres_sql)

# MySQL SQL'ini dosyaya yaz
with open('mysql_backup3.sql', 'w', encoding='utf-8') as file:
    file.write(mysql_sql)

print("Dönüştürme tamamlandı: mysql_backup.sql dosyası oluşturuldu.")