# 📺 NOVA TV — ระบบปรับแต่งหน้าจอ Hisense 32A4200G Android TV

**NOVA TV** เป็นระบบปรับแต่งหน้าจอสมาร์ททีวีแบบ Web-based ที่ออกแบบมาเพื่อทีวี **Hisense 32A4200G (Android TV 9 - MediaTek m7322)** โดยเฉพาะ เพื่อแก้ปัญหาความช้า โฆษณารก และเพิ่มความสะดวกในการแชร์หน้าจอจากแลปท็อป Windows 11 แบบไร้สายอย่างรวดเร็ว

---

## ✨ ความสามารถหลัก

1. **🎨 Web-based Customization Dashboard**
   - **ตัวแก้ไขธีม (Theme Editor):** ปรับแต่งสี (OLED Dark Mode), ฟอนต์, ความโค้งมนของการ์ด, ระยะห่าง, และสเกลหน้าจอแบบ Real-time
   - **จัดการแอป (Apps Manager):** ลากและวางจัดลำดับแอปโปรด (Drag-and-drop), เปิด/ปิดการแสดงผล, เพิ่ม Shortcut แอปใหม่
   - **จัดลำดับส่วนหน้าจอ (Section Editor):** เลื่อนลำดับส่วนหัว (Header), การ์ดแชร์หน้าจอ (Connect), แอปโปรด (Favorites) และการตั้งค่าด่วน (Quick Settings)
   - **จัดการคอนฟิก (Config Manager):** บันทึก/โหลดธีมโปรด, นำเข้า/ส่งออก JSON, ประวัติการแก้ไขย้อนหลัง (Undo/Redo History)
   - **ตัวอย่างหน้าจอจำลอง (TV Simulation Preview):** จำลองหน้าจอ TV 720p อัตราส่วน 16:9 เสมือนจริง พร้อมรีโมทเสมือน (D-Pad) และควบคุมด้วยปุ่มลูกศรบนคีย์บอร์ด

2. **💻 การแชร์หน้าจอไร้สายจาก Windows 11 (Wireless Screen Sharing)**
   - สั่งเปิดตัวรับสัญญาณหน้าจอบนทีวี (`com.mediatek.androidbox`) ได้ด้วยคลิกเดียวผ่าน ADB
   - มีปุ่มทางลัดบนคีย์บอร์ด **Win + K** บน Windows 11 เพื่อสตรีมหน้าจอทันทีโดยไม่ต้องใช้สาย HDMI

3. **⚡ Safe Debloat สำหรับ Hisense 32A4200G**
   - ปิดการทำงานของแอปขยะ, telemetry และบริการโฆษณาที่ทำให้ทีวีหน่วง (RAM 1GB) รวม 15 รายการ
   - **ปลอดภัย 100%:** ใช้คำสั่ง `pm disable-user --user 0` ไม่มีการลบไฟล์ระบบ ป้องกันอาการ Bootloop
   - ยังคงรักษาช่องต่อ HDMI 1-3, AV, สัญญาณเสาอากาศ (Tuner), รีโมทคอนโทรล, และ Google Play Store ไว้อย่างสมบูรณ์
   - มีระบบสำรองข้อมูลอัตโนมัติ และสคริปต์คืนค่า (`restore-tv.ps1`) เพียงคลิกเดียว

---

## 🚀 เริ่มต้นใช้งาน

### 1. เปิด Web Dashboard
```bash
# ติดตั้ง dependencies (หากยังไม่ได้ติดตั้ง)
npm install

# รันเซิร์ฟเวอร์สำหรับพัฒนา
npm run dev
```
เปิดเบราว์เซอร์ไปที่: **`http://localhost:5173`**

*(หรือหากต้องการรัน Production Server:* `npm run build && npm run server` ที่พอร์ต 3001)*

---

## 📡 วิธีเชื่อมต่อกับ Hisense 32A4200G ผ่าน Wi-Fi (ADB)

### ขั้นตอนบนหน้าจอทีวี:
1. เปิดทีวี กดปุ่มตั้งค่าบนรีโมท ไปที่ **Settings (การตั้งค่า)** → **Device Preferences** → **About**
2. เลื่อนลงไปที่ **Build (หมายเลขบิลด์)** แล้วกดปุ่ม **OK** บนรีโมท **7 ครั้ง**
3. กดย้อนกลับ จะพบเมนู **Developer options (ตัวเลือกสำหรับนักพัฒนา)**
4. เข้าไปเปิดสวิตช์ **USB debugging** *(ทีวีรุ่นนี้จะเปิด Network ADB พอร์ต 5555 ทาง Wi-Fi อัตโนมัติทันที)*
5. ดูหมายเลข IP ของทีวีจาก **Settings → Network & Internet** (เช่น `192.168.1.120`)

### ขั้นตอนเชื่อมต่อจากคอมพิวเตอร์:
คุณสามารถเชื่อมต่อได้ 2 วิธี:
- **วิธีที่ 1 (ผ่าน Web Dashboard):** กรอก IP ในหน้า **ภาพรวม (Overview)** แล้วกดปุ่ม **"เชื่อมต่อ TV"**
- **วิธีที่ 2 (ผ่าน PowerShell):**
  ```powershell
  .\tools\connect-tv.ps1 -TvIp 192.168.1.120
  ```

---

## 🖥️ วิธีแชร์หน้าจอ Windows 11 ไปยังทีวี

1. กดปุ่ม **"เปิด Screen Sharing บน TV"** ในหน้าแดชบอร์ด (หรือรัน `.\tools\screen-share.ps1`)
2. บนแลปท็อป Windows 11 กดปุ่มลัด:
   $$\mathbf{Windows} + \mathbf{K}$$
3. เลือกชื่อทีวี Hisense ของคุณจากแถบด้านขวา
4. หน้าจอจะแคสต์แบบไร้สายทันที

---

## 🧹 การ Debloat (ล้างแอปขยะบนทีวี)

หากทีวีมีอาการหน่วง ช้า หรือมีโฆษณาแนะนำแทรก:
```powershell
# ทำการ Debloat อย่างปลอดภัย พร้อมสำรองข้อมูลอัตโนมัติ
.\tools\debloat-hisense.ps1

# หากต้องการคืนค่าแอปทั้งหมดกลับมาเหมือนเดิม:
.\tools\restore-tv.ps1
```

---

## 📂 โครงสร้างโฟลเดอร์

```text
custom-smarttv/
├── src/
│   ├── components/      # Sidebar, TopBar, TVPreview (จำลองหน้าจอ 16:9)
│   ├── pages/           # Overview, ThemeEditor, AppsManager, ConnectSettings, ConfigManager, Preview, SectionEditor
│   ├── store/           # Zustand state management พร้อมประวัติ Undo/Redo & API integration
│   ├── types/           # Zod schema & Type definitions
│   └── index.css        # Pure Vanilla CSS (OLED Dark Mode design system)
├── server/
│   └── server.ts        # Node.js backend สำหรับ ADB Bridge, Screen Share & Debloat APIs
├── tools/               # PowerShell scripts: connect-tv.ps1, debloat-hisense.ps1, restore-tv.ps1, screen-share.ps1
├── design-system/       # สเปกดีไซน์ระบบ NOVA TV
└── package.json
```
