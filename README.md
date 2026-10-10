# ⚙️ CS 3106 | บทที่ 3: ชุดคำสั่งและการทำงานของ CPU (CPU Instruction Set)

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2563eb?style=for-the-badge&logo=github&logoColor=white)](https://phongsathondev.github.io/Chapter3-Cpu-Instruction-Set/)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> 🌐 **เข้าใช้งานสรุปบทเรียนและสื่อการสอนแบบ Interactive ได้ที่:**  
> 👉 **[CS 3106 | บทที่ 3: ชุดคำสั่งและการทำงานของ CPU (CPU Instruction Set)](https://phongsathondev.github.io/Chapter3-Cpu-Instruction-Set/)**

---

## 📖 เกี่ยวกับโปรเจกต์ (Overview)

เว็บแอปพลิเคชันสรุปบทเรียน สื่อการสอนแบบมีปฏิสัมพันธ์ (Interactive Learning Platform) และคลังข้อสอบวิชา **020413106 โครงสร้างระบบคอมพิวเตอร์ (Computer System Organization) - บทที่ 3 ชุดคำสั่งและการทำงานของ CPU (CPU Instruction Set)** เนื้อหาครอบคลุมอย่างละเอียดและครบถ้วนตามเอกสารประกอบการสอน (หน้า 1–40) ออกแบบมาเป็นพิเศษเพื่อช่วยให้นักศึกษาและผู้สนใจเข้าใจโครงสร้างชุดคำสั่ง สถาปัตยกรรม ISA วงรอบคำสั่ง 8 สถานะย่อย โหมดการกำหนดแอดเดรสทั้ง 7 แบบ และรูปแบบคำสั่งตามจำนวนแอดเดรส พร้อมเครื่องมือจำลองเสมือนจริง

---

## ✨ ฟีเจอร์หลัก (Key Features)

### 1. 📚 สรุปเนื้อหาเจาะลึก 12 โมดูลการเรียนรู้ (12 Comprehensive Modules)
เนื้อหาสรุปละเอียด มีภาพไดอะแกรมประกอบ พร้อมตัวอย่างและสูตรคำนวณครบถ้วน:
- **Module 01: ความหมายและองค์ประกอบของชุดคำสั่ง (Instruction Set)** — นิยามชุดคำสั่งเปรียบเสมือนภาษาเฉพาะของ CPU และกระบวนการแปลงรหัส (Source Code $\rightarrow$ Compiler/Assembler $\rightarrow$ Machine Code $\rightarrow$ CPU)
- **Module 02: หน้าที่และการทำงานของ OpCode และ Operand** — โครงสร้าง 2 ส่วนหลักของคำสั่งเครื่อง: OpCode (รหัสปฏิบัติการ / กริยา) และ Operand (ตัวถูกดำเนินการ / ข้อมูล, ที่อยู่ RAM, ชื่อรีจิสเตอร์, พอร์ต I/O)
- **Module 03: กระบวนการทำงานในวัฏจักรคำสั่งของ CPU (Instruction Cycle)** — วงรอบการทำงานต่อเนื่อง Start $\rightarrow$ Fetch $\rightarrow$ Execute (Decode & Perform) $\rightarrow$ Loop Back / Halt พร้อมสัญญาณ Instruction, Data และ Control Signals
- **Module 04: วงรอบสถานะ 8 ขั้นตอนย่อยของ CPU (State Diagram)** — เจาะลึก 8 กระบวนการย่อย: IAC, IF, IOD, Execute (OAC, OF, DO, OS) พร้อมเรื่องเล่าเปรียบเทียบภารกิจ CPU
- **Module 05: ส่วนประกอบของคำสั่ง (Instruction Components)** — โครงสร้าง 3 ฟิลด์ข้อมูลในกล่องคำสั่ง: Operation Code, Operand Reference(s) และ Next Instruction Reference (ผ่าน PC หรือ Branch Target)
- **Module 06: ปัจจัยการออกแบบชุดคำสั่ง (ISA Design Considerations)** — 5 ปัจจัยหลักในการออกแบบสถาปัตยกรรมชุดคำสั่ง: Operation Repertory (CISC vs RISC), Data Type, Instruction Format, Register Design และ Addressing Modes
- **Module 07: ประเภทคำสั่งการทำงาน (Instruction Operation Types)** — จำแนกคำสั่งตามภารกิจ 6 หมวด: Data Transfer (LOAD, STORE, MOVE), Arithmetic (ADD, SUB), Logical (AND, OR, NOT, XOR, CMP), System Control (HALT, NOP, Interrupts), I/O (IN, OUT) และ Conversion
- **Module 08: คำสั่งควบคุมทิศทาง (Branch & Skip Operations)** — การเปลี่ยนลำดับการทำงานปกติของโปรแกรมด้วย Unconditional Branch (JUMP), Conditional Branch (BNE, BEQ, JZ ตาม Flags) และ Skip (ข้ามคำสั่งถัดไปโดยเพิ่ม PC+2)
- **Module 09: คำสั่ง Procedure Call และ Subroutine Call** — กลไกการเรียกโปรแกรมย่อยผ่าน Stack และ Stack Pointer (SP) ด้วยคำสั่ง `CALL` (Push Return Address) และ `RETURN` (Pop Return Address กลับเข้าสู่ PC)
- **Module 10: การทำงานของคำสั่งควบคุมอุปกรณ์ Input/Output** — ความจำเป็นที่ต้องมีคำสั่งควบคุม I/O แยกต่างหาก (ความเร็วต่างกัน, ความหลากหลาย), บทบาทของ I/O Module/Controller และเส้นทางการไหลของข้อมูลบนบัส
- **Module 11: รูปแบบรหัสคำสั่งตามจำนวนที่อยู่ (Instruction Formats by Address Count)** — เปรียบเทียบ 4-Address, 3-Address, 2-Address และ 1-Address (Accumulator) พร้อมวิเคราะห์ข้อดี-ข้อเสียและ Trade-offs
- **Module 12: โหมดการกำหนดแอดเดรสทั้ง 7 แบบ (Addressing Modes)** — สรุปละเอียด 7 โหมดค้นหา Effective Address (EA): Immediate, Register, Direct, Register Indirect, Indexed ($EA = Index + Offset$), Relative ($EA = PC + Offset$) และ Stack

---

### 2. 🛠️ เครื่องมือจำลองและการคำนวณแบบ Interactive
- ⚡ **CPU 8-State Instruction Cycle Simulator:** จำลองการทำงาน 8 ขั้นตอนย่อย (IAC $\rightarrow$ IF $\rightarrow$ IOD $\rightarrow$ OAC $\rightarrow$ OF $\rightarrow$ DO $\rightarrow$ OS) พร้อมแสดงค่าในรีจิสเตอร์ (PC, MAR, MBR, IR, ACC) และสัญญาณบัสแบบ Step-by-Step
- 🧮 **Addressing Modes & Effective Address Calculator:** เครื่องมือคำนวณ Effective Address (EA) และจำลองการอ่านค่าจาก Memory Bank สำหรับโหมดการกำหนดแอดเดรสทั้ง 7 รูปแบบ
- 📊 **Instruction Format Comparison Tool:** เครื่องมือเปรียบเทียบคุณสมบัติ 4-Address, 3-Address, 2-Address และ 1-Address แบบโต้ตอบ พร้อมแสดงตัวอย่างโค้ด ขนาดคำสั่ง และการแลกเปลี่ยน (Trade-offs)
- 🎴 **Interactive Flashcards:** การ์ดคำศัพท์ คอนเซปต์ และนิยามสำคัญสำหรับฝึกจำก่อนเข้าห้องสอบ
- 📝 **Exam Quiz System (คลังข้อสอบจำลอง):** แบบทดสอบวัดความรู้ มีระบบตรวจคำตอบทันทีพร้อมเฉลยละเอียดและคำอธิบายเหตุผล

---

## 🚀 การติดตั้งและรันในเครื่อง (Local Development)

หากต้องการรันโปรเจกต์นี้ในเครื่องคอมพิวเตอร์ของคุณ:

### 1. โคลนคลังโค้ด (Clone Repository)
```bash
git clone https://github.com/phongsathondev/Chapter3-Cpu-Instruction-Set.git
cd Chapter3-Cpu-Instruction-Set
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. รันเซิร์ฟเวอร์สำหรับทดสอบ (Development Server)
```bash
npm run dev
```
เปิดบราวเซอร์ไปที่ `http://localhost:5173` หรือพอร์ตที่แสดงในหน้าต่างเทอร์มินัล

### 4. Build เพื่อใช้งานจริง (Production Build)
```bash
npm run build
```

---

## 💻 เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **UI & Icons:** [Lucide React](https://lucide.dev/)
- **Effects:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Styling:** Modern CSS3 (CSS Variables, Flexbox/Grid, Glassmorphism, Animations)
- **Deployment:** [GitHub Pages](https://pages.github.com/)

---

## 👨‍💻 ผู้จัดทำ (Author)

- **GitHub:** [@phongsathondev](https://github.com/phongsathondev)
- **Live Website:** [https://phongsathondev.github.io/Chapter3-Cpu-Instruction-Set/](https://phongsathondev.github.io/Chapter3-Cpu-Instruction-Set/)
