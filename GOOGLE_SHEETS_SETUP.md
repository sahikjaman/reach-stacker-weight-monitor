# 📊 Setup Google Sheets Integration

## Panduan Lengkap Integrasi dengan Google Sheets

### 🎯 Overview

Sistem ini menggunakan Google Sheets sebagai database untuk menyimpan:
- Data konfigurasi unit reach stacker
- Dimensi dan parameter teknis
- Koefisien kalibrasi regresi
- Data regresi untuk setiap unit

---

## 📝 Langkah 1: Buat Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **"+ Blank"** untuk membuat spreadsheet baru
3. Beri nama: **"Reach Stacker Units Database"**
4. Copy **Spreadsheet ID** dari URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_DISINI/edit
   ```
   Contoh: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

---

## 📝 Langkah 2: Setup Google Apps Script

### 2.1 Buka Script Editor

1. Di Google Sheets, klik **Extensions** → **Apps Script**
2. Hapus kode default yang ada
3. Copy-paste seluruh kode dari file `google-apps-script.js`

### 2.2 Konfigurasi Spreadsheet ID

Di baris 5, ganti dengan Spreadsheet ID Anda:

```javascript
const SPREADSHEET_ID = 'PASTE_SPREADSHEET_ID_DISINI';
```

### 2.3 Deploy as Web App

1. Klik **Deploy** → **New deployment**
2. Click ⚙️ (gear icon) → Select **Web app**
3. Isi form:
   - **Description**: "Reach Stacker API v1"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
4. Klik **Deploy**
5. **Authorize access** (klik Review Permissions → pilih akun → Allow)
6. **Copy Web App URL** yang muncul
   ```
   https://script.google.com/macros/s/DEPLOYMENT_ID/exec
   ```

---

## 📝 Langkah 3: Konfigurasi Frontend

### 3.1 Update setup.html

Buka file `setup.html`, cari baris 1046:

```javascript
const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

Ganti dengan Web App URL yang sudah di-copy:

```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec';
```

### 3.2 Update simulator.html

Buka file `simulator.html`, cari baris 328:

