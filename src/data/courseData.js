export const courseModules = [
  {
    id: "module-1",
    moduleNumber: "01",
    title: "1. การนำเข้าสู่บทเรียนและแนวคิดพื้นฐานของไปป์ไลน์ (Introduction to Pipeline)",
    pageRef: "หน้าที่ 3-5",
    summary: "ความหมายของไปป์ไลน์ (Pipeline) หลักการแบ่งงานย่อย การทำพร้อมกัน และการทำต่อเนื่อง เปรียบเทียบกับโรงงานผลิตรถยนต์และการซักผ้า 3 ถัง พร้อมความสัมพันธ์ระหว่าง Latency และ Throughput",
    objectives: [
      { code: "ข้อ 1", text: "อธิบายหลักการทำงานของ CPU แบบไม่ใช้ไปป์ไลน์ (Single-cycle) ได้" },
      { code: "ข้อ 2", text: "อธิบายหลักการทำงานของ CPU แบบไปป์ไลน์ (Pipeline) ได้" }
    ],
    content: `
### ความหมายและหัวใจสำคัญของไปป์ไลน์ (What is Pipelining?)
การทำงานแบบไปป์ไลน์ (**Pipeline**) คือ เทคนิคการเพิ่มประสิทธิภาพของหน่วยประมวลผลกลาง (**CPU**) โดยการแบ่งขั้นตอนการประมวลผลคำสั่งที่เดิมต้องทำทีละคำสั่งตามลำดับ (**Sequential Processing**) ออกเป็นขั้นตอนย่อยๆ เพื่อให้คำสั่งหลายคำสั่งสามารถประมวลผลในขั้นตอนที่แตกต่างกันไปพร้อมๆ กันในเวลาเดียวกัน

<div class="process-flow-container">
  <div class="step-card">
    <div class="step-badge">หัวใจที่ 1</div>
    <div class="step-icon">🧩</div>
    <div class="step-title">การแบ่งงานย่อย (Work Division)</div>
    <div class="step-desc">งานประมวลผลคำสั่ง 1 คำสั่งจะถูกซอยย่อยออกเป็นสเตจ (Stages) ขนาดเท่าๆ กัน เช่น การดึงคำสั่ง, การถอดรหัส, การคำนวณ</div>
  </div>
  <div class="step-arrow">➔</div>
  <div class="step-card">
    <div class="step-badge">หัวใจที่ 2</div>
    <div class="step-icon">⚡</div>
    <div class="step-title">การทำพร้อมกัน (Concurrency)</div>
    <div class="step-desc">เมื่อคำสั่งแรกเสร็จจากสเตจที่ 1 และก้าวเข้าสู่สเตจที่ 2 คำสั่งถัดไปจะเข้าสู่สเตจที่ 1 ทันทีโดยไม่ต้องรอให้คำสั่งแรกทำงานเสร็จสิ้นทั้งวงรอบ</div>
  </div>
  <div class="step-arrow">➔</div>
  <div class="step-card">
    <div class="step-badge">หัวใจที่ 3</div>
    <div class="step-icon">🔄</div>
    <div class="step-title">การทำต่อเนื่อง (Continuity)</div>
    <div class="step-desc">แต่ละสถานีงานส่งต่อผลลัพธ์ผ่านบัฟเฟอร์กั้นกลางอย่างเป็นจังหวะ ทำให้ได้ผลลัพธ์ของคำสั่งสำเร็จใหม่ออกมาในเกือบทุกรอบสัญญาณนาฬิกา</div>
  </div>
</div>

---

### การเปรียบเทียบในชีวิตจริง: สายการผลิตรถยนต์ (Automobile Assembly Line)

<div class="comparison-grid">
  <div class="comparison-card">
    <div class="comp-header" style="background: #fef2f2; color: #991b1b;">
      🚗 แบบดั้งเดิม (ไม่ใช้ไปป์ไลน์ - Sequential)
    </div>
    <div class="comp-body">
      <ul>
        <li>รถแต่ละคันต้องผ่าน: ประกอบตัวถัง ➔ ลงสี ➔ ติดตั้งเครื่องยนต์ ➔ ตรวจสอบคุณภาพ ทีละขั้นตอนจนเสร็จสมบูรณ์ทั้งคัน</li>
        <li>รถคันที่ 2 จะเริ่มผลิตได้ก็ต่อเมื่อรถคันแรกเสร็จสิ้นกระบวนการทั้งหมดแล้วเท่านั้น</li>
        <li><strong>ผลกระทบ:</strong> สถานีอื่นๆ ต้องว่างงานรอคอย ทำให้เสียเวลาโดยรวมมหาศาลและได้จำนวนรถต่อวันน้อยมาก</li>
      </ul>
    </div>
  </div>

  <div class="comparison-card">
    <div class="comp-header" style="background: #f0fdf4; color: #166534;">
      🏭 แบบไปป์ไลน์ (Pipeline Assembly Line)
    </div>
    <div class="comp-body">
      <ul>
        <li>โรงงานแบ่งเป็น 4 สถานีงานย่อย: สถานี 1 (ตัวถัง), สถานี 2 (ลงสี), สถานี 3 (เครื่องยนต์), สถานี 4 (ตรวจสอบ)</li>
        <li>เมื่อรถคันที่ 1 ประกอบตัวถังเสร็จและย้ายไปลงสี รถคันที่ 2 สามารถเริ่มประกอบตัวถังที่สถานีแรกได้ทันที</li>
        <li><strong>ผลลัพธ์:</strong> มีรถหลายคันอยู่ในสายการผลิตพร้อมกัน ได้จำนวนรถที่ผลิตเสร็จต่อหน่วยเวลา (Throughput) เพิ่มขึ้นอย่างมาก</li>
      </ul>
    </div>
  </div>
</div>

---

### ตัวอย่างคลาสสิก: การซักผ้า 3 ถัง (The Laundry Analogy)
สมมติว่าเรามีงานซักผ้า 3 ถัง แต่ละถังประกอบด้วย 3 ขั้นตอนย่อย แต่ละขั้นตอนใช้เวลา 30 นาทีเท่ากัน:
- ขั้นตอนที่ 1: ซัก (Wash) = 30 นาที
- ขั้นตอนที่ 2: ตาก (Dry) = 30 นาที
- ขั้นตอนที่ 3: พับ (Fold) = 30 นาที

<div class="modern-table-container">
  <table class="modern-table">
    <thead>
      <tr>
        <th>รูปแบบการทำงาน</th>
        <th>ลำดับการทำงานและช่วงเวลา</th>
        <th>เวลารวมทั้งหมด</th>
        <th>ผลลัพธ์ประสิทธิภาพ</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>แบบไม่ใช้ไปป์ไลน์ (Sequential)</strong></td>
        <td>
          ถัง 1: ซัก ➔ ตาก ➔ พับ (90 นาที)<br/>
          ถัง 2: เริ่มเมื่อถัง 1 เสร็จ (90 + 90 = 180 นาที)<br/>
          ถัง 3: เริ่มเมื่อถัง 2 เสร็จ (180 + 90 = 270 นาที)
        </td>
        <td><span class="metric-badge badge-danger">270 นาที (4.5 ชั่วโมง)</span></td>
        <td>เครื่องซักผ้าและเครื่องอบผ้าต้องหยุดรอเฉยๆ ในช่วงเวลาที่งานกำลังพับผ้า</td>
      </tr>
      <tr>
        <td><strong>แบบใช้ไปป์ไลน์ (Pipelined)</strong></td>
        <td>
          0-30 น.: ซักถัง 1<br/>
          30-60 น.: ตากถัง 1, ซักถัง 2<br/>
          60-90 น.: พับถัง 1 (ถัง 1 เสร็จ), ตากถัง 2, ซักถัง 3<br/>
          90-120 น.: พับถัง 2 (ถัง 2 เสร็จ), ตากถัง 3<br/>
          120-150 น.: พับถัง 3 (ถัง 3 เสร็จ)
        </td>
        <td><span class="metric-badge badge-success">150 นาที (2.5 ชั่วโมง)</span></td>
        <td>เร็วกว่าแบบแรกเกือบครึ่ง อุปกรณ์ทุกชิ้นทำงานพร้อมกันเต็มกำลัง</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="callout callout-purple">
  <strong>บทสรุปเชิงสถาปัตยกรรม (Core Pipelining Takeaway):</strong><br/>
  การทำงานแบบไปป์ไลน์ <em>ไม่ได้ลดเวลาที่ใช้ในการประมวลผลแต่ละงานเดี่ยวๆ (Latency per task ยังคงเป็น 90 นาทีสำหรับแต่ละถัง)</em> แต่ช่วย <strong>เพิ่มปริมาณงานรวมที่ทำเสร็จในหนึ่งหน่วยเวลา (Throughput)</strong> ได้อย่างมหาศาล
</div>
`
  },
  {
    id: "module-2",
    moduleNumber: "02",
    title: "2. สถาปัตยกรรม CPU: แบบไม่ใช้ไปป์ไลน์ (Single-cycle) เทียบกับแบบไปป์ไลน์ (Pipeline)",
    pageRef: "หน้าที่ 6-7",
    summary: "เปรียบเทียบสถาปัตยกรรม Single-cycle CPU ที่ประมวลผลจบใน 1 รอบสัญญาณนาฬิกา (คนล้างจาน 1 คน) กับ Pipeline CPU ที่แบ่งงานเป็นสเตจคู่ขนาน (คนล้างจาน 3 คน) ข้อดี ข้อเสีย และตารางเปรียบเทียบคุณสมบัติ",
    objectives: [
      { code: "ข้อ 1", text: "อธิบายหลักการทำงานของ CPU แบบไม่ใช้ไปป์ไลน์ (Single-cycle) ได้" },
      { code: "ข้อ 2", text: "อธิบายหลักการทำงานของ CPU แบบไปป์ไลน์ (Pipeline) ได้" }
    ],
    content: `
### การเปรียบเทียบเชิงสถาปัตยกรรม CPU (CPU Architecture Comparison)
ในการออกแบบหน่วยประมวลผลกลาง (CPU) สามารถแบ่งวิธีการประมวลผลคำสั่งออกเป็น 2 รูปแบบหลักที่มีความแตกต่างกันอย่างสิ้นเชิง:

#### 1. CPU แบบไม่ใช้ไปป์ไลน์ (Single-cycle CPU)
- **หลักการทำงาน:** ประมวลผล **หนึ่งคำสั่งให้เสร็จสมบูรณ์ 100% ภายใน 1 รอบสัญญาณนาฬิกา (One Clock Cycle)** หมายความว่าทุกขั้นตอนย่อย (Fetch, Decode, Execute, Memory, Write Back) จะต้องเกิดขึ้นและจบลงภายในรอบสัญญาณนาฬิกาเดียวกัน ก่อนจะเริ่มต้นดึงคำสั่งถัดไป
- **ตัวอย่างเปรียบเทียบ:** คนล้างจาน 1 คน ที่ต้องทำทุกขั้นตอน (ล้าง ➔ เช็ด ➔ เก็บเข้าตู้) บนจานใบที่ 1 ให้เสร็จก่อน ถึงจะเริ่มหยิบจานใบที่ 2 ขึ้นมาล้าง
- **ข้อดี:** ออกแบบง่าย โครงสร้างวงจรไม่ซับซ้อน และ **ไม่มีปัญหา Pipeline Hazards** ใดๆ เลย เพราะไม่มีคำสั่งอื่นมาทำงานซ้อนทับกัน
- **ข้อเสีย:** ความเร็วต่ำมาก เพราะความกว้างของรอบสัญญาณนาฬิกา (Clock Cycle Time) ต้องถูกกำหนดโดย **ขั้นตอนที่ทำงานช้าที่สุด (Critical Path เช่น การเข้าถึง Memory)** ทำให้ขั้นตอนอื่นที่ทำงานเร็วกว่าต้องเสียเวลารอเฉยๆ

#### 2. CPU แบบใช้ไปป์ไลน์ (Pipeline CPU)
- **หลักการทำงาน:** แบ่งวงรอบคำสั่งออกเป็น **หลายขั้นตอนย่อย (Stages)** และให้แต่ละสเตจประมวลผลคนละคำสั่งในเวลาเดียวกัน คล้ายกับสายพานการผลิต
- **ตัวอย่างเปรียบเทียบ:** คนล้างจาน 3 คน (คน 1 ล้าง, คน 2 เช็ด, คน 3 เก็บ) เมื่อคน 1 ล้างจานใบแรกเสร็จ ส่งต่อให้คน 2 แล้วคน 1 เริ่มล้างจานใบที่ 2 ทันที งานจึงไหลต่อเนื่องไม่สะดุด
- **ข้อดี:** ความเร็วสัญญาณนาฬิกาสูงขึ้น และมีอัตราการประมวลผลคำสั่งสำเร็จต่อหน่วยเวลา (**Throughput**) สูงกว่าแบบ Single-cycle หลายเท่าตัว
- **ข้อเสีย:** โครงสร้างวงจรควบคุมซับซ้อน ต้องมีบัฟเฟอร์เก็บข้อมูลระหว่างสเตจ และ **อาจเกิดปัญหาความเสี่ยง (Pipeline Hazards)** ที่ต้องออกแบบวงจรพิเศษมารองรับ

---

### ตารางเปรียบเทียบคุณสมบัติระหว่าง Single-cycle CPU และ Pipeline CPU (ตารางที่ 8-3)

<div class="modern-table-container">
  <table class="modern-table">
    <thead>
      <tr>
        <th>คุณสมบัติ (Property)</th>
        <th>Single-cycle CPU (แบบไม่ใช้ไปป์ไลน์)</th>
        <th>Pipeline CPU (แบบใช้ไปป์ไลน์)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>จำนวนคำสั่งที่เริ่มประมวลผลต่อรอบ</strong></td>
        <td>1 คำสั่ง ต่อ 1 Clock Cycle ยาว</td>
        <td>1 คำสั่ง ต่อ 1 Clock Cycle สั้น (ในทางทฤษฎี)</td>
      </tr>
      <tr>
        <td><strong>จำนวนคำสั่งที่ทำงานพร้อมกันในระบบ</strong></td>
        <td><span class="metric-badge badge-warning">1 คำสั่งเท่านั้น</span></td>
        <td><span class="metric-badge badge-success">มากกว่า 1 คำสั่ง (ตามจำนวน Stages)</span></td>
      </tr>
      <tr>
        <td><strong>ความยาวรอบสัญญาณนาฬิกา (Cycle Time)</strong></td>
        <td>ยาวมาก (เท่ากับผลรวมเวลาทุกขั้นตอนย่อย)</td>
        <td>สั้นมาก (เท่ากับเวลาของสเตจที่ช้าที่สุดเพียงสเตจเดียว)</td>
      </tr>
      <tr>
        <td><strong>ประสิทธิภาพโดยรวม (Throughput)</strong></td>
        <td><span class="metric-badge badge-danger">ต่ำ (Low)</span></td>
        <td><span class="metric-badge badge-success">สูงมาก (High)</span></td>
      </tr>
      <tr>
        <td><strong>ความซับซ้อนของฮาร์ดแวร์</strong></td>
        <td>ต่ำ เข้าใจและสร้างง่าย</td>
        <td>สูง ต้องมี Latches และวงจรควบคุมซับซ้อน</td>
      </tr>
      <tr>
        <td><strong>ปัญหาความเสี่ยง (Hazards)</strong></td>
        <td><span class="metric-badge badge-success">ไม่มี Hazard เกิดขึ้นแน่นอน</span></td>
        <td><span class="metric-badge badge-danger">มี Hazard (Data, Structural, Control)</span></td>
      </tr>
    </tbody>
  </table>
</div>
`
  },
  {
    id: "module-3",
    moduleNumber: "03",
    title: "3. ลำดับขั้นตอนการทำงาน 5 สเตจของไปป์ไลน์ในสถาปัตยกรรม MIPS และ RISC",
    pageRef: "หน้าที่ 8-10",
    summary: "โครงสร้างไปป์ไลน์มาตรฐาน 5 สเตจของ MIPS/RISC ได้แก่ IF, ID, EX, MEM, WB การทำงานละเอียดของแต่ละสเตจ พร้อมไทม์ไลน์รอบสัญญาณนาฬิกา Clock Cycles",
    objectives: [
      { code: "ข้อ 3", text: "อธิบายลำดับขั้นตอนการทำงานของไปป์ไลน์ของสถาปัตยกรรม MIPS ได้" },
      { code: "ข้อ 4", text: "อธิบายลำดับขั้นตอนการทำงานของไปป์ไลน์ของสถาปัตยกรรม RISC ได้" }
    ],
    content: `
### สถาปัตยกรรมไปป์ไลน์มาตรฐาน 5 สเตจ (Classic 5-Stage RISC/MIPS Pipeline)
ในสถาปัตยกรรมคอมพิวเตอร์แบบ **MIPS** (Microprocessor without Interlocked Pipeline Stages) และ **RISC** (Reduced Instruction Set Computing) ทั่วไป จะแบ่งวงรอบการทำงานของคำสั่งออกเป็น **5 ขั้นตอนหลัก (5 Stages)** ที่ทำงานเป็นอิสระต่อกัน:

<div class="process-flow-container">
  <div class="step-card">
    <div class="step-badge">Stage 1: IF</div>
    <div class="step-icon">📥</div>
    <div class="step-title">Instruction Fetch (ดึงคำสั่ง)</div>
    <div class="step-desc">
      นำค่าจาก <strong>Program Counter (PC)</strong> ไปชี้ตำแหน่งคำสั่งในหน่วยความจำคำสั่ง (Instruction Memory) เพื่อดึงคำสั่งมาเก็บในบัฟเฟอร์ และเพิ่มค่า PC เพื่อเตรียมดึงคำสั่งถัดไป
    </div>
  </div>
  <div class="step-arrow">➔</div>
  <div class="step-card">
    <div class="step-badge">Stage 2: ID</div>
    <div class="step-icon">🧠</div>
    <div class="step-title">Instruction Decode (ถอดรหัสคำสั่ง)</div>
    <div class="step-desc">
      ถอดรหัสประเภทคำสั่ง (Opcode) และอ่านค่าข้อมูลตัวถูกดำเนินการจากรีจิสเตอร์ต้นทางใน <strong>Register File</strong> เพื่อส่งไปคำนวณในสเตจถัดไป
    </div>
  </div>
  <div class="step-arrow">➔</div>
  <div class="step-card">
    <div class="step-badge">Stage 3: EX</div>
    <div class="step-icon">➕</div>
    <div class="step-title">Execute (ประมวลผลคำนวณ)</div>
    <div class="step-desc">
      ใช้หน่วยคำนวณเลขคณิตและตรรกะ (<strong>ALU</strong>) คำนวณทางคณิตศาสตร์ (ADD/SUB) หรือคำนวณแอดเดรสหน่วยความจำสำหรับคำสั่ง LOAD/STORE
    </div>
  </div>
  <div class="step-arrow">➔</div>
  <div class="step-card">
    <div class="step-badge">Stage 4: MEM</div>
    <div class="step-icon">💾</div>
    <div class="step-title">Memory Access (เข้าถึงหน่วยความจำ)</div>
    <div class="step-desc">
      เข้าถึงหน่วยความจำข้อมูล (Data Memory) เพื่อ <em>อ่านข้อมูล (LOAD)</em> หรือ <em>เขียนข้อมูล (STORE)</em> ตามตำแหน่งที่คำนวณได้จากสเตจ EX
    </div>
  </div>
  <div class="step-arrow">➔</div>
  <div class="step-card">
    <div class="step-badge">Stage 5: WB</div>
    <div class="step-icon">📝</div>
    <div class="step-title">Write Back (เขียนผลลัพธ์กลับ)</div>
    <div class="step-desc">
      เขียนผลลัพธ์ที่ได้จาก ALU (สเตจ EX) หรือข้อมูลที่โหลดมาจาก Memory (สเตจ MEM) บันทึกกลับลงในรีจิสเตอร์ปลายทางใน <strong>Register File</strong>
    </div>
  </div>
</div>

---

### ตารางไทม์ไลน์การทำงานของ 3 คำสั่งใน 5 สเตจ (ตารางที่ 8-4)
แสดงการเคลื่อนที่ของแต่ละคำสั่งในแต่ละรอบสัญญาณนาฬิกา (Clock Cycles 1 ถึง 7):

<div class="modern-table-container">
  <table class="modern-table">
    <thead>
      <tr>
        <th>รอบสัญญาณนาฬิกา (Clock Cycle)</th>
        <th>สเตจ IF (ดึง)</th>
        <th>สเตจ ID (ถอดรหัส)</th>
        <th>สเตจ EX (ประมวลผล)</th>
        <th>สเตจ MEM (หน่วยความจำ)</th>
        <th>สเตจ WB (เขียนกลับ)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>รอบที่ 1</strong></td>
        <td><span class="metric-badge badge-info">คำสั่ง 1 (IF)</span></td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>
      <tr>
        <td><strong>รอบที่ 2</strong></td>
        <td><span class="metric-badge badge-info">คำสั่ง 2 (IF)</span></td>
        <td><span class="metric-badge badge-warning">คำสั่ง 1 (ID)</span></td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>
      <tr>
        <td><strong>รอบที่ 3</strong></td>
        <td><span class="metric-badge badge-info">คำสั่ง 3 (IF)</span></td>
        <td><span class="metric-badge badge-warning">คำสั่ง 2 (ID)</span></td>
        <td><span class="metric-badge badge-success">คำสั่ง 1 (EX)</span></td>
        <td>-</td>
        <td>-</td>
      </tr>
      <tr>
        <td><strong>รอบที่ 4</strong></td>
        <td>-</td>
        <td><span class="metric-badge badge-warning">คำสั่ง 3 (ID)</span></td>
        <td><span class="metric-badge badge-success">คำสั่ง 2 (EX)</span></td>
        <td><span class="metric-badge badge-purple">คำสั่ง 1 (MEM)</span></td>
        <td>-</td>
      </tr>
      <tr>
        <td><strong>รอบที่ 5</strong></td>
        <td>-</td>
        <td>-</td>
        <td><span class="metric-badge badge-success">คำสั่ง 3 (EX)</span></td>
        <td><span class="metric-badge badge-purple">คำสั่ง 2 (MEM)</span></td>
        <td><span class="metric-badge badge-danger">คำสั่ง 1 (WB) ✅</span></td>
      </tr>
      <tr>
        <td><strong>รอบที่ 6</strong></td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td><span class="metric-badge badge-purple">คำสั่ง 3 (MEM)</span></td>
        <td><span class="metric-badge badge-danger">คำสั่ง 2 (WB) ✅</span></td>
      </tr>
      <tr>
        <td><strong>รอบที่ 7</strong></td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td><span class="metric-badge badge-danger">คำสั่ง 3 (WB) ✅</span></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="callout callout-info">
  <strong>จุดสังเกตสำคัญในรอบที่ 3 และรอบที่ 5:</strong><br/>
  - ใน <strong>รอบที่ 3</strong>: มี 3 คำสั่งกำลังทำงานพร้อมกันในสเตจที่ต่างกัน (คำสั่ง 1 อยู่ใน EX, คำสั่ง 2 อยู่ใน ID, คำสั่ง 3 อยู่ใน IF)<br/>
  - ใน <strong>รอบที่ 5</strong>: คำสั่งที่ 1 ทำงานเสร็จสมบูรณ์ และหลังจากรอบนี้เป็นต้นไป คำสั่งใหม่จะทะยอยเสร็จสิ้น <strong>ในทุกๆ 1 รอบสัญญาณนาฬิกา</strong> ทำให้ Throughput พุ่งสูงขึ้นอย่างชัดเจน
</div>
`
  },
  {
    id: "module-4",
    moduleNumber: "04",
    title: "4. ประเภทของไปป์ไลน์: แบบเป็นลำดับ (Linear) และแบบไม่เป็นลำดับ (Non-linear)",
    pageRef: "หน้าที่ 10-11",
    summary: "ความแตกต่างระหว่าง Linear Pipeline ที่ไหลทางเดียวไม่มีวงย้อนกลับ กับ Non-linear Pipeline ที่มี Feedback Loop และหลายเส้นทาง เหมาะกับงาน DSP และ Adaptive Image Processing",
    objectives: [
      { code: "ข้อ 5", text: "อธิบายการทำงานไปป์ไลน์แบบเป็นลำดับ (Linear Pipeline) ได้" },
      { code: "ข้อ 6", text: "อธิบายการทำงานไปป์ไลน์แบบไม่เป็นลำดับ (Non-linear Pipeline) ได้" }
    ],
    content: `
### การจำแนกประเภทไปป์ไลน์ตามทิศทางการไหลของข้อมูล
ในทฤษฎีสถาปัตยกรรมคอมพิวเตอร์ โครงสร้างการเชื่อมต่อของสเตจในไปป์ไลน์สามารถแบ่งออกเป็น 2 ประเภทใหญ่:

<div class="comparison-grid">
  <div class="comparison-card">
    <div class="comp-header" style="background: #eff6ff; color: #1e40af;">
      ➡️ 1. ไปป์ไลน์แบบเป็นลำดับ (Linear Pipeline)
    </div>
    <div class="comp-body">
      <p><strong>แนวคิด:</strong> เป็นไปป์ไลน์ที่ข้อมูลไหล <em>ต่อเนื่องกันไปในทิศทางเดียว (Unidirectional Flow)</em> โดยผลลัพธ์จากขั้นตอนหนึ่งจะส่งต่อไปยังขั้นตอนถัดไปเท่านั้น ไม่มีการวนกลับและไม่มีการข้ามขั้นตอน</p>
      <ul>
        <li><strong>ลักษณะเด่น:</strong> มีขั้นตอนเข้าชัดเจน (Input Stage) ไหลเป็นเส้นตรง และออกจากขั้นตอนสุดท้าย (Output Stage)</li>
        <li><strong>การประยุกต์ใช้:</strong> เป็นรูปแบบมาตรฐานที่นิยมใช้มากที่สุดใน CPU ทั่วไป (เช่น MIPS, ARM, x86) เพราะโครงสร้างเรียบง่ายและควบคุมลำดับสัญญาณได้ง่าย</li>
        <li><strong>ตัวอย่างเปรียบเทียบ:</strong> สายพานผลิตรถยนต์ 4 สถานี: ประกอบโครงสร้าง ➔ ติดตั้งเครื่องยนต์ ➔ ทำสี ➔ ตกแต่งภายใน โดยรถไม่เคยถอยหลังกลับไปสถานีเดิม</li>
      </ul>
    </div>
  </div>

  <div class="comparison-card">
    <div class="comp-header" style="background: #faf5ff; color: #6b21a8;">
      🔀 2. ไปป์ไลน์แบบไม่เป็นลำดับ (Non-linear Pipeline)
    </div>
    <div class="comp-body">
      <p><strong>แนวคิด:</strong> เป็นไปป์ไลน์ที่มีความซับซ้อนกว่า โดยอนุญาตให้มี <em>วงจรย้อนกลับ (Feedback Loop)</em> หรือ <em>หลายเส้นทาง (Multiple Paths / Feedforward)</em> เพื่อนำผลลัพธ์กลับมาคำนวณซ้ำหรือข้ามขั้นตอนที่ไม่จำเป็น</p>
      <ul>
        <li><strong>ลักษณะเด่น:</strong> แต่ละสเตจอาจถูกเรียกใช้งานซ้ำหลายครั้งในระหว่างการประมวลผลคำสั่งเดียว ต้องมีตารางจองทรัพยากร (Reservation Table) ควบคุม</li>
        <li><strong>การประยุกต์ใช้:</strong> หน่วยประมวลผลสัญญาณดิจิทัล (DSP), การคำนวณฟังก์ชันคณิตศาสตร์ซับซ้อน, และการประมวลผลภาพแบบปรับตัว (Adaptive Image Processing)</li>
        <li><strong>ตัวอย่างงาน:</strong> การกรองสัญญาณเสียงที่มีการวนลูปกลับไปปรับปรุงคุณภาพเสียง, หรืออัลกอริทึมค้นหาขอบภาพที่ส่งข้อมูลย้อนกลับไปสเตจแรกเพื่อปรับแต่งพารามิเตอร์</li>
      </ul>
    </div>
  </div>
</div>

---

### ตารางเปรียบเทียบเชิงลึก: Linear vs. Non-linear Pipeline

<div class="modern-table-container">
  <table class="modern-table">
    <thead>
      <tr>
        <th>ประเด็นเปรียบเทียบ</th>
        <th>Linear Pipeline (แบบเป็นลำดับ)</th>
        <th>Non-linear Pipeline (แบบไม่เป็นลำดับ)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>ทิศทางการไหลของข้อมูล</strong></td>
        <td>ทิศทางเดียวเป็นเส้นตรง (Unidirectional)</td>
        <td>หลายทิศทาง มี Feedback และ Feedforward</td>
      </tr>
      <tr>
        <td><strong>การใช้งานสเตจซ้ำ</strong></td>
        <td>แต่ละสเตจถูกใช้เพียง 1 ครั้งต่อ 1 คำสั่ง</td>
        <td>สเตจเดิมอาจถูกเรียกใช้ซ้ำหลายรอบในการคำนวณ</td>
      </tr>
      <tr>
        <td><strong>ความซับซ้อนของวงจรควบคุม</strong></td>
        <td>ต่ำ จัดการจังหวะสัญญาณนาฬิกาได้ง่าย</td>
        <td>สูง ต้องควบคุมเส้นทางและการชนกันของข้อมูล</td>
      </tr>
      <tr>
        <td><strong>ความยืดหยุ่นของงาน</strong></td>
        <td>เหมาะสำหรับงานที่มีขั้นตอนตายตัวแน่นอน</td>
        <td>ยืดหยุ่นสูง เหมาะกับการคำนวณแบบพลวัต (Dynamic)</td>
      </tr>
      <tr>
        <td><strong>สถาปัตยกรรมหลักที่ใช้</strong></td>
        <td>General Purpose CPU (MIPS, RISC-V)</td>
        <td>DSP Processors, Multimedia Co-processors</td>
      </tr>
    </tbody>
  </table>
</div>
`
  },
  {
    id: "module-5",
    moduleNumber: "05",
    title: "5. โครงสร้างและองค์ประกอบของไปป์ไลน์ (Pipeline Architecture)",
    pageRef: "หน้าที่ 11-13",
    summary: "โครงสร้างหลักของไปป์ไลน์ประกอบด้วย สเตจ (Stages) และบัฟเฟอร์/แลตช์ระหว่างสเตจ (Pipeline Registers / Buffers / Latches) พร้อมบทบาทสำคัญ 3 ประการ: Isolation, Synchronization, Holding State",
    objectives: [
      { code: "ข้อ 7", text: "อธิบายการทำงานโครงสร้างของไปป์ไลน์ (Pipeline Architecture) ได้อย่างถูกต้อง" }
    ],
    content: `
### สถาปัตยกรรมโครงสร้างหลักของไปป์ไลน์ (Core Components of Pipeline)
โครงสร้างฮาร์ดแวร์ของไปป์ไลน์เปรียบเสมือน **สายพานการผลิตรถยนต์** ที่ประกอบด้วย 2 องค์ประกอบพื้นฐานที่ขาดกันไม่ได้:

#### 1. สเตจ (Pipeline Stages)
- **นิยาม:** สถานีงานย่อยแต่ละแห่งที่รับผิดชอบการประมวลผลเฉพาะด้าน เช่น สเตจ Fetch, Decode, Execute, Memory, Write Back
- **การทำงาน:** ในแต่ละรอบสัญญาณนาฬิกา (Clock Cycle) แต่ละสเตจจะทำงานกับคำสั่งคนละตัวกันอย่างเป็นอิสระ

#### 2. บัฟเฟอร์ระหว่างสเตจ (Pipeline Registers / Latches / Buffers)
- **นิยาม:** หน่วยเก็บข้อมูลชั่วคราวความเร็วสูง (D-Flip Flops) ที่คั่นอยู่ระหว่างสเตจแต่ละสเตจ (เช่น IF/ID Register, ID/EX Register, EX/MEM Register, MEM/WB Register)
- **อุปมาอุปไมย:** เปรียบเสมือน **"พื้นที่พักรถชั่วคราว"** ระหว่างสถานีทำสีและสถานีติดตั้งเครื่องยนต์ เมื่อสถานีหนึ่งทำเสร็จ จะนำรถมาจอดพักไว้ที่นี่ เพื่อให้สถานีเดิมสามารถรับงานใหม่ได้ทันที

---

### บทบาทสำคัญ 3 ประการของบัฟเฟอร์ระหว่างสเตจ (3 Critical Roles of Inter-stage Buffers)

<div class="process-flow-container">
  <div class="step-card">
    <div class="step-badge">บทบาทที่ 1</div>
    <div class="step-icon">🛡️</div>
    <div class="step-title">การป้องกันข้อมูลปนกัน (Isolation)</div>
    <div class="step-desc">
      ทำหน้าที่เป็นฉากกั้นไม่ให้ผลลัพธ์ของสเตจก่อนหน้าไหลล้นเข้าไปรบกวนการทำงานของสเตจถัดไปก่อนเวลาอันควร ป้องกันปัญหา Race Conditions
    </div>
  </div>
  <div class="step-arrow">➔</div>
  <div class="step-card">
    <div class="step-badge">บทบาทที่ 2</div>
    <div class="step-icon">⏱️</div>
    <div class="step-title">การประสานจังหวะเวลา (Synchronization)</div>
    <div class="step-desc">
      ส่งผ่านข้อมูลข้ามสเตจพร้อมเพรียงกันในจังหวะขอบสัญญาณนาฬิกา (Clock Edge) ทำให้ทุกขั้นตอนในไปป์ไลน์ทำงานสอดประสานกันอย่างเป็นระเบียบ
    </div>
  </div>
  <div class="step-arrow">➔</div>
  <div class="step-card">
    <div class="step-badge">บทบาทที่ 3</div>
    <div class="step-icon">📦</div>
    <div class="step-title">การกักเก็บสถานะคำสั่ง (Holding State)</div>
    <div class="step-desc">
      เก็บรักษาข้อมูลค่าตัวแปร ผลลัพธ์ชั่วคราว และสัญญาณควบคุม (Control Signals) ของคำสั่งที่กำลังเดินทางผ่านไปป์ไลน์จนกว่าจะประมวลผลเสร็จสิ้น
    </div>
  </div>
</div>

<div class="callout callout-success">
  <strong>ประโยชน์สูงสุดของการมีบัฟเฟอร์:</strong><br/>
  ทำให้แต่ละสเตจสามารถทำงานได้อย่างเป็นอิสระจากกัน เมื่อสเตจหนึ่งทำงานเสร็จและบันทึกข้อมูลลงบัฟเฟอร์แล้ว สเตจนั้นสามารถรับคำสั่งใหม่เข้ามาเริ่มทำในรอบถัดไปได้ทันที โดยไม่ต้องรอให้คำสั่งก่อนหน้าเดินทางไปจนสุดปลายทางของ CPU
</div>
`
  },
  {
    id: "module-6",
    moduleNumber: "06",
    title: "6. การเพิ่มประสิทธิภาพของไปป์ไลน์ (Pipeline Optimization)",
    pageRef: "หน้าที่ 14-16, 26, 29",
    summary: "สองปัจจัยหลักในการเพิ่มประสิทธิภาพไปป์ไลน์: การเพิ่มจำนวนสเตจ (More Stages / Superpipelining) และการลดระยะเวลาของแต่ละสเตจ (Reducing Stage Time) พร้อมเปรียบเทียบการล้างรถและเครื่องคิดเลข",
    objectives: [
      { code: "ข้อ 8", text: "อธิบายการเพิ่มประสิทธิภาพของไปป์ไลน์ (Pipeline Optimization) ได้อย่างถูกต้อง" }
    ],
    content: `
### ปัจจัยหลัก 2 ประการในการเพิ่มประสิทธิภาพไปป์ไลน์ (Two Optimization Levers)
เป้าหมายสูงสุดของการปรับแต่งไปป์ไลน์ (**Pipeline Optimization**) คือการเพิ่ม **อัตราการส่งมอบงานสำเร็จต่อหน่วยเวลา (Throughput)** และ **ลดจำนวนรอบสัญญาณนาฬิกาที่สูญเสียไปกับการรอ (Stall Cycles)** ซึ่งสามารถทำได้ผ่าน 2 แนวทางหลัก:

<div class="comparison-grid">
  <div class="comparison-card">
    <div class="comp-header" style="background: #ecfdf5; color: #065f46;">
      📈 แนวทางที่ 1: การเพิ่มจำนวนสเตจ (More Stages / Superpipelining)
    </div>
    <div class="comp-body">
      <p><strong>แนวคิด:</strong> ซอยงานใหญ่ให้เป็นงานย่อยๆ มากขึ้น (เช่น จาก 5 สเตจ เป็น 10 หรือ 20 สเตจ) เพื่อให้แต่ละสเตจมีขนาดเล็กลงและใช้เวลาสั้นลง</p>
      <ul>
        <li><strong>กลไก:</strong> เมื่อเวลาของแต่ละสเตจสั้นลง รอบสัญญาณนาฬิกา (Clock Cycle Time) จะสั้นลง ทำให้สามารถเพิ่มความถี่สัญญาณนาฬิกา (Clock Frequency / GHz) ของ CPU ให้สูงขึ้นได้</li>
        <li><strong>ข้อดี:</strong> เพิ่ม Throughput ของระบบอย่างมีนัยสำคัญ สามารถปล่อยคำสั่งใหม่เข้าสู่ระบบได้ถี่ขึ้น</li>
        <li><strong>ข้อเสีย/ความเสี่ยง:</strong> เพิ่มโอกาสเกิด Pipeline Hazards มากขึ้น, โทษการ Flush เมื่อทำนายผิดสูงขึ้น, และมีความล่าช้าสะสมจากแลตช์กั้นสเตจ (Latch Overhead)</li>
      </ul>
    </div>
  </div>

  <div class="comparison-card">
    <div class="comp-header" style="background: #eff6ff; color: #1e40af;">
      ⚡ แนวทางที่ 2: การลดระยะเวลาของแต่ละสเตจ (Reducing Stage Time)
    </div>
    <div class="comp-body">
      <p><strong>แนวคิด:</strong> ปรับปรุงฮาร์ดแวร์ภายในแต่ละสเตจให้ทำงานได้เร็วขึ้น โดยคงจำนวนสเตจไว้เท่าเดิม</p>
      <ul>
        <li><strong>กลไก:</strong> ใช้เทคโนโลยีวงจรที่ล้ำสมัย เช่น การใช้ High-speed ALU ที่มี Carry-lookahead Adder, การปรับแต่งวงจร Register File ให้มี Access Time สั้นลง หรือปรับปรุงการเข้าถึงแคช</li>
        <li><strong>ข้อดี:</strong> เพิ่มความเร็ว Clock Speed ของ CPU โดยตรงโดยไม่ต้องเพิ่มความซับซ้อนของขั้นตอนการควบคุมไปป์ไลน์</li>
        <li><strong>ข้อเสีย:</strong> ต้นทุนการผลิตฮาร์ดแวร์สูงขึ้นอย่างรวดเร็ว เกิดปัญหาการสะสมความร้อน (Thermal Dissipation) และการใช้พลังงานไฟฟ้าสูงขึ้น</li>
      </ul>
    </div>
  </div>
</div>

---

### ตัวอย่างเปรียบเทียบในเชิงรูปธรรม

#### ตัวอย่างที่ 1: การล้างรถ (เปรียบเทียบการเพิ่มจำนวนสเตจ)
- **ไปป์ไลน์แบบ 3 สเตจ:** ล้างโฟม (5 นาที) ➔ ขัดเงา (5 นาที) ➔ เช็ดแห้ง (5 นาที) = ล้างรถเสร็จ 1 คันในทุกๆ **5 นาที**
- **ไปป์ไลน์แบบ 5 สเตจ:** ฉีดน้ำ (2 นาที) ➔ ล้างโฟม (2 นาที) ➔ ฉีดน้ำล้างโฟม (2 นาที) ➔ ขัดเงา (2 นาที) ➔ เช็ดแห้ง (2 นาที) = ปล่อยรถออกจากไปป์ไลน์ได้ในทุกๆ **2 นาที**
- **ข้อสรุป:** แม้ว่าเวลาที่รถ 1 คันผ่านทั้งระบบ (Latency) จะใกล้เคียงกัน แต่แบบ 5 สเตจให้ Throughput ที่สูงกว่าถึง 2.5 เท่า

#### ตัวอย่างที่ 2: การคำนวณบัญชี (เปรียบเทียบการลดเวลาของสเตจ)
- **วิธีที่ 1:** ใช้เครื่องคิดเลขธรรมดา แต่ละขั้นตอนกดและคำนวณใช้เวลา 10 วินาที
- **วิธีที่ 2:** ใช้เครื่องคิดเลขวิทยาศาสตร์ความเร็วสูง แต่ละขั้นตอนกดและคำนวณใช้เวลาเพียง 5 วินาที
- **ข้อสรุป:** จำนวนขั้นตอนเท่าเดิม แต่การใช้เครื่องมือประมวลผลที่เร็วกว่าจะช่วยร่นเวลาทั้งหมดให้เสร็จเร็วขึ้นได้โดยตรง

<div class="callout callout-warning">
  <strong>เป้าหมายหัวใจสำคัญในการสอบ (Exam Focus):</strong><br/>
  เป้าหมายหลักของการเพิ่มประสิทธิภาพของไปป์ไลน์ในทางสถาปัตยกรรมคอมพิวเตอร์ คือ <strong>"การลดจำนวนรอบสัญญาณนาฬิกาที่สูญเสียไปกับการรอ (Stall Cycles)"</strong> ให้เหลือน้อยที่สุดเท่าที่จะเป็นไปได้
</div>
`
  },
  {
    id: "module-7",
    moduleNumber: "07",
    title: "7. ปัญหาในการทำงานแบบไปป์ไลน์ (Pipeline Hazards)",
    pageRef: "หน้าที่ 16-19, 27, 30",
    summary: "ทำความเข้าใจอุปสรรค 3 ประการที่ทำให้ไปป์ไลน์หยุดชะงัก: Data Hazard (การพึ่งพาข้อมูล RAW), Structural Hazard (การแย่งทรัพยากรฮาร์ดแวร์), และ Control Hazard (คำสั่ง Branch/Jump)",
    objectives: [
      { code: "ข้อ 9", text: "อธิบายปัญหาในการทำงานแบบไปป์ไลน์ (Pipeline Hazards) แบบข้อมูล (Data Hazard) ได้" },
      { code: "ข้อ 10", text: "อธิบายปัญหาในการทำงานแบบไปป์ไลน์ (Pipeline Hazards) แบบโครงสร้าง (Structural Hazard) ได้" },
      { code: "ข้อ 11", text: "อธิบายปัญหาในการทำงานแบบไปป์ไลน์ (Pipeline Hazards) แบบควบคุม (Control Hazard) ได้" }
    ],
    content: `
### ความหมายของ Pipeline Hazards (ความเสี่ยงในไปป์ไลน์)
**Pipeline Hazard** คือ เหตุการณ์หรือสภาพการณ์ที่ขัดขวางไม่ให้คำสั่งถัดไปในสายการประมวลผลสามารถทำงานในรอบสัญญาณนาฬิกาที่กำหนดได้ ทำให้ไปป์ไลน์ต้อง **"หยุดชะงัก (Stall)"** หรือต้อง **"ล้างคำสั่งทิ้ง (Flush)"** ส่งผลให้ประสิทธิภาพลดลง แบ่งออกเป็น 3 รูปแบบหลัก:

---

### 1. Hazard แบบข้อมูล (Data Hazard)
- **สาเหตุ:** เกิดขึ้นเมื่อคำสั่งหนึ่งต้องการใช้งาน **ข้อมูล (Data/Operand)** ที่เป็นผลลัพธ์จากคำสั่งก่อนหน้า แต่คำสั่งก่อนหน้านั้น **ยังประมวลผลไม่เสร็จสมบูรณ์หรือยังไม่ได้เขียนข้อมูลกลับลงรีจิสเตอร์**
- **ชนิดที่พบบ่อยที่สุด:** **RAW (Read After Write)** หรือการที่คำสั่งถัดไปพยายามจะ "อ่าน (Read)" ข้อมูล ก่อนที่คำสั่งแรกจะ "เขียน (Write)" เสร็จ
- **ตัวอย่างในชีวิตประจำวัน:** กำลังทำอาหาร:
  - คำสั่งที่ 1: ทอดไข่เจียว
  - คำสั่งที่ 2: ทำข้าวผัดไข่ ➔ คุณไม่สามารถเริ่มผัดข้าวได้หากไข่เจียว (ข้อมูลที่ต้องการ) ยังทอดไม่เสร็จ
- **ตัวอย่างโค้ดคำสั่งใน CPU:**
  <div class="code-block"><pre>ADD R1, R2, R3   # คำนวณเสร็จใน EX แต่จะเขียนผลลง R1 ในสเตจ WB (รอบที่ 5)
SUB R4, R1, R5   # ต้องการอ่านค่า R1 ในสเตจ ID (รอบที่ 3) -> เกิด Data Hazard!</pre></div>

---

### 2. Hazard แบบโครงสร้าง (Structural Hazard)
- **สาเหตุ:** เกิดขึ้นเมื่อ **ทรัพยากรฮาร์ดแวร์ (Hardware Resource) มีไม่เพียงพอ** ทำให้มีคำสั่งตั้งแต่ 2 คำสั่งขึ้นไปต้องการเข้าใช้งานฮาร์ดแวร์ชิ้นเดียวกันในรอบสัญญาณนาฬิกาเดียวกัน
- **ตัวอย่างในชีวิตประจำวัน:** โรงงานผลิตรถยนต์มีเครื่องพ่นสีเพียงเครื่องเดียว ถ้ารถคันที่ 1 และรถคันที่ 2 เดินทางมาถึงสถานีพ่นสีพร้อมกัน รถคันที่ 2 จะต้องหยุดรอ
- **ตัวอย่างใน CPU:**
  - สถาปัตยกรรมแบบ Von Neumann ที่มี **Memory Port เพียงพอร์ตเดียว** (รวมคำสั่งและข้อมูลไว้ด้วยกัน)
  - ขณะที่คำสั่งที่ 1 (เช่น LOAD) กำลังเข้าถึง Memory ในสเตจ MEM คำสั่งที่ 4 กำลังต้องการดึงคำสั่ง (Fetch) จาก Memory เดียวกันในสเตจ IF ➔ เกิดการแย่งพอร์ตชนกัน!
- **แนวทางแก้ไขพื้นฐาน:** การทำสำเนาทรัพยากร (**Resource Replication**) เช่น การแยกหน่วยความจำออกเป็น Instruction Memory และ Data Memory (Harvard Architecture) หรือเพิ่มพอร์ต

---

### 3. Hazard แบบควบคุม (Control Hazard / Branch Hazard)
- **สาเหตุ:** เกิดขึ้นจากคำสั่งที่ **เปลี่ยนแปลงทิศทางการทำงานของโปรแกรม (Change of Program Flow)** เช่น คำสั่งกระโดดแบบมีเงื่อนไข (Conditional Branch เช่น IF, BEQZ) หรือคำสั่งกระโดดข้าม (JUMP)
- **ปัญหาที่เกิดขึ้น:** ไปป์ไลน์ทำการดึงคำสั่งล่วงหน้า (Pre-fetching) แต่ CPU จะยังไม่รู้ผลลัพธ์ว่าเงื่อนไขจะเป็นจริง (Branch Taken) หรือเท็จ (Not Taken) จนกว่าจะถึงสเตจ ID หรือ EX
- **ตัวอย่างในชีวิตประจำวัน:** ขับรถตามแผนที่: "ถ้าเจอไฟแดงให้เลี้ยวซ้าย แต่ถ้าไฟเขียวให้ตรงไป" คุณเดาและเตรียมเลี้ยวซ้ายล่วงหน้า แต่พอไปถึงแยกจริงๆ เป็นไฟเขียว ทำให้การเตรียมตัวก่อนหน้าสูญเปล่าทั้งหมด
- **ผลกระทบ:** หาก CPU ดึงคำสั่งมาผิดทิศทาง คำสั่งเหล่านั้นจะต้องถูก **ล้างทิ้งออกจากไปป์ไลน์ทั้งหมด (Pipeline Flush)** ทำให้สูญเสียรอบสัญญาณนาฬิกาไปฟรีๆ

<div class="modern-table-container">
  <table class="modern-table">
    <thead>
      <tr>
        <th>ชนิดของ Hazard</th>
        <th>สาเหตุหลักที่ทำให้เกิด</th>
        <th>ผลกระทบต่อการทำงาน</th>
        <th>ตัวอย่างคำสั่งที่เกี่ยวข้อง</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Data Hazard</strong></td>
        <td>คำสั่งหลังต้องการใช้ผลลัพธ์ของคำสั่งก่อนหน้าที่ยังเขียนไม่เสร็จ (RAW)</td>
        <td>ต้องรอให้ข้อมูลพร้อม หรือส่งค่าลัดวงจร</td>
        <td>ADD R1, R2, R3 ตามด้วย SUB R4, R1, R5</td>
      </tr>
      <tr>
        <td><strong>Structural Hazard</strong></td>
        <td>ฮาร์ดแวร์ไม่พอ หลายคำสั่งแย่งใช้ทรัพยากรเดียวกันในรอบเดียวกัน</td>
        <td>คำสั่งหนึ่งต้องหยุดรอให้ทรัพยากรว่าง</td>
        <td>คำสั่ง LOAD/STORE แย่งพอร์ตหน่วยความจำกับ IF</td>
      </tr>
      <tr>
        <td><strong>Control Hazard</strong></td>
        <td>คำสั่ง Branch/Jump ทำให้ไม่รู้ว่าคำสั่งถัดไปที่ต้อง Fetch คือคำสั่งใด</td>
        <td>ดึงคำสั่งผิดทาง และต้องล้างคำสั่งทิ้ง (Flush)</td>
        <td>BEQZ, BNE, JUMP, CALL, RETURN</td>
      </tr>
    </tbody>
  </table>
</div>
`
  },
  {
    id: "module-8",
    moduleNumber: "08",
    title: "8. เทคนิคการแก้ไขและบรรเทาปัญหา Pipeline Hazards",
    pageRef: "หน้าที่ 19-23, 27-28, 29-31",
    summary: "4 เทคนิคสำคัญในการจัดการ Hazards: การหยุดรอ (Stalling/Bubble), การส่งต่อข้อมูลลัดวงจร (Forwarding/Bypassing), การทำนายผลลัพธ์ (Branch Prediction) และการจัดลำดับคำสั่งใหม่โดย Compiler (Instruction Reordering)",
    objectives: [
      { code: "ข้อ 12", text: "อธิบายเทคนิคการแก้ปัญหา Hazard แบบการหยุดรอ (Stalling) หรือ Bubble ได้" },
      { code: "ข้อ 13", text: "อธิบายเทคนิคการแก้ปัญหา Hazard แบบการส่งต่อข้อมูล (Forwarding) หรือ Bypassing ได้" },
      { code: "ข้อ 14", text: "อธิบายเทคนิคการแก้ปัญหา Hazard แบบการทำนายการทำงาน (Branch Prediction) ได้" },
      { code: "ข้อ 15", text: "อธิบายเทคนิคการแก้ปัญหา Hazard แบบการจัดลำดับคำสั่งใหม่ (Instruction Reordering) ได้" }
    ],
    content: `
### 4 กลยุทธ์ในการรับมือและแก้ไข Pipeline Hazards
เพื่อรักษาประสิทธิภาพของไปป์ไลน์ให้อยู่ในระดับสูงสุด นักสถาปัตยกรรมคอมพิวเตอร์และผู้พัฒนาซอฟต์แวร์ได้คิดค้นเทคนิคการแก้ปัญหาหลัก 4 วิธี:

---

### 1. การหยุดรอ (Stalling) หรือการแทรกฟองอากาศ (Bubble / NOP)
- **หลักการทำงาน:** เมื่อวงจรควบคุมตรวจพบ Hazard จะทำ **การแทรกคำสั่งว่างเปล่าที่ไม่มีการทำงาน (NOP - No Operation)** หรือที่เรียกว่า **"Bubble" (ฟองอากาศ)** เข้าไปในไปป์ไลน์ เพื่อหน่วงเวลาให้คำสั่งที่ต้องรอหยุดอยู่กับที่
- **กลไก:** ชะลอคำสั่งถัดไปไว้ 1 ถึง 2 รอบสัญญาณนาฬิกา จนกระทั่งคำสั่งแรกทำงานผ่านสเตจ WB และเขียนข้อมูลลงใน Register File เสร็จสิ้น
- **ข้อดี:** เป็นเทคนิคที่ **เรียบง่ายที่สุด** ไม่ต้องเพิ่มวงจรส่งต่อข้อมูลที่ซับซ้อน
- **ข้อเสีย:** **สูญเสียรอบสัญญาณนาฬิกา (Stall Cycles) ไปโดยเปล่าประโยชน์** ทำให้ประสิทธิภาพของไปป์ไลน์ตกลงอย่างมาก

---

### 2. การส่งต่อข้อมูล (Forwarding) หรือการบายพาส (Bypassing)
- **หลักการทำงาน:** แก้ไขปัญหา Data Hazard โดยการ **ส่งผลลัพธ์ที่คำนวณเสร็จแล้วจากสเตจ Execute (หรือ Memory) ส่งตรงไปยังสเตจที่ต้องการใช้งานทันทีผ่านสายสัญญาณพิเศษ (Bypass Path)** โดยไม่ต้องรอให้เขียนกลับลง Register File ในสเตจ WB ก่อน
- **กลไก:** 
  - คำสั่ง \`ADD R1, R2, R3\` คำนวณค่า R1 เสร็จที่ปลายสเตจ EX (รอบที่ 3)
  - วงจร Forwarding จะดักจับค่านั้นส่งตรงเข้าสู่ทางเข้าของ ALU ในสเตจ EX ของคำสั่ง \`SUB R4, R1, R5\` ในรอบที่ 4 ทันที
- **ข้อดี:** **ประสิทธิภาพสูงสุด** สามารถกำจัดรอบการหยุดรอ (Stall Cycles) สำหรับคำสั่งประเภทคณิตศาสตร์ได้เกือบ 100%
- **ข้อเสีย:** ต้องเพิ่มวงจรฮาร์ดแวร์ มัลติเพล็กเซอร์ (Multiplexers) และสายเชื่อมต่อภายในชิปที่ซับซ้อนขึ้นมาก

---

### 3. การทำนายการทำงานของกิ่งคำสั่ง (Branch Prediction)
- **หลักการทำงาน:** แก้ไขปัญหา Control Hazard โดยระบบจะ **คาดเดาล่วงหน้า (Predict)** ว่าคำสั่งเงื่อนไขจะกระโดดไปที่อยู่ใหม่ (Taken) หรือไม่กระโดด (Not Taken) และดึงคำสั่งตามทิศทางที่คาดเดามาทำงานล่วงหน้าทันที
  - **Static Prediction:** ทำนายแบบตายตัว เช่น ทำนายว่า "ไม่กระโดดเสมอ" (Predict Not Taken) หรือถ้าเป็นลูปให้ทำนายว่ากระโดดกลับ
  - **Dynamic Prediction:** มีตารางประวัติ (Branch History Table) บันทึกพฤติกรรมในอดีตเพื่อใช้ทำนายอย่างแม่นยำสูง
- **ผลลัพธ์เมื่อทำนายถูกต้อง:** ไม่มีการสูญเสียรอบเวลาเลย (Zero Penalty)
- **ผลลัพธ์เมื่อทำนายผิดพลาด:** CPU จะต้อง **ล้างคำสั่งที่ดึงมาล่วงหน้าทิ้งทั้งหมด (Flush the Pipeline)** และกลับไปดึงคำสั่งจากตำแหน่งที่ถูกต้องมาใหม่ ทำให้เสียเวลาไป 2-3 รอบสัญญาณนาฬิกา

---

### 4. การจัดลำดับคำสั่งใหม่ (Instruction Reordering)
- **หลักการทำงาน:** อาศัย **คอมไพเลอร์ (Compiler)** หรือฮาร์ดแวร์แบบ Out-of-Order Execution ในการ **สลับลำดับคำสั่งที่เป็นอิสระต่อกัน (Independent Instructions)** ให้เข้ามาแทรกตรงช่องว่างที่กำลังจะเกิดการรอคอย
- **ตัวอย่างการจัดลำดับโค้ด:**
  <div class="code-block"><pre><span class="hl-comment"># โค้ดเดิม (เกิด Stall หลังคำสั่งที่ 1):</span>
1. LOAD R1, A      # ต้องรอโหลดข้อมูลจาก Memory
2. ADD  R2, R1, B  # ต้องรอ R1 -> เกิด Data Hazard ทำให้ต้อง Stall
3. LOAD R3, C      # อิสระ
4. SUB  R4, R3, D

<span class="hl-comment"># โค้ดใหม่หลังทำ Reordering (ไม่มี Stall เกิดขึ้นเลย!):</span>
1. LOAD R1, A      # เริ่มโหลด A
2. LOAD R3, C      # สลับคำสั่ง 3 ขึ้นมาทำตรงนี้ระหว่างที่ R1 กำลังโหลด!
3. ADD  R2, R1, B  # ถึงตรงนี้ข้อมูล R1 พร้อมใช้งานแล้ว ไม่ต้องหยุดรอ!
4. SUB  R4, R3, D</pre></div>

<div class="modern-table-container">
  <table class="modern-table">
    <thead>
      <tr>
        <th>เทคนิคการแก้ปัญหา</th>
        <th>แก้ปัญหา Hazard ชนิดใด</th>
        <th>ผู้ดำเนินการหลัก</th>
        <th>จุดเด่น / ข้อดี</th>
        <th>ข้อจำกัด / ข้อเสีย</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Stalling (Bubble)</strong></td>
        <td>Data / Structural Hazard</td>
        <td>ฮาร์ดแวร์ควบคุม</td>
        <td>สร้างง่าย ไม่ซับซ้อน</td>
        <td>สูญเสียรอบสัญญาณนาฬิกา</td>
      </tr>
      <tr>
        <td><strong>Forwarding (Bypassing)</strong></td>
        <td>Data Hazard (RAW)</td>
        <td>วงจรฮาร์ดแวร์พิเศษ</td>
        <td>ไม่เสียรอบ Stall ประสิทธิภาพสูงสุด</td>
        <td>เพิ่มความซับซ้อนของวงจรซิลิคอน</td>
      </tr>
      <tr>
        <td><strong>Branch Prediction</strong></td>
        <td>Control Hazard</td>
        <td>ฮาร์ดแวร์ทำนายผล</td>
        <td>ลด Stall ได้มากหากทำนายถูก</td>
        <td>ถ้าทำนายผิดต้องเสียเวลา Flush ท่อ</td>
      </tr>
      <tr>
        <td><strong>Instruction Reordering</strong></td>
        <td>Data / Control Hazard</td>
        <td>คอมไพเลอร์ (Compiler)</td>
        <td>ไม่ต้องเพิ่มต้นทุนฮาร์ดแวร์เลย</td>
        <td>ต้องอาศัยคำสั่งอิสระในโค้ด</td>
      </tr>
    </tbody>
  </table>
</div>
`
  },
  {
    id: "module-9",
    moduleNumber: "09",
    title: "9. การเปรียบเทียบประสิทธิภาพเชิงตัวเลขและการวัดผล (Performance Analysis)",
    pageRef: "หน้าที่ 24-25, 28, 29",
    summary: "การวัดประสิทธิภาพด้วย Latency และ Throughput (IPS, IPC) ตัวอย่างการคำนวณเชิงเปรียบเทียบ 3 คำสั่ง 3 สเตจ สูตรการคำนวณเวลาและ Speedup ในทางทฤษฎีเทียบกับความเป็นจริง",
    objectives: [
      { code: "ข้อ 16", text: "อธิบายการเปรียบเทียบประสิทธิภาพการทำงานแบบไปป์ไลน์และการทำงานไม่ใช้ไปป์ไลน์ (Compare the performance of Pipelined vs. Non-pipelined operation) ได้" }
    ],
    content: `
### ตัวชี้วัดประสิทธิภาพหลัก 2 ประการ (Two Key Performance Metrics)
ในการประเมินความเร็วและประสิทธิภาพของสถาปัตยกรรมคอมพิวเตอร์ จะใช้ 2 ค่าหลักในการวัดผล:

<div class="comparison-grid">
  <div class="comparison-card">
    <div class="comp-header" style="background: #f8fafc; color: #334155;">
      ⏱️ 1. Latency (ความหน่วงเวลาของคำสั่ง)
    </div>
    <div class="comp-body">
      <ul>
        <li><strong>ความหมาย:</strong> ระยะเวลาตั้งแต่เริ่มต้นจนกระทั่ง <em>คำสั่งเดียว (Single Instruction)</em> ประมวลผลเสร็จสิ้นสมบูรณ์</li>
        <li><strong>หน่วยวัด:</strong> รอบสัญญาณนาฬิกา (Clock Cycles) หรือหน่วยเวลา (เช่น นาโนวินาที ns)</li>
        <li><strong>ข้อเท็จจริงสำคัญ:</strong> ไปป์ไลน์ <strong>ไม่ได้ช่วยลดค่า Latency ของคำสั่งเดี่ยว</strong> (แต่ละคำสั่งยังคงต้องผ่านครบทั้ง 5 สเตจเท่าเดิม หรืออาจมากกว่าเดิมเล็กน้อยเนื่องจากแลตช์)</li>
      </ul>
    </div>
  </div>

  <div class="comparison-card">
    <div class="comp-header" style="background: #f0fdf4; color: #166534;">
      🚀 2. Throughput (อัตรางานที่ทำได้ต่อหน่วยเวลา)
    </div>
    <div class="comp-body">
      <ul>
        <li><strong>ความหมาย:</strong> ปริมาณหรือ <em>จำนวนคำสั่งที่ประมวลผลเสร็จสิ้น</em> ในหนึ่งหน่วยเวลา</li>
        <li><strong>หน่วยวัด:</strong> คำสั่งต่อวินาที (IPS - Instructions Per Second) หรือคำสั่งต่อรอบสัญญาณนาฬิกา (IPC - Instructions Per Cycle)</li>
        <li><strong>ข้อเท็จจริงสำคัญ:</strong> ไปป์ไลน์ช่วย <strong>เพิ่มค่า Throughput ให้สูงขึ้นอย่างมหาศาล</strong> เพราะสามารถปล่อยคำสั่งที่เสร็จใหม่ออกมาได้ในเกือบทุกๆ รอบสัญญาณนาฬิกา</li>
      </ul>
    </div>
  </div>
</div>

---

### กรณีศึกษาตัวอย่างการคำนวณเชิงตัวเลข (Numerical Example จากเอกสารหน้า 24-25)
สมมติว่าเรามีงานทั้งหมด **3 คำสั่ง (n = 3)** แต่ละคำสั่งแบ่งออกเป็น **3 ขั้นตอนย่อย (k = 3 สเตจ)** และแต่ละขั้นตอนย่อยใช้เวลา **1 รอบสัญญาณนาฬิกา (1 Cycle)**:

#### แบบที่ 1: ไม่ใช้ไปป์ไลน์ (Non-Pipelined / Sequential)
- **หลักการ:** ทำงานทีละคำสั่งจนเสร็จสมบูรณ์ทีละตัว
- **Latency ต่อคำสั่ง:** 3 สเตจ × 1 รอบ/สเตจ = **3 รอบสัญญาณนาฬิกาต่อคำสั่ง**
- **Throughput:** ทำงานเสร็จ 1 คำสั่งในทุก 3 รอบ = 1/3 = **ประมาณ 0.33 IPC**
- **เวลารวมทั้งหมด:** 3 คำสั่ง × 3 รอบ/คำสั่ง = **9 รอบสัญญาณนาฬิกา**

#### แบบที่ 2: ใช้ไปป์ไลน์ (Pipelined)
- **หลักการ:** แบ่งงานเป็นสเตจและเริ่มคำสั่งใหม่ในทุกๆ รอบสัญญาณนาฬิกา
- **Latency ต่อคำสั่ง:** คำสั่งแรกยังคงต้องใช้เวลาเดินทางผ่าน 3 สเตจ = **3 รอบสัญญาณนาฬิกา**
- **Throughput:** เมื่อไปป์ไลน์เต็ม สามารถส่งมอบงานใหม่ได้ทุกๆ 1 รอบ = **1 IPC**
- **สูตรคำนวณเวลารวม:** 
<div class="formula-box">เวลาทั้งหมด = (k + n - 1) = (3 สเตจ + 3 คำสั่ง - 1) = 5 รอบสัญญาณนาฬิกา</div>

---

### สรุปผลการเปรียบเทียบคุณสมบัติ (ตารางที่ 8-5)

<div class="modern-table-container">
  <table class="modern-table">
    <thead>
      <tr>
        <th>คุณสมบัติ (Metric)</th>
        <th>ไม่ใช้ไปป์ไลน์ (Non-Pipelined)</th>
        <th>ใช้ไปป์ไลน์ (Pipelined)</th>
        <th>ผลการเปรียบเทียบ</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Latency (ความหน่วงต่อคำสั่ง)</strong></td>
        <td>3 รอบสัญญาณนาฬิกา</td>
        <td>3 รอบสัญญาณนาฬิกา</td>
        <td><span class="metric-badge badge-warning">เท่ากัน (ไม่เปลี่ยนแปลง)</span></td>
      </tr>
      <tr>
        <td><strong>Throughput (อัตรางานต่อรอบ)</strong></td>
        <td>0.33 IPC (ต่ำ)</td>
        <td>1.00 IPC (สูง)</td>
        <td><span class="metric-badge badge-success">ไปป์ไลน์สูงกว่า 3 เท่า</span></td>
      </tr>
      <tr>
        <td><strong>เวลาที่ใช้ทั้งหมดสำหรับ 3 คำสั่ง</strong></td>
        <td>9 รอบสัญญาณนาฬิกา</td>
        <td>5 รอบสัญญาณนาฬิกา</td>
        <td><span class="metric-badge badge-success">ประหยัดเวลากว่าเกือบเท่าตัว</span></td>
      </tr>
    </tbody>
  </table>
</div>

---

### สูตรคำนวณอัตราเร่งความเร็วในทางทฤษฎี (Speedup Ratio)
เมื่อมีจำนวนคำสั่ง **n คำสั่ง** และไปป์ไลน์มี **k สเตจ**:
- เวลาของระบบไม่ใช้ไปป์ไลน์: **T_seq = n × k** รอบสัญญาณนาฬิกา
- เวลาของระบบไปป์ไลน์: **T_pipe = k + n - 1** รอบสัญญาณนาฬิกา
- อัตราเร่งความเร็ว (**Speedup: S**):
<div class="formula-box">Speedup = (n × k) / (k + n - 1)</div>

<div class="callout callout-purple">
  <strong>ขีดจำกัดทางทฤษฎี (Ideal Theoretical Limit):</strong><br/>
  เมื่อจำนวนคำสั่ง n มีค่ามากจนเข้าสู่อนันต์ (n ➔ ∞) ค่า Speedup จะมีค่าเข้าใกล้ <strong>k (จำนวนสเตจของไปป์ไลน์)</strong> เช่น ไปป์ไลน์ 5 สเตจ จะสามารถเร็วขึ้นได้สูงสุดในทางทฤษฎีเกือบ <strong>5 เท่า</strong> แต่ในความเป็นจริงอัตราเร่งจะน้อยกว่าทฤษฎีเสมอเนื่องจาก:
  <ol style="margin-top: 8px; padding-left: 20px;">
    <li>เวลาของแต่ละสเตจไม่เท่ากันอย่างสมบูรณ์ (Stage Imbalance)</li>
    <li>ความล่าช้าสะสมของแลตช์กั้นสเตจ (Register Overhead)</li>
    <li>การเกิดฟองอากาศและการหยุดรอจาก Pipeline Hazards (Stalls & Flushes)</li>
  </ol>
</div>
`
  }
];
