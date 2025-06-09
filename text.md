# RENCANA PENGUJIAN SISTEM BALLS
**Borneo Anfield Loyalty & Booking System**

---

## TABEL RENCANA PENGUJIAN

| Kelas Uji | Butir Uji | Identifikasi | Tingkat Pengujian | Jenis Pengujian | Jadwal | SKPL | PDHUPL |
|-----------|-----------|--------------|-------------------|-----------------|--------|------|--------|
| **Pengujian Register Pelanggan** | Basis Path registrasi dengan data lengkap dan gagal | SRS_F-BALLS-001 | Pengujian Unit | White Box | 27/05/2025 | ALGO_BALLS_001 | PV_BALLS_001 |
| **Pengujian Login Akun** | Basis Path login dengan data valid dan tidak valid | SRS_F-BALLS-002 | Pengujian Unit | White Box | 27/05/2025 | ALGO_BALLS_002 | PV_BALLS_002 |
| **Pengujian Logout Akun** | Basis Path logout dan redirect ke login | SRS_F-BALLS-008 | Pengujian Unit | White Box | 27/05/2025 | ALGO_BALLS_003 | PV_BALLS_003 |
| **Pengujian Booking Lapangan** | Basis Path pemesanan lapangan dengan validasi waktu | SRS_F-BALLS-003 | Pengujian Unit | White Box | 27/05/2025 | ALGO_BALLS_004 | PV_BALLS_004 |
| **Pengujian Pembayaran** | Basis Path upload bukti pembayaran dan verifikasi | SRS_F-BALLS-004 | Pengujian Unit | White Box | 27/05/2025 | ALGO_BALLS_005 | PV_BALLS_005 |
| **Pengujian Melihat Booking** | Basis Path tampilan riwayat booking pelanggan | SRS_F-BALLS-005 | Pengujian Unit | White Box | 27/05/2025 | ALGO_BALLS_006 | PV_BALLS_006 |
| **Pengujian Poin Loyalty** | Basis Path tampilan dan perhitungan poin loyalty | SRS_F-BALLS-006 | Pengujian Unit | White Box | 27/05/2025 | ALGO_BALLS_007 | PV_BALLS_007 |
| **Pengujian Tukar Poin** | Basis Path penukaran poin dengan hadiah | SRS_F-BALLS-007 | Pengujian Unit | White Box | 27/05/2025 | ALGO_BALLS_008 | PV_BALLS_008 |
| **Pengujian CRUD Booking Admin** | Basis Path tambah/edit/hapus booking oleh admin | SRS_F-BALLS-009,010 | Pengujian Unit | White Box | 27/05/2025 | ALGO_BALLS_009 | PV_BALLS_009 |
| **Pengujian CRUD Program Loyalty** | Basis Path tambah/edit/hapus program loyalitas | SRS_F-BALLS-011,012,013,014 | Pengujian Unit | White Box | 27/05/2025 | ALGO_BALLS_010 | PV_BALLS_010 |
| **Pengujian Laporan Admin** | Basis Path tampilan laporan booking dan pendapatan | SRS_F-BALLS-015 | Pengujian Unit | White Box | 27/05/2025 | ALGO_BALLS_011 | PV_BALLS_011 |
| **Pengujian Verifikasi Transaksi** | Basis Path verifikasi dan pengelolaan transaksi | SRS_F-BALLS-016 | Pengujian Unit | White Box | 27/05/2025 | ALGO_BALLS_012 | PV_BALLS_012 |
| **Pengujian CRUD Admin** | Basis Path tambah/edit/hapus admin oleh super admin | SRS_F-BALLS-017,018,019,020 | Pengujian Unit | White Box | 27/05/2025 | ALGO_BALLS_013 | PV_BALLS_013 |
| **Pengujian Validasi Form Register** | Semua field kosong dan format tidak valid | SRS_F-BALLS-001 | Pengujian Validasi | Black Box | 27/05/2025 | PV_BALLS_001 | ALGO_BALLS_001 |
| **Pengujian Validasi Form Login** | Field kosong dan kredensial tidak valid | SRS_F-BALLS-002 | Pengujian Validasi | Black Box | 27/05/2025 | PV_BALLS_002 | ALGO_BALLS_002 |
| **Pengujian Validasi Form Booking** | Field kosong dan konflik waktu | SRS_F-BALLS-003 | Pengujian Validasi | Black Box | 27/05/2025 | PV_BALLS_004 | ALGO_BALLS_004 |
| **Pengujian Validasi Upload Payment** | File tidak valid dan ukuran berlebih | SRS_F-BALLS-004 | Pengujian Validasi | Black Box | 27/05/2025 | PV_BALLS_005 | ALGO_BALLS_005 |
| **Pengujian Validasi Form Loyalty** | Field kosong dan poin tidak mencukupi | SRS_F-BALLS-011,012,013,014 | Pengujian Validasi | Black Box | 27/05/2025 | PV_BALLS_010 | ALGO_BALLS_010 |
| **Pengujian Validasi Edit Booking** | Semua field kosong dan data tidak valid | SRS_F-BALLS-008 | Pengujian Validasi | Black Box | 27/05/2025 | PV_BALLS_009 | ALGO_BALLS_009 |
| **Pengujian Validasi Admin Form** | Field kosong dan email tidak valid | SRS_F-BALLS-017,018 | Pengujian Validasi | Black Box | 27/05/2025 | PV_BALLS_013 | ALGO_BALLS_013 |