```javascript
const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

Ganti dengan Web App URL yang sama:

```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec';
```

---

## ✅ Langkah 4: Testing

### 4.1 Test Setup Page

1. Buka `setup.html` di browser
2. Isi semua data:
   - **Step 1**: Info unit (nama, merk, tahun, lokasi)
   - **Step 2**: Dimensi alat (semua field wajib diisi)
   - **Step 3**: Data regresi (minimal 10 data point)
   - **Step 4**: Review & Save
3. Klik **"Simpan ke Google Sheets"**
4. Tunggu hingga muncul pesan sukses
5. Check Google Sheets - seharusnya ada sheet baru "Units" dengan data Anda

### 4.2 Test Simulator Page

1. Buka `simulator.html` di browser
2. Tunggu loading data dari Google Sheets
3. Pilih unit dari dropdown
4. Masukkan parameter (sudut, panjang, tekanan)
5. Klik **"Hitung Berat"**
6. Verifikasi hasil perhitungan dan visualisasi

---

## 🔧 Troubleshooting

### Error: "Failed to load units"

**Penyebab:**
- Web App URL salah
- Spreadsheet ID salah
- Apps Script belum di-deploy
- Permission belum di-authorize

**Solusi:**
1. Verifikasi Web App URL sudah benar
2. Pastikan Spreadsheet ID sudah benar
3. Re-deploy Apps Script
4. Clear browser cache dan coba lagi

### Error: "Failed to save data"

**Penyebab:**
- Web App access bukan "Anyone"
- CORS issue

**Solusi:**
1. Re-deploy dengan access "Anyone"
2. Gunakan mode `no-cors` di fetch (sudah ada di code)

### Data tidak muncul di Sheets

**Penyebab:**
- Spreadsheet ID salah
- Permission issue

**Solusi:**
1. Double-check Spreadsheet ID
2. Pastikan akun yang deploy script punya akses ke spreadsheet

---

## 📊 Struktur Data di Google Sheets

Sheet **"Units"** akan memiliki kolom:

| Column | Description | Type |
|--------|-------------|------|
| Timestamp | Waktu save/update | Date |
| Unit Name | Nama unit (unique) | Text |
| Brand/Model | Merk dan model | Text |
| Year | Tahun pembuatan | Number |
| Location | Lokasi operasional | Text |
| Boom Length | Panjang boom (cm) | Number |
| Horizontal Offset | Offset horizontal (cm) | Number |
| Pivot Height | Tinggi pivot (cm) | Number |
| Extension Max | Extension max (cm) | Number |
| Piston Diameter | Diameter piston (mm) | Number |
| Mech Advantage | Mechanical advantage | Number |
| Hydraulic Const | Konstanta hydraulic | Number |
| Rigging Weight | Berat rigging (ton) | Number |
| Load Chart Slope | Slope load chart | Number |
| Load Chart Intercept | Intercept load chart | Number |
| Calib Factor | Faktor kalibrasi | Number |
| Calib Offset | Offset kalibrasi | Number |
| R Squared | R² regresi | Number |
| Total Data Points | Jumlah data regresi | Number |
| Regression Data | JSON data regresi | Text |

---

## 🔐 Security Notes

### ⚠️ Important

Setup ini menggunakan **public access** untuk kemudahan demo dan testing.

**Untuk Production:**

1. **Implementasi Authentication**
   - Gunakan Google Sign-In
   - Validate user di Apps Script
   - Restrict access berdasarkan email domain

2. **Protect Spreadsheet**
   - Set spreadsheet ke "View only" untuk public
   - Hanya script yang bisa write

3. **API Key Protection**
   - Implementasi API key di Apps Script
   - Validate setiap request

4. **Data Validation**
   - Validate semua input di server-side
   - Sanitize data sebelum save

---

## 📱 Advanced Features (Optional)

### 1. Email Notifications

Tambahkan di function `saveUnit()`:

```javascript
MailApp.sendEmail({
  to: 'admin@example.com',
  subject: 'New Unit Saved: ' + data.unit_name,
  body: 'Unit ' + data.unit_name + ' has been saved/updated.'
});
```

### 2. Audit Log

Buat sheet "Audit Log" untuk track semua perubahan:

```javascript
function logAudit(action, unitName, user) {
  const sheet = ss.getSheetByName('Audit Log');
  sheet.appendRow([new Date(), action, unitName, user]);
}
```

### 3. Data Export

Tambahkan function untuk export data ke CSV/Excel:

```javascript
function exportToCSV() {
  // Implementation
}
```

---

## 🚀 Deployment Checklist

- [ ] Google Spreadsheet dibuat
- [ ] Spreadsheet ID di-copy
- [ ] Apps Script code di-paste
- [ ] Spreadsheet ID dikonfigurasi di Apps Script
- [ ] Apps Script di-deploy as Web App
- [ ] Web App URL di-copy
- [ ] Web App URL dikonfigurasi di setup.html
- [ ] Web App URL dikonfigurasi di simulator.html
- [ ] Test setup page - berhasil save
- [ ] Test simulator page - berhasil load dan calculate
- [ ] Data muncul di Google Sheets
- [ ] Visualisasi berfungsi dengan baik

---

## 📞 Support

Jika ada masalah:

1. Check browser console (F12) untuk error messages
2. Check Apps Script logs (View → Logs)
3. Verify semua URL dan ID sudah benar
4. Test dengan data sederhana dulu

---

## 🎉 Selesai!

Setelah semua langkah di atas selesai, sistem Anda siap digunakan!

**Next Steps:**
1. Input data unit pertama via setup.html
2. Test simulasi via simulator.html
3. Deploy ke production (Netlify/Vercel)
4. Share URL ke team

---

*Last Updated: 2025-11-26*

1lqBaXH5Lsvaa8Ry8vtJ6PEb5FfyjxtsHF3x9u3IWgqA
https://script.google.com/macros/s/AKfycbze1pwRac5XV34QzokKr33c0x9kVQsPOVkTPnjHidQo4pREbx1sIDLpUEs2YeYqkQkS4g/exec