# 🗄 Setup Database Real-time dengan Supabase

## Langkah 1: Buat Akun Supabase

1. Kunjungi [https://supabase.com](https://supabase.com)
2. Klik "Start your project"
3. Sign up dengan GitHub atau email
4. Buat project baru

## Langkah 2: Buat Tabel Database

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Tabel untuk menyimpan history perhitungan
CREATE TABLE calculations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    angle FLOAT NOT NULL,
    length FLOAT NOT NULL,
    pressure_left FLOAT NOT NULL,
    pressure_right FLOAT NOT NULL,
    weight FLOAT NOT NULL,
    reach FLOAT NOT NULL,
    is_overload BOOLEAN DEFAULT FALSE
);

-- Tabel untuk menyimpan konfigurasi dimensi
CREATE TABLE dimensions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    boom_length FLOAT DEFAULT 906,
    horizontal_offset FLOAT DEFAULT 600,
    pivot_height FLOAT DEFAULT 353,
    extension_max FLOAT DEFAULT 700,
    piston_diameter FLOAT DEFAULT 160,
    mech_advantage FLOAT DEFAULT 302,
    hydraulic_const FLOAT DEFAULT 481.25,
    calib_factor FLOAT DEFAULT 0.98310488,
    calib_offset FLOAT DEFAULT 16512.97,
    rigging_weight FLOAT DEFAULT 4,
    loadchart_slope FLOAT DEFAULT -3.993,
    loadchart_intercept FLOAT DEFAULT 46.43
);

-- Tabel untuk menyimpan data regresi
CREATE TABLE regression_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    condition TEXT NOT NULL CHECK (condition IN ('empty', 'test', 'none')),
    angle FLOAT NOT NULL,
    pressure FLOAT NOT NULL,
    weight FLOAT
);

-- Enable Row Level Security (RLS)
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE regression_data ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (untuk demo)
-- CATATAN: Untuk production, gunakan authentication yang proper!

CREATE POLICY "Allow public read access on calculations" 
    ON calculations FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert access on calculations" 
    ON calculations FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public read access on dimensions" 
    ON dimensions FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert/update access on dimensions" 
    ON dimensions FOR ALL 
    USING (true);

CREATE POLICY "Allow public read access on regression_data" 
    ON regression_data FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert access on regression_data" 
    ON regression_data FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public delete access on regression_data" 
    ON regression_data FOR DELETE 
    USING (true);

-- Insert default dimensions
INSERT INTO dimensions (
    boom_length, horizontal_offset, pivot_height, extension_max,
    piston_diameter, mech_advantage, hydraulic_const,
    calib_factor, calib_offset, rigging_weight,
    loadchart_slope, loadchart_intercept
) VALUES (
    906, 600, 353, 700,
    160, 302, 481.25,
    0.98310488, 16512.97, 4,
    -3.993, 46.43
);
```

## Langkah 3: Dapatkan API Keys

1. Di Supabase Dashboard, klik "Settings" → "API"
2. Copy:
   - **Project URL** (contoh: `https://xxxxx.supabase.co`)
   - **Anon Public Key** (key yang panjang)

## Langkah 4: Konfigurasi Aplikasi

Edit file `database.js`, ganti baris 4-6:

```javascript
const SUPABASE_CONFIG = {
    url: 'PASTE_PROJECT_URL_DISINI',
    anonKey: 'PASTE_ANON_KEY_DISINI'
};
```

## Langkah 5: Test Koneksi

1. Jalankan aplikasi: `npm start`
2. Buka browser console (F12)
3. Cari pesan: `✅ Database connected - Real-time features enabled`

## Fitur Real-time yang Tersedia

### 1. Auto-save Calculations
Setiap kali Anda menghitung berat, hasilnya otomatis tersimpan ke database.

### 2. Sync Dimensions
Perubahan dimensi di satu device akan otomatis ter-update di device lain.

### 3. Shared Regression Data
Data regresi dapat dibagikan antar device untuk kalibrasi bersama.

### 4. Calculation History
Lihat history perhitungan dari semua device yang terhubung.

## Troubleshooting

### Error: "Supabase library not loaded"
- Pastikan file `index.html` sudah include CDN Supabase
- Check koneksi internet

### Error: "Failed to connect to Supabase"
- Periksa URL dan API key sudah benar
- Pastikan project Supabase masih aktif

### Data tidak tersimpan
- Check browser console untuk error messages
- Pastikan RLS policies sudah dibuat dengan benar

## Security Notes

⚠ **PENTING**: Setup di atas menggunakan public access untuk kemudahan demo.

Untuk production:
1. Implementasikan authentication (Supabase Auth)
2. Update RLS policies untuk restrict access
3. Gunakan service role key untuk admin operations

## Deployment

Setelah database setup, aplikasi dapat di-deploy ke:
- **Netlify**: Gratis, auto-deploy dari GitHub
- **Vercel**: Gratis, support serverless functions
- **GitHub Pages**: Gratis, static hosting

Semua platform ini akan tetap bisa connect ke Supabase database Anda!