---

## DETAIL PENGUJIAN WHITE BOX

### ALGO_BALLS_001: Pengujian Register Pelanggan
**Kelas Uji:** Pengujian Register Pelanggan  
**Butir Uji:** Basis Path registrasi dengan data lengkap dan gagal  
**Identifikasi:** SRS_F-BALLS-001  
**Tingkat Pengujian:** Pengujian Unit  
**Jenis Pengujian:** White Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **WB-REG-001**: Register dengan data valid lengkap
2. **WB-REG-002**: Register dengan username yang sudah ada
3. **WB-REG-003**: Register dengan email yang sudah ada
4. **WB-REG-004**: Register dengan password tidak match
5. **WB-REG-005**: Register dengan field kosong

---

### ALGO_BALLS_002: Pengujian Login Akun
**Kelas Uji:** Pengujian Login Akun  
**Butir Uji:** Basis Path login dengan data valid dan tidak valid  
**Identifikasi:** SRS_F-BALLS-002  
**Tingkat Pengujian:** Pengujian Unit  
**Jenis Pengujian:** White Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **WB-LOGIN-001**: Login customer dengan kredensial valid
2. **WB-LOGIN-002**: Login admin dengan kredensial valid
3. **WB-LOGIN-003**: Login super admin dengan kredensial valid
4. **WB-LOGIN-004**: Login dengan user tidak terdaftar
5. **WB-LOGIN-005**: Login dengan password salah
6. **WB-LOGIN-006**: Login dengan field kosong

---

### ALGO_BALLS_003: Pengujian Logout Akun
**Kelas Uji:** Pengujian Logout Akun  
**Butir Uji:** Basis Path logout dan redirect ke login  
**Identifikasi:** SRS_F-BALLS-008  
**Tingkat Pengujian:** Pengujian Unit  
**Jenis Pengujian:** White Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **WB-LOGOUT-001**: Logout dengan session valid
2. **WB-LOGOUT-002**: Logout tanpa session

---

### ALGO_BALLS_004: Pengujian Booking Lapangan
**Kelas Uji:** Pengujian Booking Lapangan  
**Butir Uji:** Basis Path pemesanan lapangan dengan validasi waktu  
**Identifikasi:** SRS_F-BALLS-003  
**Tingkat Pengujian:** Pengujian Unit  
**Jenis Pengujian:** White Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **WB-BOOK-001**: Create booking dengan data valid
2. **WB-BOOK-002**: Create booking dengan waktu konflik
3. **WB-BOOK-003**: Create booking dengan field tidak tersedia
4. **WB-BOOK-004**: Create booking tanpa login
5. **WB-BOOK-005**: Create booking dengan durasi tidak valid

---

