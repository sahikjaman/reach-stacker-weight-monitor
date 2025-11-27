# 🏗 Reach Stacker Weight Simulator

> **Sistem Profesional untuk Simulasi dan Kalibrasi Timbangan Reach Stacker dengan Integrasi Google Sheets**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤-red.svg)](https://github.com)

---

## 📋 Daftar Isi

- [Overview](#-overview)
- [Fitur Utama](#-fitur-utama)
- [Alur Kerja](#-alur-kerja)
- [Instalasi](#-instalasi)
- [Cara Penggunaan](#-cara-penggunaan)
- [Struktur File](#-struktur-file)
- [Teknologi](#-teknologi)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 Overview

Sistem ini dirancang untuk:

1. **Setup & Kalibrasi** - Input dimensi alat dan data kalibrasi regresi untuk setiap unit reach stacker
2. **Penyimpanan Data** - Semua data tersimpan otomatis di Google Sheets sebagai database
3. **Simulasi Berat** - Pilih unit dan hitung berat container berdasarkan parameter operasional
4. **Visualisasi Real-time** - Lihat visualisasi reach stacker dan hasil perhitungan secara real-time

---

## ✨ Fitur Utama

### 🔧 Setup Unit (setup.html)

**Multi-Step Configuration Wizard:**

1. **Step 1: Informasi Unit**
   - Nama unit (unique identifier)
   - Merk/Model reach stacker
   - Tahun pembuatan
   - Lokasi operasional

2. **Step 2: Dimensi & Parameter Alat**
   - Dimensi boom & struktur (panjang, offset, tinggi pivot, extension max)
   - Parameter hydraulic system (diameter piston, mechanical advantage, konstanta)
   - Load chart parameters (slope, intercept)
   - Berat rigging

3. **Step 3: Data Kalibrasi Regresi**
   - Input data dari 3 kondisi beban:
     - Container Empty (kosong)
     - Test Load (beban diketahui)
     - Tanpa Container
   - Perhitungan regresi linear otomatis
   - Validasi R² untuk akurasi

4. **Step 4: Review & Save**
   - Review semua data yang diinput
   - Save ke Google Sheets dengan 1 klik
   - Auto-redirect ke simulator

### 🎮 Simulator (simulator.html)

**Perhitungan Berat Real-time:**

- **Load Unit Data** - Pilih unit dari dropdown (data dari Google Sheets)
- **Input Parameter** - Sudut boom, panjang teleskopik, tekanan kiri/kanan
- **Hitung Berat** - Perhitungan otomatis berdasarkan formula engineering
- **Visualisasi** - Canvas visualization dengan animasi real-time
- **Overload Detection** - Warning otomatis jika melebihi kapasitas

---

## 🔄 Alur Kerja

```
┌─────────────────┐
│   Setup Unit    │
│  (setup.html)   │
└────────┬────────┘
         │
         │ 1. Input Data Unit
         │ 2. Input Dimensi
         │ 3. Input Data Regresi
         │ 4. Hitung Koefisien
         │
         ▼
┌─────────────────┐
│ Google Sheets   │◄─── Save Data
│   (Database)    │
└────────┬────────┘
         │
         │ Load Units
         │
         ▼
┌─────────────────┐
│   Simulator     │
│ (simulator.html)│
└────────┬────────┘
         │
         │ 1. Pilih Unit
         │ 2. Input Parameter
         │ 3. Hitung Berat
         │ 4. Lihat Visualisasi
         │
         ▼
┌─────────────────┐
│     Output      │
│  - Berat (ton)  │
│  - Reach (m)    │
│  - Overload?    │
│  - Visualization│
└─────────────────┘
```

---

## 🚀 Instalasi

### Prerequisites

- Browser modern (Chrome, Firefox, Edge)
- Akun Google (untuk Google Sheets)
- Text editor (VS Code recommended)

### Quick Start

1. **Clone/Download Repository**
   ```bash
   git clone https://github.com/yourusername/reach-stacker-simulator.git
   cd reach-stacker-simulator
   ```

2. **Setup Google Sheets**
   - Ikuti panduan lengkap di `GOOGLE_SHEETS_SETUP.md`
   - Buat spreadsheet baru
   - Deploy Apps Script
   - Copy Web App URL

3. **Konfigurasi Frontend**
   - Edit `setup.html` line 1046
   - Edit `simulator.html` line 328
   - Paste Web App URL

4. **Run Locally**
   ```bash
   npm start
   # atau
   npx http-server -p 3000 -o
   ```

5. **Akses Aplikasi**
   - Setup: `http://localhost:3000/setup.html`
   - Simulator: `http://localhost:3000/simulator.html`

---

## 📖 Cara Penggunaan

### A. Setup Unit Baru

1. **Buka** `setup.html`
2. **Step 1** - Isi informasi unit:
   ```
   Nama Unit: RS-001
   Merk: Kalmar DRG450
   Tahun: 2020
   Lokasi: Terminal Petikemas
   ```

3. **Step 2** - Input dimensi (contoh default):
   ```
   Panjang Boom: 906 cm
   Offset Horizontal: 600 cm
   Tinggi Pivot: 353 cm
   Extension Max: 700 cm
   Diameter Piston: 160 mm
   Mechanical Advantage: 302
   Konstanta Hydraulic: 481.25
   Berat Rigging: 4 ton
   Load Chart Slope: -3.993
   Load Chart Intercept: 46.43
   ```

4. **Step 3** - Input data kalibrasi:
   - Pilih kondisi: Empty/Test Load/None
   - Input minimal 10 data point per kondisi
   - Format: Sudut (°), Pressure (bar)
   - Klik "Hitung Regresi"

5. **Step 4** - Review & Save:
   - Verifikasi semua data
   - Klik "Simpan ke Google Sheets"
   - Tunggu konfirmasi sukses

### B. Simulasi Perhitungan Berat

1. **Buka** `simulator.html`
2. **Pilih Unit** dari dropdown
3. **Input Parameter**:
   ```
   Sudut Boom: 25° (0-60°)
   Panjang Teleskopik: 0 cm (0-700 cm)
   Tekanan Kiri: 200 bar
   Tekanan Kanan: 200 bar
   ```

4. **Klik** "Hitung Berat"
5. **Lihat Hasil**:
   - Berat container (ton)
   - Reach horizontal (m)
   - Kapasitas maksimum
   - Status overload
   - Visualisasi animasi

---

## 📁 Struktur File

```
reach-stacker-simulator/
├── setup.html                  # Setup & konfigurasi unit
├── simulator.html              # Simulator perhitungan berat
├── google-apps-script.js       # Backend Google Sheets
├── GOOGLE_SHEETS_SETUP.md      # Panduan setup Google Sheets
├── README.md                   # Dokumentasi utama
├── package.json                # NPM configuration
├── .gitignore                  # Git ignore rules
└── demo.html                   # Demo standalone (optional)
```

---

## 🛠 Teknologi

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling dengan gradient & animations
- **JavaScript (Vanilla)** - Logic & calculations
- **Canvas API** - Real-time visualization
- **Google Fonts** - Typography (Inter)

### Backend
- **Google Apps Script** - Server-side logic
- **Google Sheets** - Database storage

### Formula & Algoritma
- **Linear Regression** - Kalibrasi koefisien
- **Trigonometry** - Perhitungan geometri boom
- **Hydraulic Engineering** - Konversi pressure ke force

---

## 🌐 Deployment

### Option 1: Netlify (Recommended)

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# Deploy via Netlify Dashboard
# 1. Login ke netlify.com
# 2. New site from Git
# 3. Select repository
# 4. Deploy!
```

**URL:** `https://your-app.netlify.app`

### Option 2: Vercel

```bash
npm i -g vercel
vercel
```

**URL:** `https://your-app.vercel.app`

### Option 3: GitHub Pages

```bash
# Push to GitHub
git push origin main

# Enable GitHub Pages
# Settings → Pages → Source: main branch
```

**URL:** `https://username.github.io/repo-name`

---

## 🔧 Troubleshooting

### Problem: Data tidak tersimpan ke Google Sheets

**Solution:**
1. Verifikasi Web App URL sudah benar
2. Check Apps Script deployment status
3. Pastikan access setting = "Anyone"
4. Clear browser cache

### Problem: Unit tidak muncul di simulator

**Solution:**
1. Check browser console untuk error
2. Verifikasi data sudah ada di Google Sheets
3. Test API endpoint langsung
4. Reload page

### Problem: Perhitungan tidak akurat

**Solution:**
1. Verifikasi dimensi alat sudah benar
2. Check koefisien kalibrasi (R² > 0.85)
3. Tambah data regresi untuk akurasi lebih baik
4. Validasi dengan timbangan aktual

### Problem: Visualisasi tidak muncul

**Solution:**
1. Check browser support Canvas API
2. Clear cache dan reload
3. Verifikasi JavaScript tidak error
4. Test di browser lain

---

## 📊 Formula Perhitungan

### Weight Calculation

```javascript
// 1. Calculate beta (boom angle regression)
beta = angle > 30 ? (angle * 0.94) - 27.1 : (angle * -0.96667) + 30

// 2. Calculate alpha
alpha = 90 - angle

// 3. Calculate reach
r = ((boom_length + length) × cos(alpha)) + (3 × cos(90-alpha)) - horizontal_offset
reach_m = r / 100

// 4. Force calculation
z1 = pressure × hydraulic_const
z2 = z1 × cos(beta)
z3 = (length + boom_length + (116 × sin(alpha))) / mech_advantage
z4 = z2 / z3
z5 = z4 / sin(90-alpha)

// 5. Apply calibration
z6 = z5 × calib_factor
z7 = z6 - calib_offset

// 6. Final weight
weight = (z7 / 1000) + rigging_weight
```

### Overload Check

```javascript
max_load = (loadchart_slope × reach_m) + loadchart_intercept
is_overload = weight > max_load
```

---

## 🔐 Security

### Current Setup (Demo/Testing)
- ✅ Public access untuk kemudahan testing
- ✅ No authentication required
- ⚠️ **TIDAK untuk production!**

### Production Recommendations
- 🔒 Implementasi Google Sign-In
- 🔒 Validate user email domain
- 🔒 Row-level security di Sheets
- 🔒 API key protection
- 🔒 Rate limiting
- 🔒 Input sanitization

---

## 📈 Roadmap

- [ ] User authentication & authorization
- [ ] Multi-language support (EN/ID)
- [ ] Export data to Excel/PDF
- [ ] Mobile app (React Native)
- [ ] IoT sensor integration
- [ ] Dashboard analytics
- [ ] Email/WhatsApp notifications
- [ ] Historical data analysis
- [ ] Predictive maintenance

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Reach Stacker Weight Simulator**
- Developed for Port Equipment Monitoring
- Contact: [your-email@example.com]
- GitHub: [@yourusername]

---

## 🙏 Acknowledgments

- Hydraulic engineering formulas
- Linear regression algorithms
- Canvas visualization techniques
- Google Apps Script community

---

## 📞 Support

Butuh bantuan? 

- 📖 Baca dokumentasi lengkap
- 🐛 Report bugs via GitHub Issues
- 💬 Diskusi di GitHub Discussions
- 📧 Email support

---

**⭐ Jika project ini membantu, berikan star di GitHub!**

---

*Last Updated: 2025-11-26*
