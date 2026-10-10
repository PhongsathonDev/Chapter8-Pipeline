# ⚡ CS 3106 | บทที่ 8: การทำงานแบบไปป์ลายน์ (Pipeline)

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2563eb?style=for-the-badge&logo=github&logoColor=white)](https://phongsathondev.github.io/Chapter8-Pipeline/)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> 🌐 **เข้าใช้งานสรุปบทเรียนและสื่อการสอนแบบ Interactive ได้ที่:**  
> 👉 **[CS 3106 | บทที่ 8: การทำงานแบบไปป์ลายน์ (Pipeline)](https://phongsathondev.github.io/Chapter8-Pipeline/)**

---

## 📖 เกี่ยวกับโปรเจกต์ (Overview)

เว็บแอปพลิเคชันสรุปบทเรียน สื่อการสอนแบบมีปฏิสัมพันธ์ (Interactive Learning Platform) และคลังข้อสอบวิชา **020413106 โครงสร้างระบบคอมพิวเตอร์ (Computer System Organization) - บทที่ 8 การทำงานแบบไปป์ลายน์ (Pipeline)** 
เนื้อหาครอบคลุมอย่างละเอียดและครบถ้วนตามเอกสารประกอบการสอนฉบับสมบูรณ์ และ **วัตถุประสงค์เชิงพฤติกรรมทั้ง 16 ข้อ** ออกแบบ Modern Web Components ปราศจาก ASCII Art พร้อมเครื่องมือจำลอง 5-Stage Pipeline เสมือนจริง เครื่องคำนวณสมรรถนะ (Speedup / Throughput / Latency) และคลังข้อสอบ 52 ข้อตามหลักจิตวิทยาวัดผล (Balanced Choices 25% A/B/C/D)

---

## ✨ ฟีเจอร์หลัก (Key Features)

### 1. 📚 สรุปเนื้อหาเจาะลึก 9 โมดูลการเรียนรู้ (9 Comprehensive Modules)
- **Module 01: หลักการพื้นฐานและปรัชญาของระบบไปป์ลายน์** — เปรียบเทียบกับสายการผลิตในโรงงานอุตสาหกรรม, กลไกการซ้อนทับเวลา (Overlap Execution), ความแตกต่างระหว่าง Latency และ Throughput
- **Module 02: สถาปัตยกรรมไปป์ลายน์และการแบ่งประเภท** — วิเคราะห์ความแตกต่างระหว่าง Linear Pipeline และ Non-linear Pipeline (Dynamic/Feedback), โครงสร้าง Reservation Table และการจัดตารางคำสั่ง
- **Module 03: ไปป์ลายน์คำสั่งและการแบ่งสเตจ 5 ขั้นตอน (Classic 5-Stage Pipeline)** — เจาะลึกวงรอบการทำงาน IF, ID/RF, EX, MEM, WB, หน้าที่ของ Pipeline Registers (IF/ID, ID/EX, EX/MEM, MEM/WB) ในการกักเก็บสัญญาณและข้อมูล
- **Module 04: การวิเคราะห์สมรรถนะและการคำนวณความเร็ว (Pipeline Performance & Speedup)** — สูตรคำนวณอัตราเร็วเพิ่ม ($S_k$), ข้อจำกัดตามกฎของอัมดาห์ล (Amdahl's Law), ประสิทธิภาพ ($E_k$), ปริมาณงาน ($TH_k$) และผลกระทบจาก Pipeline Register Delay / Overhead
- **Module 05: ปัญหาและการหยุดชะงัก: ข้อขัดแย้งเชิงโครงสร้างและทรัพยากร (Structural Hazards)** — ปัญหาแย่งชิงทรัพยากรฮาร์ดแวร์, การชนกันของ Memory Port, สถาปัตยกรรม Von Neumann vs Harvard Architecture, แคชแยกคำสั่งและข้อมูล (Split L1 Cache)
- **Module 06: ข้อขัดแย้งด้านข้อมูลและการลัดวงจรข้อมูล (Data Hazards & Forwarding)** — วิเคราะห์ RAW (Read-After-Write), WAR, WAW, วิธีแก้ไขด้วย Hardware Bypassing / Data Forwarding, Pipeline Interlock และ Load-Use Delay Stalling
- **Module 07: ข้อขัดแย้งด้านการควบคุมและการทำนายผลการแยกสาขา (Control Hazards & Branch Prediction)** — ปัญหาคำสั่งกระโดด/แตกกิ่ง, ฟองสบู่ (Bubble/Flush), กลไก Delayed Branching, การทำนายแบบ Static (Always Taken / Not Taken) และ Dynamic Branch Prediction (2-Bit Saturating Counter, Branch Target Buffer: BTB)
- **Module 08: สถาปัตยกรรมและเทคนิคขั้นสูง (Superscalar, Superpipelined & Out-of-Order Execution)** — เปรียบเทียบ Superscalar vs Superpipelined, การกระจายคำสั่งหลายตัวพร้อมกัน (Multi-issue), Dynamic Scheduling ด้วย Tomasulo Algorithm, Reservation Stations, และการบันทึกสถานะตามลำดับด้วย Reorder Buffer (ROB)
- **Module 09: ไปป์ลายน์เลขคณิตและเวกเตอร์ (Arithmetic & Vector Pipelining)** — สถาปัตยกรรมจุดลอยตัว IEEE 754, Multi-stage Floating-Point Adder และ Multiplier, การประมวลผล SIMD และ Vector Processors ใน GPU ยุคใหม่

---

## 🛠️ เครื่องมือจำลองและการคำนวณแบบ Interactive

- 🔄 **5-Stage Pipeline Cycle Simulator:** จำลองการไหลของคำสั่งผ่าน 5 สเตจ (IF, ID, EX, MEM, WB) เลือกโหมดการทำงานได้ 3 รูปแบบ (Ideal Pipeline, Data Hazard พร้อม Stalling/Bubble, และ Hardware Data Forwarding) พร้อมแสดงผังเวลา Space-Time Diagram แบบเรียลไทม์
- 🧮 **Pipeline Performance & Speedup Calculator:** คำนวณหาค่าอัตราเร่งความเร็ว ($S_k$), ประสิทธิภาพการใช้งาน ($E_k$), ปริมาณงานต่อหนึ่งหน่วยเวลา (Throughput/IPC), และเวลาแฝง (Total Execution Time) พร้อมเปรียบเทียบระหว่างระบบที่มีและไม่มี Overhead ได้อย่างแม่นยำ
- ⚖️ **Architecture & Strategy Comparator:** เครื่องมือเปรียบเทียบสถาปัตยกรรมเชิงลึก 3 คู่: Single-Cycle vs Pipelined, Linear vs Non-linear Pipeline, และ Pipeline Stalling vs Forwarding
- 🎴 **Interactive Flashcards:** บัตรคำถาม-คำตอบ 22 ใบ สรุปแนวคิด นิยาม และคำศัพท์สำคัญ พร้อมระบบสุ่มคำถาม
- 📝 **Psychometric Quiz System:** คลังข้อสอบ 52 ข้อ (Set 1: 32 ข้อตาม 16 วัตถุประสงค์เชิงพฤติกรรม, Set 2: 20 ข้อข้อสอบสังเคราะห์และทบทวน) ปราศจาก LaTeX ตัวเลือกความยาวใกล้เคียงกัน กระจายคำตอบถูกต้อง A: 25%, B: 25%, C: 25%, D: 25% สม่ำเสมอทุกชุด

---

## 🚀 การติดตั้งและรันในเครื่อง (Local Development)

```bash
# โคลนคลังโค้ด
git clone https://github.com/PhongsathonDev/Chapter8-Pipeline.git

# เข้าสู่โฟลเดอร์โปรเจกต์
cd Chapter8-Pipeline

# ติดตั้งแพ็กเกจ
npm install

# เริ่มต้นเซิร์ฟเวอร์สำหรับพัฒนา
npm run dev
```

---

## 📦 การสร้าง Bundle สำหรับ Production (Build & Deploy)

```bash
# คอมไพล์โปรเจกต์
npm run build

# ตรวจสอบโค้ดด้วย linter
npm run lint
```

---

## 👥 ผู้พัฒนา (Author)

- **พงศธร (Phongsathon)** — [GitHub: @PhongsathonDev](https://github.com/PhongsathonDev)
- รายวิชา 020413106 โครงสร้างระบบคอมพิวเตอร์ (Computer System Organization)