### ALGO_BALLS_005: Pengujian Pembayaran
**Kelas Uji:** Pengujian Pembayaran  
**Butir Uji:** Basis Path upload bukti pembayaran dan verifikasi  
**Identifikasi:** SRS_F-BALLS-004  
**Tingkat Pengujian:** Pengujian Unit  
**Jenis Pengujian:** White Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **WB-PAY-001**: Upload bukti pembayaran valid
2. **WB-PAY-002**: Upload dengan booking ID tidak valid
3. **WB-PAY-003**: Upload dengan file tidak valid
4. **WB-PAY-004**: Verifikasi pembayaran oleh admin
5. **WB-PAY-005**: Tolak pembayaran oleh admin

---

### ALGO_BALLS_006: Pengujian Melihat Booking
**Kelas Uji:** Pengujian Melihat Booking  
**Butir Uji:** Basis Path tampilan riwayat booking pelanggan  
**Identifikasi:** SRS_F-BALLS-005  
**Tingkat Pengujian:** Pengujian Unit  
**Jenis Pengujian:** White Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **WB-VIEW-001**: Tampilkan booking dengan data tersedia
2. **WB-VIEW-002**: Tampilkan booking tanpa data
3. **WB-VIEW-003**: Filter booking berdasarkan status
4. **WB-VIEW-004**: Filter booking berdasarkan tanggal

---

### ALGO_BALLS_007: Pengujian Poin Loyalty
**Kelas Uji:** Pengujian Poin Loyalty  
**Butir Uji:** Basis Path tampilan dan perhitungan poin loyalty  
**Identifikasi:** SRS_F-BALLS-006  
**Tingkat Pengujian:** Pengujian Unit  
**Jenis Pengujian:** White Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **WB-POINT-001**: Tampilkan poin dengan data tersedia
2. **WB-POINT-002**: Hitung poin dari booking completed
3. **WB-POINT-003**: Distribusi poin antar players
4. **WB-POINT-004**: Tampilkan riwayat earning poin

---

### ALGO_BALLS_008: Pengujian Tukar Poin
**Kelas Uji:** Pengujian Tukar Poin  
**Butir Uji:** Basis Path penukaran poin dengan hadiah  
**Identifikasi:** SRS_F-BALLS-007  
**Tingkat Pengujian:** Pengujian Unit  
**Jenis Pengujian:** White Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **WB-REDEEM-001**: Tukar poin dengan poin mencukupi
2. **WB-REDEEM-002**: Tukar poin dengan poin tidak mencukupi
3. **WB-REDEEM-003**: Generate QR code untuk redemption
4. **WB-REDEEM-004**: Tampilkan riwayat redemption

---

### ALGO_BALLS_009: Pengujian CRUD Booking Admin
**Kelas Uji:** Pengujian CRUD Booking Admin  
**Butir Uji:** Basis Path tambah/edit/hapus booking oleh admin  
**Identifikasi:** SRS_F-BALLS-009, 010  
**Tingkat Pengujian:** Pengujian Unit  
**Jenis Pengujian:** White Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **WB-ADMIN-BOOK-001**: Admin create booking manual
2. **WB-ADMIN-BOOK-002**: Admin update booking status
3. **WB-ADMIN-BOOK-003**: Admin delete booking
4. **WB-ADMIN-BOOK-004**: Non-admin access CRUD booking

---

### ALGO_BALLS_010: Pengujian CRUD Program Loyalty
**Kelas Uji:** Pengujian CRUD Program Loyalty  
**Butir Uji:** Basis Path tambah/edit/hapus program loyalitas  
**Identifikasi:** SRS_F-BALLS-011, 012, 013, 014  
**Tingkat Pengujian:** Pengujian Unit  
**Jenis Pengujian:** White Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **WB-LOYALTY-001**: Create reward dengan data valid
2. **WB-LOYALTY-002**: Update reward dengan data valid
3. **WB-LOYALTY-003**: Delete reward yang ada
4. **WB-LOYALTY-004**: View all rewards
5. **WB-LOYALTY-005**: Non-admin access CRUD loyalty

---

### ALGO_BALLS_011: Pengujian Laporan Admin
**Kelas Uji:** Pengujian Laporan Admin  
**Butir Uji:** Basis Path tampilan laporan booking dan pendapatan  
**Identifikasi:** SRS_F-BALLS-015  
**Tingkat Pengujian:** Pengujian Unit  
**Jenis Pengujian:** White Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **WB-REPORT-001**: Generate report dengan data tersedia
2. **WB-REPORT-002**: Generate report tanpa data
3. **WB-REPORT-003**: Filter report berdasarkan periode
4. **WB-REPORT-004**: Export report ke PDF/Excel

---

### ALGO_BALLS_012: Pengujian Verifikasi Transaksi
**Kelas Uji:** Pengujian Verifikasi Transaksi  
**Butir Uji:** Basis Path verifikasi dan pengelolaan transaksi  
**Identifikasi:** SRS_F-BALLS-016  
**Tingkat Pengujian:** Pengujian Unit  
**Jenis Pengujian:** White Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **WB-VERIFY-001**: Konfirmasi pembayaran valid
2. **WB-VERIFY-002**: Tolak pembayaran tidak valid
3. **WB-VERIFY-003**: Update status booking otomatis
4. **WB-VERIFY-004**: Non-admin access verifikasi

---

### ALGO_BALLS_013: Pengujian CRUD Admin
**Kelas Uji:** Pengujian CRUD Admin  
**Butir Uji:** Basis Path tambah/edit/hapus admin oleh super admin  
**Identifikasi:** SRS_F-BALLS-017, 018, 019, 020  
**Tingkat Pengujian:** Pengujian Unit  
**Jenis Pengujian:** White Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **WB-SUPER-001**: Create admin dengan data valid
2. **WB-SUPER-002**: Update data admin
3. **WB-SUPER-003**: Delete admin
4. **WB-SUPER-004**: View all admins
5. **WB-SUPER-005**: Non-super admin access CRUD admin

---

## DETAIL PENGUJIAN BLACK BOX

### PV_BALLS_001: Pengujian Validasi Form Register
**Kelas Uji:** Pengujian Validasi Form Register  
**Butir Uji:** Semua field kosong dan format tidak valid  
**Identifikasi:** SRS_F-BALLS-001  
**Tingkat Pengujian:** Pengujian Validasi  
**Jenis Pengujian:** Black Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **BB-REG-001**: Submit form dengan semua field kosong
2. **BB-REG-002**: Submit dengan email format tidak valid
3. **BB-REG-003**: Submit dengan password kurang dari 8 karakter
4. **BB-REG-004**: Submit dengan nomor telepon format tidak valid
5. **BB-REG-005**: Submit dengan username mengandung karakter khusus

---

### PV_BALLS_002: Pengujian Validasi Form Login
**Kelas Uji:** Pengujian Validasi Form Login  
**Butir Uji:** Field kosong dan kredensial tidak valid  
**Identifikasi:** SRS_F-BALLS-002  
**Tingkat Pengujian:** Pengujian Validasi  
**Jenis Pengujian:** Black Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **BB-LOGIN-001**: Submit form dengan field kosong
2. **BB-LOGIN-002**: Submit dengan email format tidak valid
3. **BB-LOGIN-003**: Submit dengan password kosong
4. **BB-LOGIN-004**: Submit dengan kredensial tidak terdaftar

---

### PV_BALLS_004: Pengujian Validasi Form Booking
**Kelas Uji:** Pengujian Validasi Form Booking  
**Butir Uji:** Field kosong dan konflik waktu  
**Identifikasi:** SRS_F-BALLS-003  
**Tingkat Pengujian:** Pengujian Validasi  
**Jenis Pengujian:** Black Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **BB-BOOK-001**: Submit form dengan field kosong
2. **BB-BOOK-002**: Submit dengan tanggal masa lalu
3. **BB-BOOK-003**: Submit dengan durasi kurang dari 1 jam
4. **BB-BOOK-004**: Submit dengan durasi lebih dari 8 jam
5. **BB-BOOK-005**: Submit dengan waktu mulai setelah waktu selesai

---

### PV_BALLS_005: Pengujian Validasi Upload Payment
**Kelas Uji:** Pengujian Validasi Upload Payment  
**Butir Uji:** File tidak valid dan ukuran berlebih  
**Identifikasi:** SRS_F-BALLS-004  
**Tingkat Pengujian:** Pengujian Validasi  
**Jenis Pengujian:** Black Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **BB-PAY-001**: Upload tanpa file
2. **BB-PAY-002**: Upload file bukan gambar
3. **BB-PAY-003**: Upload file lebih dari 5MB
4. **BB-PAY-004**: Upload dengan booking ID kosong
5. **BB-PAY-005**: Upload dengan metode pembayaran tidak dipilih

---

### PV_BALLS_009: Pengujian Validasi Edit Booking
**Kelas Uji:** Pengujian Validasi Edit Booking  
**Butir Uji:** Semua field kosong dan data tidak valid  
**Identifikasi:** SRS_F-BALLS-008  
**Tingkat Pengujian:** Pengujian Validasi  
**Jenis Pengujian:** Black Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **BB-EDIT-001**: Update dengan semua field kosong
2. **BB-EDIT-002**: Update dengan tanggal tidak valid
3. **BB-EDIT-003**: Update dengan waktu konflik
4. **BB-EDIT-004**: Update dengan durasi tidak valid
5. **BB-EDIT-005**: Update dengan field tidak tersedia

---

### PV_BALLS_010: Pengujian Validasi Form Loyalty
**Kelas Uji:** Pengujian Validasi Form Loyalty  
**Butir Uji:** Field kosong dan poin tidak mencukupi  
**Identifikasi:** SRS_F-BALLS-011, 012, 013, 014  
**Tingkat Pengujian:** Pengujian Validasi  
**Jenis Pengujian:** Black Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **BB-LOYALTY-001**: Create reward dengan field kosong
2. **BB-LOYALTY-002**: Create reward dengan poin negatif
3. **BB-LOYALTY-003**: Redeem dengan poin tidak mencukupi
4. **BB-LOYALTY-004**: Upload gambar reward tidak valid

---

### PV_BALLS_013: Pengujian Validasi Admin Form
**Kelas Uji:** Pengujian Validasi Admin Form  
**Butir Uji:** Field kosong dan email tidak valid  
**Identifikasi:** SRS_F-BALLS-017, 018  
**Tingkat Pengujian:** Pengujian Validasi  
**Jenis Pengujian:** Black Box  
**Jadwal:** 27/05/2025  

#### Skenario Test:
1. **BB-ADMIN-001**: Create admin dengan field kosong
2. **BB-ADMIN-002**: Create admin dengan email tidak valid
3. **BB-ADMIN-003**: Create admin dengan password tidak match
4. **BB-ADMIN-004**: Update admin dengan data tidak valid

---

## RINGKASAN PENGUJIAN

### Statistik Pengujian
- **Total Kelas Uji**: 20
- **White Box Testing**: 13 kelas uji
- **Black Box Testing**: 7 kelas uji
- **Total Skenario Test**: 89
- **Jadwal Pelaksanaan**: 27/05/2025

### Coverage Mapping
| SRS Code | Fungsi | White Box | Black Box |
|----------|--------|-----------|-----------|
| SRS_F-BALLS-001 | Register | ✅ ALGO_BALLS_001 | ✅ PV_BALLS_001 |
| SRS_F-BALLS-002 | Login | ✅ ALGO_BALLS_002 | ✅ PV_BALLS_002 |
| SRS_F-BALLS-003 | Booking | ✅ ALGO_BALLS_004 | ✅ PV_BALLS_004 |
| SRS_F-BALLS-004 | Payment | ✅ ALGO_BALLS_005 | ✅ PV_BALLS_005 |
| SRS_F-BALLS-005 | View Booking | ✅ ALGO_BALLS_006 | - |
| SRS_F-BALLS-006 | Loyalty Points | ✅ ALGO_BALLS_007 | - |
| SRS_F-BALLS-007 | Redeem Points | ✅ ALGO_BALLS_008 | - |
| SRS_F-BALLS-008 | Logout/Edit | ✅ ALGO_BALLS_003 | ✅ PV_BALLS_009 |
| SRS_F-BALLS-009,010 | Admin Booking | ✅ ALGO_BALLS_009 | - |
| SRS_F-BALLS-011-014 | Admin Loyalty | ✅ ALGO_BALLS_010 | ✅ PV_BALLS_010 |
| SRS_F-BALLS-015 | Reports | ✅ ALGO_BALLS_011 | - |
| SRS_F-BALLS-016 | Verification | ✅ ALGO_BALLS_012 | - |
| SRS_F-BALLS-017-020 | Super Admin | ✅ ALGO_BALLS_013 | ✅ PV_BALLS_013 |

**Coverage Rate: 100%** - Semua SRS requirements tercakup dalam pengujian
