# -*- coding: utf-8 -*-
import json

modules = [
  {
    "id": "module-1",
    "moduleNumber": "01",
    "title": "1. บทนำและหลักการพื้นฐานของการทำงานแบบไปป์ลายน์ (Introduction to Pipeline)",
    "pageRef": "หน้าที่ 3-5",
    "summary": "นิยามของเทคนิคไปป์ไลน์ (Pipeline), 3 เสาหลักของการทำงาน (การแบ่งงานย่อย, การทำพร้อมกัน, การทำต่อเนื่อง), ตัวอย่างเปรียบเทียบในชีวิตจริง (โรงงานผลิตรถยนต์ และการซักผ้า 3 ถัง), และการทำงานเชิงเวลาใน CPU สู่การเพิ่ม Throughput",
    "objectives": [
      "ข้อ 1: อธิบายหลักการทำงานของ CPU แบบไม่ใช้ไปป์ไลน์ (Single-cycle) ได้",
      "ข้อ 2: อธิบายหลักการทำงานของ CPU แบบไปป์ไลน์ (Pipeline) ได้"
    ],
    "content": """
### ความหมายของไปป์ไลน์ (Definition of Pipeline)
**การทำงานแบบไปป์ไลน์ (Pipeline)** คือ เทคนิคการเพิ่มประสิทธิภาพของหน่วยประมวลผลกลาง (CPU) ด้วยการแบ่งขั้นตอนการประมวลผลคำสั่งที่เดิมต้องทำทีละขั้นตอนแบบต่อเนื่อง (Sequential) ให้สามารถประมวลผลคำสั่งหลายคำสั่งไปพร้อมๆ กันในแต่ละขั้นตอนย่อย (Overlapped Execution) เพื่อให้ทุกส่วนของฮาร์ดแวร์ทำงานอยู่ตลอดเวลาโดยไม่เกิดการว่างงาน

---

### 3 หลักการสำคัญของระบบไปป์ไลน์ (3 Core Principles)
ระบบไปป์ไลน์ขับเคลื่อนด้วยหลักการ 3 ประการดังนี้:

<div class="process-flow-container">
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-number-badge">หลักการที่ 1</span>
    </div>
    <div class="step-card-title">การแบ่งงานย่อย (Task Decomposition)</div>
    <div class="step-card-desc">งานหนึ่งชิ้นจะถูกซอยแบ่งออกเป็นหลายขั้นตอนย่อยๆ (Sub-tasks หรือ Stages) โดยแต่ละสเตจจะมีขอบเขตหน้าที่เฉพาะเจาะจงและใช้เวลาที่สม่ำเสมอใกล้เคียงกัน</div>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-number-badge">หลักการที่ 2</span>
    </div>
    <div class="step-card-title">การทำพร้อมกัน (Concurrent Execution)</div>
    <div class="step-card-desc">เมื่อขั้นตอนแรกของงานที่ 1 เสร็จและส่งต่อไปยังขั้นตอนที่ 2 งานที่ 2 ก็สามารถก้าวเข้าสู่ขั้นตอนแรกได้ทันที ทำให้เกิดการทำงานซ้อนทับกันหลายคำสั่งในเวลาเดียวกัน</div>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-number-badge">หลักการที่ 3</span>
    </div>
    <div class="step-card-title">การทำต่อเนื่อง (Continuous Processing)</div>
    <div class="step-card-desc">แต่ละขั้นตอนจะส่งมอบผลลัพธ์ไปยังขั้นตอนถัดไปอย่างต่อเนื่องในทุกรอบสัญญาณนาฬิกา (Clock Cycle) ทำให้ไม่เกิดการรอคอยที่สูญเปล่า</div>
  </div>
</div>

---

### ตัวอย่างอุปมาอุปไมยในชีวิตจริง (Real-World Analogies)

#### 1. โรงงานผลิตรถยนต์ (Automobile Assembly Line)
ในกระบวนการประกอบรถยนต์ 1 คัน ประกอบด้วย 4 สถานีหลัก: **ประกอบตัวถัง -> ลงสี -> ติดตั้งเครื่องยนต์ -> ตรวจสอบคุณภาพ**

<div class="comparison-grid">
  <div class="comparison-card left-side">
    <div class="comparison-header">
      <div class="comparison-title">แบบดั้งเดิม (ไม่ใช้ไปป์ไลน์ - Sequential)</div>
      <div class="comparison-subtitle">ทำทีละคันจนเสร็จสมบูรณ์ 100%</div>
    </div>
    <div class="comparison-body">
      <div class="comparison-item">
        <span class="comparison-item-bullet">1.</span>
        <span>รถคันที่ 1 ต้องผ่านทั้ง 4 สถานีจนเสร็จสิ้นสมบูรณ์ รถคันที่ 2 จึงจะเริ่มประกอบตัวถังได้</span>
      </div>
      <div class="comparison-item">
        <span class="comparison-item-bullet">2.</span>
        <span>ขณะที่กำลังลงสีหรือตรวจสภาพ สถานีอื่นที่ว่างอยู่จะไม่มีการทำงาน ทำให้ทรัพยากรว่างเปล่า</span>
      </div>
      <div class="comparison-item">
        <span class="comparison-item-bullet">3.</span>
        <span>ผลลัพธ์: ใช้เวลารวมในการผลิตนานมาก ได้จำนวนรถเสร็จต่อวันต่ำ</span>
      </div>
    </div>
  </div>

  <div class="comparison-card right-side">
    <div class="comparison-header">
      <div class="comparison-title">แบบไปป์ไลน์ (Pipelined Assembly Line)</div>
      <div class="comparison-subtitle">แบ่งสถานีงานแล้วส่งต่อรถทีละคันต่อเนื่อง</div>
    </div>
    <div class="comparison-body">
      <div class="comparison-item">
        <span class="comparison-item-bullet">1.</span>
        <span>เมื่อรถคันที่ 1 ประกอบตัวถังเสร็จและย้ายไปลงสี รถคันที่ 2 จะเริ่มประกอบตัวถังทันที</span>
      </div>
      <div class="comparison-item">
        <span class="comparison-item-bullet">2.</span>
        <span>ทุกสถานีจะมีรถยนต์กำลังถูกประกอบอยู่พร้อมๆ กันในเวลาเดียวกันตลอดเวลา</span>
      </div>
      <div class="comparison-item">
        <span class="comparison-item-bullet">3.</span>
        <span>ผลลัพธ์: โรงงานสามารถส่งมอบรถยนต์คันใหม่ออกจากโรงงานได้อย่างต่อเนื่องทุกๆ ช่วงเวลา</span>
      </div>
    </div>
  </div>
</div>

#### 2. การซักผ้า 3 ถัง (Laundry Analogy)
พิจารณาการซักผ้า 3 ถัง โดยแต่ละถังมี 3 ขั้นตอนย่อยที่ใช้เวลาขั้นตอนละ 30 นาที: **ซัก (30 นาที) -> ตาก (30 นาที) -> พับ (30 นาที)**

<div class="metric-grid">
  <div class="metric-card">
    <div class="metric-label">ไม่ใช้ไปป์ไลน์ (Sequential)</div>
    <div class="metric-value" style="color: var(--rose-danger);">270 นาที</div>
    <div class="metric-desc">ถังละ 90 นาที x 3 ถัง = 270 นาที (รอจนเสร็จทีละถัง)</div>
  </div>
  <div class="metric-card">
    <div class="metric-label">ใช้ไปป์ไลน์ (Pipeline)</div>
    <div class="metric-value" style="color: var(--emerald-success);">150 นาที</div>
    <div class="metric-desc">ซักถัง 2 พร้อมตากถัง 1 (ประหยัดเวลาลงเกือบ 50%!)</div>
  </div>
  <div class="metric-card">
    <div class="metric-label">เวลาที่ประหยัดได้</div>
    <div class="metric-value" style="color: var(--indigo-primary);">120 นาที</div>
    <div class="metric-desc">Throughput เพิ่มขึ้น แต่เวลาต่อถัง (Latency) ใช้ 90 นาทีเท่าเดิม</div>
  </div>
</div>

<div class="analogy-card">
  <div class="analogy-header">
    <strong>ไทม์ไลน์การซักผ้าแบบไปป์ไลน์:</strong>
  </div>
  <div class="analogy-content">
    <ul>
      <li><strong>นาที 0-30:</strong> ซักถังที่ 1 (เครื่องตากและพับว่าง)</li>
      <li><strong>นาที 30-60:</strong> ย้ายถัง 1 ไปตาก, เริ่มซักถังที่ 2</li>
      <li><strong>นาที 60-90:</strong> ย้ายถัง 1 ไปพับ, ย้ายถัง 2 ไปตาก, เริ่มซักถังที่ 3</li>
      <li><strong>นาที 90:</strong> ถังที่ 1 เสร็จสมบูรณ์ (ใช้เวลา 90 นาที)</li>
      <li><strong>นาที 120:</strong> ถังที่ 2 เสร็จสมบูรณ์ (เสร็จตามมาในอีก 30 นาที)</li>
      <li><strong>นาที 150:</strong> ถังที่ 3 เสร็จสมบูรณ์ (เสร็จตามมาในอีก 30 นาที)</li>
    </ul>
    <p style="margin-top: 10px; font-weight: 600;">สรุปกฎทอง: ไปป์ไลน์ช่วยเพิ่ม Throughput (ปริมาณงานต่อหน่วยเวลา) ให้สูงขึ้นอย่างมหาศาล แม้ว่า Latency (ระยะเวลาประมวลผลของแต่ละชิ้นงาน) จะเท่าเดิม</p>
  </div>
</div>

---

### การเปรียบเทียบเชิงเวลาใน CPU (CPU Clock Cycle Comparison)
ในโปรเซสเซอร์ การประมวลผลคำสั่งแบ่งออกเป็น 5 สเตจ ได้แก่:
1. **IF (Instruction Fetch):** ดึงคำสั่งจากหน่วยความจำ
2. **ID (Instruction Decode):** ถอดรหัสคำสั่งและเตรียมข้อมูล
3. **EX (Execute):** ประมวลผลคำสั่งด้วย ALU
4. **MEM (Memory Access):** เข้าถึงหน่วยความจำ
5. **WB (Write Back):** เขียนผลลัพธ์กลับไปยังรีจิสเตอร์

#### ตารางที่ 8-1: ลำดับการประมวลผลแบบไม่ใช้ไปป์ไลน์ (Sequential Execution)
<div class="table-responsive">
  <table class="modern-table">
    <thead>
      <tr>
        <th>คำสั่ง</th>
        <th class="cell-center">Clock Cycle 1</th>
        <th class="cell-center">Clock Cycle 2</th>
        <th class="cell-center">Clock Cycle 3</th>
        <th class="cell-center">Clock Cycle 4</th>
        <th class="cell-center">Clock Cycle 5</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="cell-highlight">คำสั่งที่ 1</td>
        <td class="cell-center"><span class="stage-badge if">IF</span></td>
        <td class="cell-center"><span class="stage-badge id">ID</span></td>
        <td class="cell-center"><span class="stage-badge ex">EX</span></td>
        <td class="cell-center"><span class="stage-badge mem">MEM</span></td>
        <td class="cell-center"><span class="stage-badge wb">WB</span></td>
      </tr>
      <tr>
        <td class="cell-highlight">คำสั่งที่ 2</td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
      </tr>
    </tbody>
  </table>
</div>
<p style="font-size: 13.5px; color: var(--text-muted);">* คำสั่งที่ 2 ต้องรอจนถึง Clock Cycle ที่ 6 จึงจะสามารถเริ่มต้น IF ได้ ทำให้ 3 คำสั่งต้องใช้เวลารวมถึง 15 รอบสัญญาณนาฬิกา</p>

#### ตารางที่ 8-2: ลำดับการประมวลผลแบบใช้ไปป์ไลน์ (Pipeline Execution)
<div class="table-responsive">
  <table class="modern-table">
    <thead>
      <tr>
        <th>คำสั่ง</th>
        <th class="cell-center">Cycle 1</th>
        <th class="cell-center">Cycle 2</th>
        <th class="cell-center">Cycle 3</th>
        <th class="cell-center">Cycle 4</th>
        <th class="cell-center">Cycle 5</th>
        <th class="cell-center">Cycle 6</th>
        <th class="cell-center">Cycle 7</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="cell-highlight">คำสั่งที่ 1</td>
        <td class="cell-center"><span class="stage-badge if">IF</span></td>
        <td class="cell-center"><span class="stage-badge id">ID</span></td>
        <td class="cell-center"><span class="stage-badge ex">EX</span></td>
        <td class="cell-center"><span class="stage-badge mem">MEM</span></td>
        <td class="cell-center"><span class="stage-badge wb">WB</span></td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
      </tr>
      <tr>
        <td class="cell-highlight">คำสั่งที่ 2</td>
        <td class="cell-center">-</td>
        <td class="cell-center"><span class="stage-badge if">IF</span></td>
        <td class="cell-center"><span class="stage-badge id">ID</span></td>
        <td class="cell-center"><span class="stage-badge ex">EX</span></td>
        <td class="cell-center"><span class="stage-badge mem">MEM</span></td>
        <td class="cell-center"><span class="stage-badge wb">WB</span></td>
        <td class="cell-center">-</td>
      </tr>
      <tr>
        <td class="cell-highlight">คำสั่งที่ 3</td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
        <td class="cell-center"><span class="stage-badge if">IF</span></td>
        <td class="cell-center"><span class="stage-badge id">ID</span></td>
        <td class="cell-center"><span class="stage-badge ex">EX</span></td>
        <td class="cell-center"><span class="stage-badge mem">MEM</span></td>
        <td class="cell-center"><span class="stage-badge wb">WB</span></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="callout callout-success">
  <strong>จุดสังเกตสำคัญ:</strong>
  <ul style="margin: 6px 0 0 16px;">
    <li>ใน <strong>Clock Cycle ที่ 3</strong> มี 3 คำสั่งกำลังทำงานพร้อมกันในคนละสเตจ (คำสั่ง 1 ใน EX, คำสั่ง 2 ใน ID, คำสั่ง 3 ใน IF)</li>
    <li>ใน <strong>Clock Cycle ที่ 5</strong> ไปป์ไลน์เต็มสเตจ (Full Pipeline) คำสั่งที่ 1 เสร็จสิ้นในสเตจ WB และคำสั่งถัดไปจะเสร็จต่อเนื่องกันทุกๆ 1 รอบสัญญาณนาฬิกา!</li>
  </ul>
</div>
"""
  },
  {
    "id": "module-2",
    "moduleNumber": "02",
    "title": "2. การเปรียบเทียบสถาปัตยกรรม CPU: Single-Cycle vs. Pipeline",
    "pageRef": "หน้าที่ 6-7",
    "summary": "เจาะลึกเปรียบเทียบระหว่าง Single-cycle CPU และ Pipeline CPU ทั้งในด้านหลักการทำงาน ข้อดี ข้อเสีย ความซับซ้อนของวงจรฮาร์ดแวร์ การเกิดความเสี่ยง (Hazards) และอัตราการประมวลผลคำสั่ง",
    "objectives": [
      "ข้อ 1: อธิบายหลักการทำงานของ CPU แบบไม่ใช้ไปป์ไลน์ (Single-cycle) ได้",
      "ข้อ 2: อธิบายหลักการทำงานของ CPU แบบไปป์ไลน์ (Pipeline) ได้"
    ],
    "content": """
### ภาพรวมของ 2 สถาปัตยกรรมการประมวลผล
การทำงานของหน่วยประมวลผลกลาง (CPU) สามารถแบ่งออกเป็น 2 รูปแบบหลักตามวิธีการประมวลผลคำสั่ง:
1. **CPU แบบไม่ใช้ไปป์ไลน์ (Single-cycle CPU)**
2. **CPU แบบใช้ไปป์ไลน์ (Pipeline CPU)**

---

### 1. CPU แบบไม่ใช้ไปป์ไลน์ (Single-cycle CPU)
- **หลักการทำงาน:** CPU แบบ Single-cycle จะประมวลผล **หนึ่งคำสั่งให้เสร็จสมบูรณ์ครบทุกสเตจภายในหนึ่งรอบสัญญาณนาฬิกา (One Clock Cycle)** หมายความว่าทุกขั้นตอนของวัฏจักรคำสั่ง (Fetch, Decode, Execute, Memory, Write Back) จะต้องเริ่มต้นและจบลงภายในรอบสัญญาณนาฬิกาเดียวกัน ก่อนที่จะเริ่มต้นคำสั่งถัดไป
- **ข้อดี:**
  - **ออกแบบง่าย (Simple Design):** โครงสร้างไม่ซับซ้อน เข้าใจง่ายและสร้างวงจรควบคุมได้ง่าย
  - **ไม่มีปัญหา Hazard (Hazard-free):** เนื่องจากคำสั่งเก่าทำงานเสร็จสมบูรณ์ 100% ก่อนเริ่มคำสั่งใหม่ จึงไม่มีปัญหาเรื่องข้อมูลขัดแย้ง (Data Hazard), ทรัพยากรชนกัน (Structural Hazard) หรือการกระโดดผิด (Control Hazard)
- **ข้อเสีย:**
  - **ความเร็วต่ำ (Slow Clock Speed):** ความยาวของรอบสัญญาณนาฬิกา (Clock Period) จะถูกกำหนดโดย **ขั้นตอนที่ทำงานช้าที่สุด (Critical Path)** เช่น การเข้าถึงหน่วยความจำ (Memory Access) ส่งผลให้ขั้นตอนที่ทำงานเร็วต้องรอ ทำให้รอบสัญญาณนาฬิกายาวนานมากและ CPU มีความถี่ต่ำ
  - **ประสิทธิภาพต่ำ (Low Throughput):** สามารถประมวลผลได้เพียง 1 คำสั่งต่อ 1 รอบสัญญาณนาฬิกาที่ยาวนาน

---

### 2. CPU แบบใช้ไปป์ไลน์ (Pipeline CPU)
- **หลักการทำงาน:** CPU แบบไปป์ไลน์จะแบ่งวัฏจักรคำสั่งออกเป็น **หลายสเตจ (Stages)** และให้แต่ละสเตจทำงานพร้อมกันแบบคาบเกี่ยว (Overlapped Execution) คล้ายกับสายพานการผลิต แต่ละสเตจรับผิดชอบหน้าที่ของตนเองและส่งงานต่อไปยังสเตจถัดไปผ่านบัฟเฟอร์กั้น
- **ข้อดี:**
  - **ความเร็วสัญญาณนาฬิกาสูง (High Clock Frequency):** เนื่องจากแต่ละสเตจมีขนาดงานเล็ก ทำให้ระยะเวลาของแต่ละรอบสัญญาณนาฬิกาสั้นลงอย่างมาก CPU จึงทำงานที่ความถี่สูงได้
  - **ปริมาณงานสูง (High Throughput):** เมื่อไปป์ไลน์ทำงานเต็มที่ จะสามารถปล่อยคำสั่งที่ประมวลผลเสร็จสิ้นออกมาได้เกือบทุก Clock Cycle
- **ข้อเสีย:**
  - **โครงสร้างซับซ้อน (Hardware Complexity):** จำเป็นต้องมีรีจิสเตอร์คั่นระหว่างสเตจ (Pipeline Registers / Latches) และมีวงจรควบคุม (Hazard Detection & Forwarding Logic) ที่ซับซ้อน
  - **เกิดปัญหา Hazards:** ต้องมีกลไกป้องกันและแก้ไขข้อขัดแย้งระหว่างคำสั่ง

---

### การเปรียบเทียบด้วยอุปมาอุปไมย: คนล้างจาน
<div class="comparison-grid">
  <div class="comparison-card left-side">
    <div class="comparison-header">
      <div class="comparison-title">คนล้างจาน 1 คน (Single-Cycle CPU)</div>
      <div class="comparison-subtitle">ทำงานคนเดียวทุกขั้นตอนทีละใบ</div>
    </div>
    <div class="comparison-body">
      <div class="comparison-item">
        <span class="comparison-item-bullet">🍽️</span>
        <span><strong>จานใบที่ 1:</strong> ล้าง -> เช็ด -> เก็บเข้าตู้จนเสร็จเรียบร้อย</span>
      </div>
      <div class="comparison-item">
        <span class="comparison-item-bullet">🍽️</span>
        <span><strong>จานใบที่ 2:</strong> จึงค่อยเริ่มต้นหยิบมาล้างใหม่ตั้งแต่ต้น</span>
      </div>
      <div class="comparison-item">
        <span class="comparison-item-bullet">⚠️</span>
        <span>ไม่มีการแย่งจานกัน แต่ล้างจานกองโตได้ช้ามาก</span>
      </div>
    </div>
  </div>

  <div class="comparison-card right-side">
    <div class="comparison-header">
      <div class="comparison-title">คนล้างจาน 3 คน (Pipeline CPU)</div>
      <div class="comparison-subtitle">แบ่งหน้าที่เป็นสายพานส่งต่องาน</div>
    </div>
    <div class="comparison-body">
      <div class="comparison-item">
        <span class="comparison-item-bullet">1️⃣</span>
        <span><strong>คนที่ 1:</strong> ทำหน้าที่ล้างจานอย่างเดียว</span>
      </div>
      <div class="comparison-item">
        <span class="comparison-item-bullet">2️⃣</span>
        <span><strong>คนที่ 2:</strong> ทำหน้าที่เช็ดจานที่ส่งมาจากคนที่ 1</span>
      </div>
      <div class="comparison-item">
        <span class="comparison-item-bullet">3️⃣</span>
        <span><strong>คนที่ 3:</strong> ทำหน้าที่เก็บจานที่เช็ดแล้วเข้าตู้</span>
      </div>
      <div class="comparison-item">
        <span class="comparison-item-bullet">⚡</span>
        <span>จานใบใหม่จะถูกเก็บเข้าตู้เสร็จต่อเนื่องทุกๆ ใบอย่างรวดเร็ว</span>
      </div>
    </div>
  </div>
</div>

---

### ตารางที่ 8-3: สรุปเปรียบเทียบคุณสมบัติ Single-cycle CPU vs. Pipeline CPU
<div class="table-responsive">
  <table class="modern-table">
    <thead>
      <tr>
        <th>คุณสมบัติ (Attributes)</th>
        <th class="cell-center">Single-cycle CPU</th>
        <th class="cell-center">Pipeline CPU</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>จำนวนคำสั่งต่อรอบ (Instructions/Cycle)</strong></td>
        <td class="cell-center">1 คำสั่ง</td>
        <td class="cell-center cell-highlight">1 คำสั่ง (ในทางทฤษฎีเมื่อเต็มไปป์ไลน์)</td>
      </tr>
      <tr>
        <td><strong>จำนวนคำสั่งที่ทำงานพร้อมกัน (Active Instructions)</strong></td>
        <td class="cell-center">1 คำสั่งเท่านั้น</td>
        <td class="cell-center cell-highlight">มากกว่า 1 คำสั่ง (ตามจำนวนสเตจ)</td>
      </tr>
      <tr>
        <td><strong>ประสิทธิภาพโดยรวม (Overall Throughput)</strong></td>
        <td class="cell-center" style="color: var(--rose-danger); font-weight: 600;">ต่ำ (Low)</td>
        <td class="cell-center cell-highlight" style="color: var(--emerald-success); font-weight: 700;">สูงมาก (High)</td>
      </tr>
      <tr>
        <td><strong>ความซับซ้อนของฮาร์ดแวร์ (Hardware Complexity)</strong></td>
        <td class="cell-center">ต่ำ (สร้างง่าย ไม่ซับซ้อน)</td>
        <td class="cell-center">สูง (ต้องมีบัฟเฟอร์และวงจรตรวจจับ)</td>
      </tr>
      <tr>
        <td><strong>ปัญหาความเสี่ยง (Pipeline Hazards)</strong></td>
        <td class="cell-center" style="color: var(--emerald-success); font-weight: 600;">ไม่มี Hazard (Hazard-free)</td>
        <td class="cell-center" style="color: var(--amber-warning); font-weight: 600;">มี Hazard (ต้องจัดการแก้ไข)</td>
      </tr>
    </tbody>
  </table>
</div>
"""
  },
  {
    "id": "module-3",
    "moduleNumber": "03",
    "title": "3. ลำดับขั้นตอนไปป์ไลน์ 5 สเตจของสถาปัตยกรรม MIPS / RISC (5-Stage Pipeline)",
    "pageRef": "หน้าที่ 8-10",
    "summary": "ความหมายของ MIPS (Microprocessor without Interlocked Pipeline Stages) และ RISC (Reduced Instruction Set Computing), 5 สเตจมาตรฐาน (IF, ID, EX, MEM, WB), ฮาร์ดแวร์ประจำสเตจ, และไทม์ไลน์ 7 Clock Cycles ของ 3 คำสั่ง",
    "objectives": [
      "ข้อ 3: อธิบายลำดับขั้นตอนการทำงานของไปป์ไลน์ของสถาปัตยกรรม MIPS ได้",
      "ข้อ 4: อธิบายลำดับขั้นตอนการทำงานของไปป์ไลน์ของสถาปัตยกรรม RISC ได้"
    ],
    "content": """
### ความหมายของสถาปัตยกรรม MIPS และ RISC
- **RISC (Reduced Instruction Set Computing):** แนวคิดการออกแบบ CPU ที่ใช้ชุดคำสั่งขนาดกะทัดรัด รูปแบบคำสั่งคงที่ สม่ำเสมอ ทำให้ง่ายต่อการออกแบบไปป์ไลน์
- **MIPS (Microprocessor without Interlocked Pipeline Stages):** สถาปัตยกรรมแบบ RISC ยอดนิยมที่พัฒนาขึ้นสำหรับการศึกษาและโปรเซสเซอร์เชิงพาณิชย์ โดยแบ่งการทำงานของคำสั่งออกเป็น **5 ขั้นตอนหลัก (Classic 5-Stage Pipeline)** อย่างเป็นอิสระต่อกัน

---

### เจาะลึกขั้นตอนหลักของไปป์ไลน์ 5 สเตจ (5-Stage Architecture)

<div class="process-flow-container">
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-number-badge">สเตจ 1</span>
      <span class="stage-badge if">IF</span>
    </div>
    <div class="step-card-title">Instruction Fetch (ดึงคำสั่ง)</div>
    <div class="step-card-desc">
      <strong>หน้าที่:</strong> ดึงคำสั่งจากหน่วยความจำคำสั่ง (Instruction Memory) ตามตำแหน่งที่ Program Counter (PC) ชี้อยู่<br>
      <strong>การทำงาน:</strong> นำคำสั่งมาเก็บในบัฟเฟอร์ IF/ID และคำนวณเพิ่มค่า PC (PC = PC + 4) เพื่อเตรียมดึงคำสั่งถัดไปในรอบถัดไป
    </div>
    <div class="step-card-detail">ฮาร์ดแวร์หลัก: Instruction Memory, PC Adder, IF/ID Latch</div>
  </div>

  <div class="step-card">
    <div class="step-card-header">
      <span class="step-number-badge">สเตจ 2</span>
      <span class="stage-badge id">ID</span>
    </div>
    <div class="step-card-title">Instruction Decode (ถอดรหัสคำสั่ง)</div>
    <div class="step-card-desc">
      <strong>หน้าที่:</strong> ถอดรหัสคำสั่งเพื่อระบุ OpCode และอ่านข้อมูลตัวถูกดำเนินการจาก Register File<br>
      <strong>การทำงาน:</strong> แยกฟิลด์เพื่อระบุคำสั่ง (เช่น บวก, ลบ, โหลด) และอ่านค่าข้อมูลจากรีจิสเตอร์ต้นทาง (Source Registers: Rs, Rt) เตรียมส่งต่อ
    </div>
    <div class="step-card-detail">ฮาร์ดแวร์หลัก: Control Unit, Register File, Sign-Extend Unit, ID/EX Latch</div>
  </div>

  <div class="step-card">
    <div class="step-card-header">
      <span class="step-number-badge">สเตจ 3</span>
      <span class="stage-badge ex">EX</span>
    </div>
    <div class="step-card-title">Execute (ประมวลผลคำสั่ง)</div>
    <div class="step-card-desc">
      <strong>หน้าที่:</strong> คำนวณทางคณิตศาสตร์/ตรรกะ หรือคำนวณที่อยู่หน่วยความจำด้วย ALU<br>
      <strong>การทำงาน:</strong> หากเป็นคำสั่ง ADD/SUB ALU จะคำนวณค่าผลลัพธ์, หากเป็นคำสั่ง LOAD/STORE ALU จะคำนวณ Effective Address (ที่อยู่จริงใน RAM), หากเป็นคำสั่ง Branch จะตรวจสอบเงื่อนไข
    </div>
    <div class="step-card-detail">ฮาร์ดแวร์หลัก: ALU (Arithmetic Logic Unit), Branch Adder, EX/MEM Latch</div>
  </div>

  <div class="step-card">
    <div class="step-card-header">
      <span class="step-number-badge">สเตจ 4</span>
      <span class="stage-badge mem">MEM</span>
    </div>
    <div class="step-card-title">Memory Access (เข้าถึงหน่วยความจำ)</div>
    <div class="step-card-desc">
      <strong>หน้าที่:</strong> เข้าถึงหน่วยความจำข้อมูล (Data Memory) เพื่ออ่านหรือบันทึกข้อมูล<br>
      <strong>การทำงาน:</strong> หากเป็นคำสั่ง LOAD จะอ่านข้อมูลจากแอดเดรสที่คำนวณได้ในสเตจ EX, หากเป็นคำสั่ง STORE จะเขียนข้อมูลลงแอดเดรสที่ระบุ, หากเป็นคำสั่งคำนวณทั่วไปจะส่งผ่านข้อมูลไปเฉยๆ
    </div>
    <div class="step-card-detail">ฮาร์ดแวร์หลัก: Data Memory, MEM/WB Latch</div>
  </div>

  <div class="step-card">
    <div class="step-card-header">
      <span class="step-number-badge">สเตจ 5</span>
      <span class="stage-badge wb">WB</span>
    </div>
    <div class="step-card-title">Write Back (เขียนผลลัพธ์กลับ)</div>
    <div class="step-card-desc">
      <strong>หน้าที่:</strong> นำผลลัพธ์สุดท้ายเขียนบันทึกลงใน Register File<br>
      <strong>การทำงาน:</strong> ค่าที่ได้จากการคำนวณของ ALU (ในสเตจ EX) หรือค่าที่อ่านได้จาก RAM (ในสเตจ MEM) จะถูกเขียนกลับไปยังรีจิสเตอร์ปลายทาง (Destination Register: Rd) เพื่อให้คำสั่งถัดไปนำไปใช้งานต่อได้
    </div>
    <div class="step-card-detail">ฮาร์ดแวร์หลัก: Multiplexer, Register File Write Port</div>
  </div>
</div>

---

### ตารางที่ 8-4: ขั้นตอนไทม์ไลน์การทำงานของ 3 คำสั่งในไปป์ไลน์ 5 สเตจ
พิจารณาการประมวลผลคำสั่ง 3 คำสั่งอิสระผ่าน 7 รอบสัญญาณนาฬิกา:

<div class="table-responsive">
  <table class="modern-table">
    <thead>
      <tr>
        <th class="cell-center">รอบนาฬิกา</th>
        <th class="cell-center">สเตจ IF (ดึง)</th>
        <th class="cell-center">สเตจ ID (ถอด)</th>
        <th class="cell-center">สเตจ EX (คำนวณ)</th>
        <th class="cell-center">สเตจ MEM (แรม)</th>
        <th class="cell-center">สเตจ WB (เขียน)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="cell-center"><strong>รอบที่ 1</strong></td>
        <td class="cell-center"><span class="stage-badge if">คำสั่ง 1</span></td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
      </tr>
      <tr>
        <td class="cell-center"><strong>รอบที่ 2</strong></td>
        <td class="cell-center"><span class="stage-badge if">คำสั่ง 2</span></td>
        <td class="cell-center"><span class="stage-badge id">คำสั่ง 1</span></td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
      </tr>
      <tr style="background: #f0fdf4;">
        <td class="cell-center"><strong>รอบที่ 3</strong></td>
        <td class="cell-center"><span class="stage-badge if">คำสั่ง 3</span></td>
        <td class="cell-center"><span class="stage-badge id">คำสั่ง 2</span></td>
        <td class="cell-center"><span class="stage-badge ex">คำสั่ง 1</span></td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
      </tr>
      <tr>
        <td class="cell-center"><strong>รอบที่ 4</strong></td>
        <td class="cell-center">-</td>
        <td class="cell-center"><span class="stage-badge id">คำสั่ง 3</span></td>
        <td class="cell-center"><span class="stage-badge ex">คำสั่ง 2</span></td>
        <td class="cell-center"><span class="stage-badge mem">คำสั่ง 1</span></td>
        <td class="cell-center">-</td>
      </tr>
      <tr style="background: #fdf4ff;">
        <td class="cell-center"><strong>รอบที่ 5</strong></td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
        <td class="cell-center"><span class="stage-badge ex">คำสั่ง 3</span></td>
        <td class="cell-center"><span class="stage-badge mem">คำสั่ง 2</span></td>
        <td class="cell-center"><span class="stage-badge wb">คำสั่ง 1</span></td>
      </tr>
      <tr>
        <td class="cell-center"><strong>รอบที่ 6</strong></td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
        <td class="cell-center"><span class="stage-badge mem">คำสั่ง 3</span></td>
        <td class="cell-center"><span class="stage-badge wb">คำสั่ง 2</span></td>
      </tr>
      <tr>
        <td class="cell-center"><strong>รอบที่ 7</strong></td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
        <td class="cell-center">-</td>
        <td class="cell-center"><span class="stage-badge wb">คำสั่ง 3</span></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="callout callout-info">
  <strong>บทวิเคราะห์จากตารางไทม์ไลน์:</strong>
  <ul style="margin: 6px 0 0 16px;">
    <li>ใน <strong>รอบที่ 3:</strong> CPU กำลังประมวลผล 3 คำสั่งพร้อมกันใน 3 สเตจที่ต่างกันอย่างอิสระ</li>
    <li>ใน <strong>รอบที่ 5:</strong> คำสั่งที่ 1 ประมวลผลเสร็จสมบูรณ์ในสเตจ Write Back (ใช้เวลา 5 รอบสัญญาณนาฬิกาเต็ม)</li>
    <li>ใน <strong>รอบที่ 6 และ 7:</strong> คำสั่งที่ 2 และ 3 ทยอยเสร็จสิ้นตามมาในทุกๆ 1 รอบสัญญาณนาฬิกาหลังจากนั้น!</li>
  </ul>
</div>
"""
  },
  {
    "id": "module-4",
    "moduleNumber": "04",
    "title": "4. รูปแบบการทำงาน: ไปป์ไลน์แบบเป็นลำดับและไม่เป็นลำดับ (Linear vs. Non-linear Pipeline)",
    "pageRef": "หน้าที่ 10-11",
    "summary": "การจำแนกรูปแบบการไหลของข้อมูลในไปป์ไลน์: Linear Pipeline (ทิศทางเดียว ไม่ย้อนกลับ นิยมใน General Purpose CPU) และ Non-linear Pipeline (มี Feedback Loop และหลายเส้นทาง นิยมในงาน DSP และการประมวลผลมัลติมีเดีย)",
    "objectives": [
      "ข้อ 5: อธิบายการทำงานไปป์ไลน์แบบเป็นลำดับ (Linear Pipeline) ได้",
      "ข้อ 6: อธิบายการทำงานไปป์ไลน์แบบไม่เป็นลำดับ (Non-linear Pipeline) ได้"
    ],
    "content": """
### การจำแนกประเภทไปป์ไลน์ตามทิศทางการไหลของข้อมูล
ในการออกแบบสถาปัตยกรรมไปป์ไลน์ รูปแบบการเชื่อมต่อระหว่างสเตจสามารถจำแนกออกได้เป็น 2 ลักษณะสำคัญ:
1. **ไปป์ไลน์แบบเป็นลำดับ (Linear Pipeline)**
2. **ไปป์ไลน์แบบไม่เป็นลำดับ (Non-linear Pipeline)**

---

### 1. ไปป์ไลน์แบบเป็นลำดับ (Linear Pipeline)
- **แนวคิดหลัก:** เป็นไปป์ไลน์ที่มี **การไหลของข้อมูลในทิศทางเดียว (One-way Feed-forward)** โดยที่ผลลัพธ์จากสเตจหนึ่งจะถูกส่งต่อไปยังสเตจถัดไปตามลำดับเท่านั้น **ไม่มีการทำงานย้อนกลับ (No Feedback)** และ **ไม่มีการข้ามขั้นตอน (No Bypass/Skip)**
- **ลักษณะสำคัญ:**
  - สเตจแต่ละสเตจมีหน้าที่เฉพาะเจาะจงที่คงที่
  - คำสั่งจะถูกป้อนเข้าสู่สเตจแรก (Input Stage) ไหลผ่านไปเรื่อยๆ จนถึงสเตจสุดท้าย (Output Stage)
  - มีโครงสร้างที่เรียบง่าย จัดการสัญญาณควบคุมและตรวจจับความขัดแย้งได้ง่าย
  - เป็นรูปแบบมาตรฐานที่นิยมใช้ในโปรเซสเซอร์คอมพิวเตอร์ทั่วไป (General-Purpose CPU) เช่น สถาปัตยกรรม MIPS, RISC-V, ARM
- **ตัวอย่างเปรียบเทียบ:** โรงงานประกอบรถยนต์:
  `สถานี 1 (ประกอบโครง) -> สถานี 2 (ติดตั้งเครื่องยนต์) -> สถานี 3 (ทำสี) -> สถานี 4 (ติดตั้งภายใน)`
  รถทุกคันจะไหลตรงไปตามลำดับโดยไม่มีการส่งรถย้อนกลับไปยังสถานีเดิม

---

### 2. ไปป์ไลน์แบบไม่เป็นลำดับ (Non-linear Pipeline)
- **แนวคิดหลัก:** เป็นไปป์ไลน์ที่มีความยืดหยุ่นและซับซ้อนสูง โดย **อนุญาตให้มีวงจรย้อนกลับ (Feedback Loops)** หรือ **เส้นทางข้ามสเตจ (Feed-forward Loops)** ทำให้ผลลัพธ์บางส่วนสามารถถูกส่งกลับมาประมวลผลซ้ำในสเตจก่อนหน้า หรือข้ามสเตจที่ไม่จำเป็นได้
- **ลักษณะสำคัญ:**
  - มีการเชื่อมต่อแบบหลายเส้นทาง (Multiple Interconnection Paths) ระหว่างสเตจ
  - สเตจหนึ่งๆ อาจถูกเรียกใช้งานซ้ำหลายครั้งสำหรับคำสั่งเดียวกัน
  - ต้องใช้วงจรควบคุมการจองทรัพยากรที่ซับซ้อน (Reservation Tables & State Transition Latency Cycles) เพื่อป้องกันการชนกันของข้อมูล (Collision)
  - เหมาะสำหรับสถาปัตยกรรมเฉพาะทางที่ต้องมีการคำนวณวนซ้ำ (Iterative Computations) เช่น **หน่วยประมวลผลสัญญาณดิจิทัล (Digital Signal Processor - DSP)** และสถาปัตยกรรมมัลติมีเดีย
- **ตัวอย่างการประยุกต์ใช้งานจริง:**
  - **การประมวลผลสัญญาณเสียง (Audio DSP Filtering):** การกรองสัญญาณเสียงที่ต้องนำสัญญาณเอาต์พุตบางส่วนวนกลับมาเป็นอินพุตเพื่อปรับแต่งลดเสียงรบกวน (Feedback Loop)
  - **การประมวลผลภาพแบบปรับตัว (Adaptive Image Processing):** ภาพถูกส่งไปประมวลผลหาขอบภาพ (Edge Detection) จากนั้นผลลัพธ์จะถูกส่งย้อนกลับไปให้สเตจแรกเพื่อปรับความคมชัดของภาพส่วนอื่นๆ ซ้ำอีกครั้ง

---

### ตารางเปรียบเทียบ Linear Pipeline vs. Non-linear Pipeline
<div class="table-responsive">
  <table class="modern-table">
    <thead>
      <tr>
        <th>ประเด็นเปรียบเทียบ</th>
        <th>ไปป์ไลน์แบบเป็นลำดับ (Linear)</th>
        <th>ไปป์ไลน์แบบไม่เป็นลำดับ (Non-linear)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>ทิศทางการไหลของข้อมูล</strong></td>
        <td>ทิศทางเดียว (One-way Feed-forward)</td>
        <td>หลายทิศทาง มีวงจรย้อนกลับ (Feedback Loops)</td>
      </tr>
      <tr>
        <td><strong>การประมวลผลซ้ำในสเตจเดิม</strong></td>
        <td>ไม่สามารถทำได้ (No Iteration)</td>
        <td>ทำได้ คำสั่งเดิมสามารถเข้าสเตจเดิมซ้ำได้</td>
      </tr>
      <tr>
        <td><strong>ความซับซ้อนของวงจรควบคุม</strong></td>
        <td>ต่ำ เรียบง่าย จัดการง่าย</td>
        <td>สูงมาก ต้องใช้ Reservation Table ป้องกัน Collision</td>
      </tr>
      <tr>
        <td><strong>ขอบเขตการใช้งาน</strong></td>
        <td>ซีพียูทั่วไป (MIPS, ARM, x86 General Cores)</td>
        <td>ชิปประมวลผลสัญญาณดิจิทัล (DSP, Adaptive Filters)</td>
      </tr>
    </tbody>
  </table>
</div>
"""
  },
  {
    "id": "module-5",
    "moduleNumber": "05",
    "title": "5. โครงสร้างและองค์ประกอบของไปป์ไลน์ (Pipeline Architecture)",
    "pageRef": "หน้าที่ 12-13",
    "summary": "2 องค์ประกอบทางกายภาพที่สำคัญที่สุด: สเตจ (Stages/Segments) และ บัฟเฟอร์ระหว่างสเตจ (Inter-stage Buffers / Pipeline Registers หรือ Latches) และ 3 บทบาทสำคัญของบัฟเฟอร์",
    "objectives": [
      "ข้อ 7: อธิบายการทำงานโครงสร้างของไปป์ไลน์ (Pipeline Architecture) ได้อย่างถูกต้อง"
    ],
    "content": """
### องค์ประกอบหลัก 2 ส่วนของโครงสร้างไปป์ไลน์
ในทางสถาปัตยกรรมคอมพิวเตอร์ โครงสร้างไปป์ไลน์ประกอบด้วย 2 ส่วนประกอบหลักที่ทำงานควบคู่กัน:
1. **สเตจ (Stage หรือ Segment):** สถานีงานย่อยที่ทำหน้าที่ประมวลผลคำสั่งในส่วนของตัวเอง
2. **บัฟเฟอร์ (Buffer) หรือ แลตช์ (Latch) / Pipeline Registers:** รีจิสเตอร์เก็บข้อมูลชั่วคราวที่คั่นอยู่ระหว่างแต่ละสเตจ

---

### 1. สเตจ (Stage / Segment)
สเตจคือหน่วยประมวลผลย่อย แต่ละสเตจประกอบด้วยวงจรเชิงผสม (Combinational Logic) ที่ทำหน้าที่เฉพาะอย่าง เช่น วงจรดึงคำสั่ง, วงจรถอดรหัส, ALU สำหรับคำนวณ หรือหน่วยความจำข้อมูล
- ในสถาปัตยกรรมมาตรฐาน 5 สเตจ ได้แก่: **IF -> ID -> EX -> MEM -> WB**
- ในแต่ละรอบสัญญาณนาฬิกา แต่ละสเตจจะประมวลผลคำสั่งที่แตกต่างกันไป ส่งผลให้ CPU ทำงานได้หลายคำสั่งพร้อมกัน

---

### 2. บัฟเฟอร์ระหว่างสเตจ (Inter-stage Buffers / Pipeline Registers)
**Pipeline Registers** คือหน่วยความจำความเร็วสูงชั่วคราวที่ถูกวางคั่นกลางระหว่างสเตจที่อยู่ติดกัน:
- **IF/ID Register:** คั่นระหว่างสเตจ Fetch และ Decode
- **ID/EX Register:** คั่นระหว่างสเตจ Decode และ Execute
- **EX/MEM Register:** คั่นระหว่างสเตจ Execute และ Memory
- **MEM/WB Register:** คั่นระหว่างสเตจ Memory และ Write Back

<div class="callout callout-purple">
  <strong>แผนผังการไหลของข้อมูลผ่าน Pipeline Registers:</strong>
  <div style="font-family: var(--font-mono); font-size: 13.5px; margin-top: 8px; font-weight: 600; text-align: center; overflow-x: auto; white-space: nowrap;">
    [สเตจ IF] ──► (IF/ID Latch) ──► [สเตจ ID] ──► (ID/EX Latch) ──► [สเตจ EX] ──► (EX/MEM Latch) ──► [สเตจ MEM] ──► (MEM/WB Latch) ──► [สเตจ WB]
  </div>
</div>

---

### 3 บทบาทหน้าที่สำคัญที่สุดของ บัฟเฟอร์ (Pipeline Registers)

<div class="process-flow-container">
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-number-badge">หน้าที่ 1</span>
    </div>
    <div class="step-card-title">ป้องกันข้อมูลปนกัน (Isolation)</div>
    <div class="step-card-desc">ทำหน้าที่เป็น **"แนวกั้น"** ป้องกันไม่ให้ผลลัพธ์ที่เพิ่งประมวลผลเสร็จในสเตจก่อนหน้า ไหลทะลุเข้าไปเปลี่ยนแปลงข้อมูลในสเตจถัดไปก่อนเวลาที่ถูกต้อง หรือถูกเขียนทับโดยไม่ได้ตั้งใจ</div>
  </div>

  <div class="step-card">
    <div class="step-card-header">
      <span class="step-number-badge">หน้าที่ 2</span>
    </div>
    <div class="step-card-title">ส่งข้อมูลอย่างพร้อมเพรียง (Synchronization)</div>
    <div class="step-card-desc">ทำหน้าที่เป็นตัวประสานจังหวะการทำงานกับสัญญาณนาฬิกา (Clock Edge) เพื่อให้ข้อมูลจากทุกสเตจถูกส่งต่อไปยังสเตจถัดไปพร้อมๆ กันอย่างเป็นระเบียบในทุกรอบสัญญาณนาฬิกา</div>
  </div>

  <div class="step-card">
    <div class="step-card-header">
      <span class="step-number-badge">หน้าที่ 3</span>
    </div>
    <div class="step-card-title">เก็บสถานะและคำสั่ง (Holding State)</div>
    <div class="step-card-desc">ทำหน้าที่กักเก็บข้อมูลตัวถูกดำเนินการ (Operands), ค่าผลลัพธ์ชั่วคราว และ **สัญญาณควบคุม (Control Signals)** ของแต่ละคำสั่งไว้ขณะที่คำสั่งนั้นกำลังเคลื่อนตัวผ่านไปป์ไลน์</div>
  </div>
</div>

<div class="analogy-card">
  <div class="analogy-header">
    <strong>การเปรียบเทียบกับโรงงานประกอบรถยนต์:</strong>
  </div>
  <div class="analogy-content">
    <ul>
      <li><strong>สเตจ (Stages):</strong> เปรียบเสมือน <em>"สถานีงานประกอบแต่ละแห่ง"</em> เช่น แท่นพ่นสี แท่นติดตั้งเครื่องยนต์</li>
      <li><strong>บัฟเฟอร์ (Buffers):</strong> เปรียบเสมือน <em>"พื้นที่จอดพักรถชั่วคราวระหว่างสถานี"</em> รถที่ทำสีเสร็จจะถูกนำมาจอดพักไว้ที่นี่ เพื่อรอให้สถานีถัดไปว่าง จึงค่อยเคลื่อนตัวเข้าไปทำต่อ ทำให้สถานีพ่นสีสามารถรับรถคันใหม่เข้ามาทำสีได้ทันทีโดยไม่ต้องรอให้รถคันก่อนหน้าประกอบเสร็จทั้งคัน</li>
    </ul>
  </div>
</div>
"""
  },
  {
    "id": "module-6",
    "moduleNumber": "06",
    "title": "6. การเพิ่มประสิทธิภาพของไปป์ไลน์ (Pipeline Optimization)",
    "pageRef": "หน้าที่ 14-16",
    "summary": "2 ปัจจัยหลักในการเพิ่มประสิทธิภาพ: การเพิ่มจำนวนสเตจ (More Stages / Superpipelining) และการลดระยะเวลาของแต่ละสเตจ (Reducing Stage Time), ข้อดี ข้อจำกัด ผลต่อ Clock Speed, ความร้อน และการใช้พลังงาน",
    "objectives": [
      "ข้อ 8: อธิบายการเพิ่มประสิทธิภาพของไปป์ไลน์ (Pipeline Optimization) ได้อย่างถูกต้อง"
    ],
    "content": """
### 2 ปัจจัยหลักในการเร่งประสิทธิภาพของไปป์ไลน์
เพื่อเพิ่มประสิทธิภาพของระบบไปป์ไลน์ให้สามารถประมวลผลคำสั่งได้รวดเร็วขึ้น สามารถทำได้โดยการปรับปรุงปัจจัยหลัก 2 ประการ:
1. **การเพิ่มจำนวนสเตจ (More Stages หรือ Superpipelining)**
2. **การลดระยะเวลาของแต่ละสเตจ (Reducing Stage Time)**

---

### วิธีที่ 1: การเพิ่มจำนวนสเตจ (More Stages / Superpipelining)
- **แนวคิด:** แบ่งขั้นตอนการทำงานใหญ่ๆ ออกเป็นขั้นตอนย่อยๆ มากขึ้น เช่น ซอยแบ่งจาก 5 สเตจเป็น 10, 14 หรือ 20 สเตจ
- **ผลลัพธ์ทางเทคนิค:**
  - เมื่องานในแต่ละสเตจสั้นลง ระยะเวลาของรอบสัญญาณนาฬิกา (Clock Cycle Time) จะสั้นลงตาม
  - ส่งผลให้ **ความถี่ของ CPU (Clock Frequency)** พุ่งสูงขึ้นอย่างมาก (เช่น จากระดับร้อย MHz สู่ GHz)
  - เพิ่มอัตราการประมวลผลคำสั่งสำเร็จต่อหน่วยเวลา (**Throughput**) ได้อย่างมีนัยสำคัญ
- **ข้อดี:** Throughput เพิ่มขึ้นอย่างชัดเจน
- **ข้อจำกัด / ข้อเสีย:**
  - หากเพิ่มสเตจมากเกินไป โอกาสเกิด **Pipeline Hazards** จะเพิ่มสูงขึ้นเป็นเงาตามตัว
  - ค่าปรับเวลาหน่วงสะสมของบัฟเฟอร์ (Latch Overheads) จะเริ่มมีสัดส่วนสูงขึ้น
  - เมื่อเกิดการทำนายคำสั่งกระโดดผิดพลาด (Branch Misprediction) จะต้องล้างคำสั่งทิ้งเป็นจำนวนมาก ทำให้สูญเสียรอบนาฬิกาสูงขึ้น

#### ตัวอย่างเปรียบเทียบ: การล้างรถ (Car Wash Analogy)
<div class="comparison-grid">
  <div class="comparison-card left-side">
    <div class="comparison-header">
      <div class="comparison-title">ไปป์ไลน์แบบ 3 สเตจ</div>
      <div class="comparison-subtitle">ขั้นตอนละ 5 นาที (รวม 15 นาที)</div>
    </div>
    <div class="comparison-body">
      <div class="comparison-item">
        <span class="comparison-item-bullet">1.</span>
        <span>สเตจ 1: ล้างโฟม (5 นาที)</span>
      </div>
      <div class="comparison-item">
        <span class="comparison-item-bullet">2.</span>
        <span>สเตจ 2: ขัดเงา (5 นาที)</span>
      </div>
      <div class="comparison-item">
        <span class="comparison-item-bullet">3.</span>
        <span>สเตจ 3: เช็ดแห้ง (5 นาที)</span>
      </div>
      <div class="comparison-item">
        <span class="comparison-item-bullet">⏱️</span>
        <span><strong>Throughput:</strong> สามารถส่งมอบรถคันใหม่ออกจากร้านได้ทุกๆ <strong>5 นาที</strong></span>
      </div>
    </div>
  </div>

  <div class="comparison-card right-side">
    <div class="comparison-header">
      <div class="comparison-title">ไปป์ไลน์แบบ 5 สเตจ</div>
      <div class="comparison-subtitle">ซอยย่อยขั้นตอนละ 2 นาที (รวม 10 นาที)</div>
    </div>
    <div class="comparison-body">
      <div class="comparison-item">
        <span class="comparison-item-bullet">1.</span>
        <span>สเตจ 1: ฉีดน้ำ (2 นาที) | สเตจ 2: ล้างโฟม (2 นาที)</span>
      </div>
      <div class="comparison-item">
        <span class="comparison-item-bullet">2.</span>
        <span>สเตจ 3: ฉีดน้ำล้างโฟม (2 นาที) | สเตจ 4: ขัดเงา (2 นาที)</span>
      </div>
      <div class="comparison-item">
        <span class="comparison-item-bullet">3.</span>
        <span>สเตจ 5: เช็ดแห้ง (2 นาที)</span>
      </div>
      <div class="comparison-item">
        <span class="comparison-item-bullet">⚡</span>
        <span><strong>Throughput:</strong> สามารถส่งมอบรถคันใหม่ออกจากร้านได้ทุกๆ <strong>2 นาที</strong> (เร็วกว่า 2.5 เท่า!)</span>
      </div>
    </div>
  </div>
</div>

---

### วิธีที่ 2: การลดระยะเวลาของแต่ละสเตจ (Reducing Stage Time)
- **แนวคิด:** คงจำนวนสเตจไว้เท่าเดิม แต่ทำให้งานในแต่ละสเตจเสร็จเร็วขึ้น โดยการ **ปรับปรุงประสิทธิภาพของอุปกรณ์ฮาร์ดแวร์** ประจำสเตจนั้นๆ
- **การดำเนินการ:**
  - ในสเตจ Execute: ออกแบบวงจรบวกความเร็วสูง (Carry-Lookahead Adder) หรือตัวคูณแบบฮาร์ดแวร์ (Fast Hardware Multiplier)
  - ในสเตจ Memory: ใช้หน่วยความจำแคชความเร็วสูง (High-Speed L1 Cache) เพื่อลด Latency ในการอ่าน/เขียนข้อมูล
- **ข้อดี:** เพิ่มความเร็วของสัญญาณนาฬิกา (Clock Speed) ของ CPU ได้โดยตรงโดยไม่ต้องเพิ่มความซับซ้อนของจำนวนสเตจ
- **ข้อจำกัด / ข้อเสีย:**
  - วงจรฮาร์ดแวร์ความเร็วสูงมักมีต้นทุนการผลิตและพื้นที่บนชิป (Silicon Area) สูงขึ้น
  - ส่งผลให้เกิดการใช้พลังงาน (Power Consumption) และ **ความร้อนสะสม (Heat Dissipation)** พุ่งสูงขึ้น

#### ตัวอย่างเปรียบเทียบ: การคำนวณบัญชี (Calculator Analogy)
- **วิธีที่ 1:** ใช้เครื่องคิดเลขธรรมดา แต่ละขั้นตอนใช้เวลา 10 วินาที
- **วิธีที่ 2:** เปลี่ยนไปใช้เครื่องคิดเลขวิทยาศาสตร์ประสิทธิภาพสูง ทำให้แต่ละขั้นตอนเหลือเพียง 5 วินาที
- แม้จำนวนขั้นตอนจะเท่ากัน แต่เครื่องมือที่เร็วกว่าจะทำให้งานทั้งหมดเสร็จเร็วขึ้นได้ทันที

<div class="callout callout-info">
  <strong>บทสรุปเชิงสถาปัตยกรรม:</strong> ในทางปฏิบัติ โปรเซสเซอร์ยุคใหม่จะประยุกต์ใช้ <strong>ทั้งสองวิธีร่วมกัน</strong> โดยแบ่งสเตจให้มีขนาดพอเหมาะ (Balanced Stages) ควบคู่กับการใช้วงจรฮาร์ดแวร์ประสิทธิภาพสูง เพื่อให้ได้ความเร็วในการประมวลผลสูงสุดโดยไม่สร้างความร้อนเกินขีดจำกัด
</div>
"""
  },
  {
    "id": "module-7",
    "moduleNumber": "07",
    "title": "7. ปัญหาและความเสี่ยงในไปป์ไลน์ (Pipeline Hazards)",
    "pageRef": "หน้าที่ 16-19",
    "summary": "นิยามของ Pipeline Hazards (ความเสี่ยงที่ทำให้ไปป์ไลน์ต้องหยุดชะงัก หรือต้องล้างคำสั่งทิ้ง) และการเจาะลึก 3 รูปแบบหลัก: Data Hazard (RAW Dependency), Structural Hazard (Resource Conflict), Control Hazard (Branch & Jump Penalty)",
    "objectives": [
      "ข้อ 9: อธิบายปัญหาในการทำงานแบบไปป์ไลน์ (Pipeline Hazards) แบบข้อมูล (Data Hazard) ได้",
      "ข้อ 10: อธิบายปัญหาในการทำงานแบบไปป์ไลน์ (Pipeline Hazards) แบบโครงสร้าง (Structural Hazard) ได้",
      "ข้อ 11: อธิบายปัญหาในการทำงานแบบไปป์ไลน์ (Pipeline Hazards) แบบควบคุม (Control Hazard) ได้"
    ],
    "content": """
### ความหมายของปัญหาความเสี่ยงในไปป์ไลน์ (Pipeline Hazards)
**Pipeline Hazards (ความเสี่ยงในไปป์ไลน์)** คือ สภาวะหรือสถานการณ์ขัดแย้งที่เกิดขึ้นในไปป์ไลน์ ซึ่งส่งผลให้คำสั่งถัดไป **ไม่สามารถประมวลผลต่อในรอบสัญญาณนาฬิกาที่กำหนดได้** ทำให้ไปป์ไลน์ต้อง **"หยุดชะงัก (Stall)"** หรือต้อง **"ล้างคำสั่งที่ดึงมาล่วงหน้าทิ้งทั้งหมด (Flush the Pipeline)"** ส่งผลให้ประสิทธิภาพลดลงจากในอุดมคติ

ไปป์ไลน์ Hazards แบ่งออกเป็น 3 ประเภทหลักตามสาเหตุที่เกิดขึ้น:

---

### 1. Hazard แบบข้อมูล (Data Hazard)
- **สาเหตุ:** เกิดขึ้นเมื่อคำสั่งหนึ่งต้องการนำ **ข้อมูล (Data/Operand)** ที่เป็นผลลัพธ์ของคำสั่งก่อนหน้ามาใช้งาน แต่คำสั่งก่อนหน้ายังประมวลผลไม่เสร็จ หรือยังไม่ได้เขียนค่ากลับลงรีจิสเตอร์ (Data Dependency)
- **รูปแบบที่พบบ่อยที่สุด:** **RAW (Read After Write)** — คำสั่งถัดไปพยายามอ่านค่าจาก Register ก่อนที่คำสั่งก่อนหน้าจะเขียนค่าเสร็จ
- **อุปมาอุปไมยทำอาหาร:**
  - คำสั่ง 1: ทอดไข่เจียว
  - คำสั่ง 2: ทำข้าวผัดไข่
  - คุณจะเริ่มทำข้าวผัดไข่ไม่ได้เด็ดขาด ถ้าไข่เจียว (ข้อมูลที่ต้องใช้) ยังทอดไม่เสร็จ!
- **ตัวอย่างโค้ดคำสั่ง:**
  ```assembly
  ADD R1, R2, R3    # R1 = R2 + R3 (คำนวณเสร็จใน EX แต่เขียนลง R1 ในสเตจ WB)
  SUB R4, R1, R5    # ต้องการอ่านค่า R1 ในสเตจ ID
  ```
  คำสั่ง `SUB` ต้องการอ่านค่าจาก `R1` ในสเตจ Decode แต่คำสั่ง `ADD` จะเขียนค่าลง `R1` ในสเตจ Write Back ทำให้เกิด Data Hazard หากไม่มีการจัดการ `SUB` จะได้ค่าเก่าที่ผิดพลาดไปคำนวณ

<div class="hazard-card data-hazard">
  <div class="hazard-header">⚠️ สรุป Data Hazard (Hazard แบบข้อมูล)</div>
  <div><strong>สาเหตุหลัก:</strong> การพึ่งพาข้อมูลระหว่างคำสั่งที่อยู่ติดกัน (Data Dependency)</div>
  <div style="margin-top: 4px;"><strong>ผลกระทบ:</strong> คำสั่งต้องหยุดรอ (Stall) จนกว่าข้อมูลที่ถูกต้องจะพร้อมใช้งาน</div>
</div>

---

### 2. Hazard แบบโครงสร้าง (Structural Hazard)
- **สาเหตุ:** เกิดขึ้นเมื่อ **ทรัพยากรฮาร์ดแวร์ (Hardware Resource) ในระบบมีจำกัด** ทำให้มีคำสั่งตั้งแต่ 2 คำสั่งขึ้นไปต้องการเข้าถึงทรัพยากรฮาร์ดแวร์ชิ้นเดียวกันในรอบสัญญาณนาฬิกาเดียวกัน (Resource Conflict)
- **อุปมาอุปไมย:** ในโรงงานผลิตรถยนต์ มีเครื่องพ่นสีอยู่เพียงเครื่องเดียว ถ้ารถคันที่ 1 กำลังพ่นสีอยู่ รถคันที่ 2 ที่เดินทางมาถึงสถานีพ่นสีก็ต้องจอดรอ เพราะเครื่องพ่นสีไม่ว่าง
- **ตัวอย่างใน CPU:**
  - ซีพียูที่มี **พอร์ตหน่วยความจำเพียงพอร์ตเดียว (Single-port Memory)** รวม Instruction Memory และ Data Memory ไว้ด้วยกัน (สถาปัตยกรรมแบบ Von Neumann)
  - ในรอบสัญญาณนาฬิกาเดียวกัน คำสั่งหนึ่งอยู่ที่ **สเตจ MEM** (เช่น คำสั่ง `lw` หรือ `sw` กำลังอ่าน/เขียน RAM) ขณะที่อีกคำสั่งหนึ่งอยู่ที่ **สเตจ IF** (กำลังอ่านคำสั่งใหม่จาก RAM)
  - คำสั่งทั้งสองแย่งใช้ Memory Bus เดียวกันในเวลาเดียวกัน ทำให้เกิด Structural Hazard

<div class="hazard-card structural-hazard">
  <div class="hazard-header">🛑 สรุป Structural Hazard (Hazard แบบโครงสร้าง)</div>
  <div><strong>สาเหตุหลัก:</strong> ทรัพยากรฮาร์ดแวร์ไม่เพียงพอเกิดการแย่งใช้งานพร้อมกัน (Resource Conflict)</div>
  <div style="margin-top: 4px;"><strong>ผลกระทบ:</strong> ต้องหยุดคำสั่งหนึ่งไว้ชั่วคราวเพื่อรอให้อีกคำสั่งใช้ทรัพยากรเสร็จก่อน</div>
</div>

---

### 3. Hazard แบบควบคุม (Control Hazard หรือ Branch Hazard)
- **สาเหตุ:** เกิดขึ้นเมื่อมีการใช้ **คำสั่งเปลี่ยนทิศทางการทำงานของโปรแกรม (Branch / Jump Instructions)** เช่น `BEQ`, `BNE`, `BEQZ`, `JUMP`, `CALL`
- **ปัญหาที่เกิดขึ้น:** เนื่องจากไปป์ไลน์มีการดึงคำสั่งถัดไปมาล่วงหน้า (Pre-fetching) ในสเตจ IF แต่ ณ ขณะนั้น CPU ยังไม่ทราบผลลัพธ์ของเงื่อนไข (ซึ่งจะตัดสินในสเตจ ID หรือ EX) ว่าจะ **กระโดด (Branch Taken)** หรือ **ไม่กระโดด (Branch Not Taken)**
- **อุปมาอุปไมยอ่านแผนที่เดินทาง:**
  - แผนที่ระบุ: *"ถ้าเจอแยกไฟแดงให้เลี้ยวซ้าย (จริง) หรือถ้าไม่เจอให้ตรงไป (เท็จ)"*
  - คุณไม่รู้ว่าข้างหน้าจะมีไฟแดงหรือไม่ คุณจึงตัดสินใจเดาและเตรียมตัวเลี้ยวซ้ายไว้ล่วงหน้า แต่พอเดินทางไปถึงจริงๆ ปรากฏว่าไม่มีไฟแดง คุณต้องขับตรงไป ทำให้การเตรียมเลี้ยวซ้ายก่อนหน้านั้น **สูญเปล่าทั้งหมด!**
- **ตัวอย่างใน CPU:**
  ```assembly
  BEQZ R1, TARGET   # ถ้า R1 เป็น 0 ให้กระโดดไปที่ TARGET
  ADD  R2, R3, R4   # คำสั่งถัดไป (I2) ถูก Fetch เข้ามาล่วงหน้า
  SUB  R5, R6, R7   # คำสั่งถัดไป (I3) ถูก Fetch เข้ามาล่วงหน้า
  ```
  หากเงื่อนไขเป็นจริง (Branch Taken) ซีพียูต้องกระโดดไปทำที่ `TARGET` ทำให้คำสั่ง `ADD` และ `SUB` ที่ดึงเข้ามาล่วงหน้ากลายเป็นคำสั่งที่ไม่ถูกต้อง และต้องถูก **ล้างทิ้ง (Flush the Pipeline)** ทั้งหมด ทำให้เสียรอบสัญญาณนาฬิกาไปโดยเปล่าประโยชน์

<div class="hazard-card control-hazard">
  <div class="hazard-header">🔄 สรุป Control Hazard (Hazard แบบควบคุม)</div>
  <div><strong>สาเหตุหลัก:</strong> คำสั่งเงื่อนไข Branch/Jump ทำให้ไม่รู้แอดเดรสของคำสั่งถัดไปที่แน่นอนขณะทำ Pre-fetch</div>
  <div style="margin-top: 4px;"><strong>ผลกระทบ:</strong> หากเดาทิศทางผิด คำสั่งในไปป์ไลน์ต้องถูกล้างทิ้ง (Flush) เสียรอบนาฬิกา (Misprediction Penalty)</div>
</div>
"""
  },
  {
    "id": "module-8",
    "moduleNumber": "08",
    "title": "8. เทคนิคการแก้ไข Pipeline Hazards (Hazard Resolution Techniques)",
    "pageRef": "หน้าที่ 19-23, 29-31",
    "summary": "4 เทคนิคมาตรฐานในการปลดล็อก Pipeline Hazards: Stalling (Bubble/NOP), Forwarding (Bypassing), Branch Prediction (Static/Dynamic และการแก้ปัญหาใน Loop), และ Instruction Reordering โดย Compiler",
    "objectives": [
      "ข้อ 12: อธิบายเทคนิคการแก้ปัญหา Hazard แบบการหยุดรอ (Stalling) หรือ Bubble ได้",
      "ข้อ 13: อธิบายเทคนิคการแก้ปัญหา Hazard แบบการส่งต่อข้อมูล (Forwarding) หรือ Bypassing ได้",
      "ข้อ 14: อธิบายเทคนิคการแก้ปัญหา Hazard แบบการทำนายการทำงาน (Branch Prediction) ได้",
      "ข้อ 15: อธิบายเทคนิคการแก้ปัญหา Hazard แบบการจัดลำดับคำสั่งใหม่ (Instruction Reordering) ได้"
    ],
    "content": """
### 4 เทคนิคมาตรฐานในการจัดการและแก้ไข Pipeline Hazards
เมื่อเกิด Hazards ในไปป์ไลน์ วิศวกรคอมพิวเตอร์ได้คิดค้นเทคนิคการแก้ปัญหาทั้งในระดับฮาร์ดแวร์และซอฟต์แวร์คอมไพเลอร์ ดังต่อไปนี้:

---

### เทคนิคที่ 1: การหยุดรอ (Stalling) หรือการแทรก Bubble (NOP)
- **หลักการทำงาน:** คือการ **แทรกขั้นตอนว่างๆ ที่เรียกว่า "Bubble" (ฟองอากาศ)** หรือคำสั่งที่ไม่มีการปฏิบัติงาน (**NOP - No Operation**) เข้าไปในไปป์ไลน์ เพื่อหน่วงเวลาให้คำสั่งที่ต้องการข้อมูลต้องหยุดรอชั่วคราว จนกว่าคำสั่งก่อนหน้าจะเขียนข้อมูลเสร็จสิ้นในสเตจ WB
- **ตัวอย่าง:**
  ```assembly
  ADD R1, R2, R3    # คำนวณเสร็จใน EX, บันทึกลง R1 ใน WB (รอบที่ 5)
  [ Bubble / NOP ]  # แทรก Bubble รอบที่ 1
  [ Bubble / NOP ]  # แทรก Bubble รอบที่ 2
  SUB R4, R1, R5    # ปล่อยให้ SUB อ่าน R1 ได้หลังจาก ADD จบ WB
  ```
- **ข้อดี:** ออกแบบฮาร์ดแวร์ง่าย โครงสร้างตรงไปตรงมา
- **ข้อเสีย:** สูญเสียรอบสัญญาณนาฬิกาไปโดยเปล่าประโยชน์ ทำให้ Throughput ของไปป์ไลน์ลดลง

---

### เทคนิคที่ 2: การส่งต่อข้อมูล (Forwarding) หรือ Bypassing
- **หลักการทำงาน:** เป็นเทคนิคฮาร์ดแวร์ขั้นสูงที่ใช้แก้ปัญหา **Data Hazard** โดยการ **ดึงผลลัพธ์ที่คำนวณเสร็จแล้วจากสเตจ EX หรือ MEM ของคำสั่งแรก ส่งผ่านสายทางลัด (Forwarding Path) ไปยังอินพุตของสเตจ EX ของคำสั่งถัดไปโดยตรงทันที** โดยไม่ต้องรอให้คำสั่งแรกเขียนค่ากลับลง Register File ในสเตจ WB
- **ตัวอย่าง:**
  ```assembly
  ADD R1, R2, R3    # ALU คำนวณค่า R1 เสร็จสิ้นที่ปลายสเตจ EX
  SUB R4, R1, R5    # วงจร Forwarding ส่งค่า R1 จาก EX เข้าสเตจ EX ของ SUB ทันที!
  ```
- **ข้อดี:** คำสั่ง `SUB` สามารถทำงานได้ทันทีโดย **ไม่ต้องหยุดรอ (Zero Stall Cycles)** ทำให้ประสิทธิภาพของระบบสูงสุด
- **ข้อยกเว้น (Load-Use Data Hazard):** หากคำสั่งแรกเป็นคำสั่ง `LOAD` (เช่น `lw R1, 0(R2)`) ข้อมูลจะพร้อมใช้งานหลังจบสเตจ MEM เท่านั้น ดังนั้นคำสั่งถัดไปที่ต้องการใช้ข้อมูลยังจำเป็นต้องเกิด **Stall 1 รอบสัญญาณนาฬิกา** แม้จะมีวงจร Forwarding ก็ตาม

---

### เทคนิคที่ 3: การทำนายการทำงาน (Branch Prediction)
- **หลักการทำงาน:** ใช้แก้ปัญหา **Control Hazard** โดยฮาร์ดแวร์จะ **คาดเดาล่วงหน้าว่าคำสั่ง Branch นั้นจะกระโดด (Taken) หรือไม่กระโดด (Not Taken)** แล้วดึงคำสั่งตามทิศทางที่คาดเดานั้นมาประมวลผลล่วงหน้าทันที
- **รูปแบบการทำนาย:**
  - **Static Branch Prediction:** คาดเดาตามกฎตายตัว เช่น คาดเดาว่าคำสั่งเงื่อนไขจะไม่กระโดดเสมอ (Always Predict Not Taken) หรือคำสั่งกระโดดย้อนกลับในลูปให้เดาว่ากระโดดเสมอ (Backward Taken)
  - **Dynamic Branch Prediction:** ใช้ตารางประวัติ (Branch History Table - BHT) บันทึกพฤติกรรมในอดีตเพื่อคาดเดาในอนาคตได้อย่างแม่นยำสูงกว่า 90%
- **กรณีการทำงานใน Loop:** คำสั่ง Branch ที่อยู่ท้ายลูปจะวนซ้ำหลายรอบ การทำนายว่า "Taken" จะถูกต้องเกือบทุกรอบ ยกเว้นรอบสุดท้ายที่ออกจากลูป
- **ผลลัพธ์:**
  - **หากเดาถูก (Hit):** ไปป์ไลน์ทำงานต่อเนื่องได้อย่างราบรื่น ไม่เสียเวลาแม้แต่รอบเดียว
  - **หากเดาผิด (Misprediction / Miss):** ซีพียูต้อง **ล้างคำสั่งที่ดึงมาล่วงหน้าทิ้งทั้งหมด (Flush the Pipeline)** และกลับไปดึงคำสั่งที่ถูกต้อง ทำให้เสียเวลาหน่วง (Penalty 2-3 รอบนาฬิกา)

---

### เทคนิคที่ 4: การจัดลำดับคำสั่งใหม่ (Instruction Reordering)
- **หลักการทำงาน:** เป็นเทคนิคที่ **ซอฟต์แวร์คอมไพเลอร์ (Optimizing Compiler)** หรือฮาร์ดแวร์แบบ Out-of-Order จะทำการ **สลับลำดับคำสั่งที่เป็นอิสระต่อกัน (Independent Instructions)** ให้มาทำงานคั่นกลางระหว่างคู่คำสั่งที่มี Data Dependency เพื่ออุดช่องว่าง Stall Cycle

#### ตัวอย่างการ Reorder จากเอกสารต้นฉบับ:
<div class="comparison-grid">
  <div class="comparison-card left-side">
    <div class="comparison-header">
      <div class="comparison-title">ลำดับคำสั่งเดิม (เกิดการรอคอย)</div>
      <div class="comparison-subtitle">คำสั่งที่ 2 ต้องรอคำสั่งที่ 1</div>
    </div>
    <div class="comparison-body">
      <div class="code-block" style="margin: 0;">
        <pre>1. LOAD R1, A
2. ADD  R2, R1, B  <span class="hl-comment"># ต้องรอค่า R1 จาก LOAD (เกิด Stall!)</span>
3. LOAD R3, C
4. SUB  R4, R3, D  <span class="hl-comment"># ต้องรอค่า R3 จาก LOAD (เกิด Stall!)</span></pre>
      </div>
      <p style="font-size: 13px; color: var(--rose-danger); margin-top: 8px;">ผลลัพธ์: เกิดการหยุดรอ (Stalls) ซ้ำซ้อนถึง 2 ครั้ง</p>
    </div>
  </div>

  <div class="comparison-card right-side">
    <div class="comparison-header">
      <div class="comparison-title">หลังจัดลำดับใหม่ (Instruction Reordered)</div>
      <div class="comparison-subtitle">นำคำสั่งอิสระมาคั่นกลาง ไม่เสียรอบรอเลย</div>
    </div>
    <div class="comparison-body">
      <div class="code-block" style="margin: 0;">
        <pre>1. LOAD R1, A
2. LOAD R3, C      <span class="hl-comment"># สลับขึ้นมาทำ! ทำงานระหว่างรอ R1</span>
3. ADD  R2, R1, B  <span class="hl-comment"># R1 พร้อมแล้ว ทำงานได้ทันที!</span>
4. SUB  R4, R3, D  <span class="hl-comment"># R3 พร้อมแล้ว ทำงานได้ทันที!</span></pre>
      </div>
      <p style="font-size: 13px; color: var(--emerald-success); margin-top: 8px;">ผลลัพธ์: ทำงานได้อย่างราบรื่น 100% โดยไม่มีการ Stall แม้แต่รอบเดียว!</p>
    </div>
  </div>
</div>

---

### ตารางสรุปเปรียบเทียบ 4 เทคนิคการแก้ไข Hazards
<div class="table-responsive">
  <table class="modern-table">
    <thead>
      <tr>
        <th>เทคนิคการแก้ปัญหา</th>
        <th>แก้ปัญหา Hazard ใด</th>
        <th>ระดับการจัดการ</th>
        <th>ผลต่อประสิทธิภาพ (Performance)</th>
        <th>ข้อจำกัด / สิ่งที่ต้องแลกเปลี่ยน</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Stalling (Bubble / NOP)</strong></td>
        <td>Data & Control Hazards</td>
        <td>Hardware / Software</td>
        <td style="color: var(--rose-danger); font-weight: 600;">ลดลง (เสียรอบนาฬิกาเปล่า)</td>
        <td>ง่าย แต่ทำให้โปรแกรมทำงานช้าลง</td>
      </tr>
      <tr>
        <td><strong>Forwarding (Bypassing)</strong></td>
        <td>Data Hazard (RAW)</td>
        <td>Hardware (Multiplexers)</td>
        <td style="color: var(--emerald-success); font-weight: 700;">สูงสุด (ไม่เสีย Stall รอบ)</td>
        <td>เพิ่มความซับซ้อนของวงจร, ไม่หายใน Load-Use</td>
      </tr>
      <tr>
        <td><strong>Branch Prediction</strong></td>
        <td>Control Hazard (Branch)</td>
        <td>Hardware (Predictor)</td>
        <td style="color: var(--emerald-success); font-weight: 700;">สูงมาก หากทำนายถูกต้อง</td>
        <td>หากทายผิดต้อง Flush เสีย Misprediction Penalty</td>
      </tr>
      <tr>
        <td><strong>Instruction Reordering</strong></td>
        <td>Data Hazard (Load Delay)</td>
        <td>Software (Compiler)</td>
        <td style="color: var(--emerald-success); font-weight: 700;">สูงมาก (กำจัดช่องว่าง Stall)</td>
        <td>ต้องอาศัยคำสั่งที่เป็นอิสระต่อกันในโปรแกรม</td>
      </tr>
    </tbody>
  </table>
</div>
"""
  },
  {
    "id": "module-9",
    "moduleNumber": "09",
    "title": "9. การวัดและเปรียบเทียบประสิทธิภาพ (Performance Analysis: Latency vs. Throughput)",
    "pageRef": "หน้าที่ 24-25, 29",
    "summary": "2 ตัวชี้วัดสำคัญของประสิทธิภาพ CPU: Latency (ความหน่วงต่อ 1 คำสั่ง) และ Throughput (อัตรางานที่ทำเสร็จต่อหน่วยเวลา - IPC / IPS), ตัวอย่างการคำนวณเปรียบเทียบเชิงตัวเลขอย่างละเอียด (3 คำสั่ง 3 สเตจ), และสูตรอัตราเร่งเชิงทฤษฎี (Speedup Factor)",
    "objectives": [
      "ข้อ 16: อธิบายการเปรียบเทียบประสิทธิภาพการทำงานแบบไปป์ไลน์และการทำงานไม่ใช้ไปป์ไลน์ (Compare the performance of Pipelined vs. Non-pipelined operation) ได้"
    ],
    "content": """
### 2 ตัวชี้วัดหลักของประสิทธิภาพการประมวลผล
ในการวัดและประเมินประสิทธิภาพระหว่างสถาปัตยกรรม CPU แบบไม่ใช้ไปป์ไลน์ และแบบใช้ไปป์ไลน์ วิศวกรจะใช้ตัวชี้วัดหลัก 2 ตัว:

<div class="comparison-grid">
  <div class="comparison-card left-side">
    <div class="comparison-header">
      <div class="comparison-title">1. Latency (ความหน่วงเวลา)</div>
      <div class="comparison-subtitle">ระยะเวลาของคำสั่งเดี่ยว</div>
    </div>
    <div class="comparison-body">
      <p><strong>นิยาม:</strong> คือระยะเวลาทั้งหมดที่ใช้ในการประมวลผล <strong>หนึ่งคำสั่งให้เสร็จสมบูรณ์ 100%</strong> ตั้งแต่เริ่มต้นจนสิ้นสุดขั้นตอนสุดท้าย</p>
      <p><strong>หน่วยวัด:</strong> วัดเป็นรอบสัญญาณนาฬิกา (Clock Cycles) หรือหน่วยเวลาจริง เช่น นาโนวินาที (ns)</p>
      <p style="color: var(--amber-warning); font-weight: 600;">ความจริงสำคัญ: ไปป์ไลน์ไม่ได้ช่วยลด Latency ของแต่ละคำสั่งเลย (ในความเป็นจริงอาจเพิ่มขึ้นเล็กน้อยจากความหน่วงของบัฟเฟอร์)</p>
    </div>
  </div>

  <div class="comparison-card right-side">
    <div class="comparison-header">
      <div class="comparison-title">2. Throughput (อัตราปริมาณงาน)</div>
      <div class="comparison-subtitle">จำนวนคำสั่งที่สำเร็จต่อหน่วยเวลา</div>
    </div>
    <div class="comparison-body">
      <p><strong>นิยาม:</strong> คือ <strong>ปริมาณงานหรือจำนวนคำสั่งที่ระบบสามารถประมวลผลเสร็จสมบูรณ์ได้ในหนึ่งหน่วยเวลา</strong></p>
      <p><strong>หน่วยวัด:</strong> วัดเป็นคำสั่งต่อรอบสัญญาณนาฬิกา (Instructions Per Cycle - IPC) หรือคำสั่งต่อวินาที (Instructions Per Second - IPS)</p>
      <p style="color: var(--emerald-success); font-weight: 700;">ความจริงสำคัญ: ไปป์ไลน์มุ่งเน้นการเพิ่ม Throughput เป็นเป้าหมายหลักสูงสุด!</p>
    </div>
  </div>
</div>

---

### การคำนวณและเปรียบเทียบเชิงตัวเลขอย่างละเอียด (จากเอกสารหน้า 24-25)
สมมติว่าเรามีงานทั้งหมด **n = 3 คำสั่ง** แต่ละคำสั่งแบ่งออกเป็น **k = 3 สเตจ** และแต่ละสเตจใช้เวลา **1 รอบสัญญาณนาฬิกา**:

#### แบบที่ 1: ไม่ใช้ไปป์ไลน์ (Non-Pipelined / Sequential)
- **หลักการ:** ทำงานทีละคำสั่งจนเสร็จสมบูรณ์ 100% แล้วจึงเริ่มคำสั่งถัดไป
- **การคำนวณ Latency:** 3 สเตจ x 1 รอบ/สเตจ = **3 รอบสัญญาณนาฬิกาต่อคำสั่ง**
- **การคำนวณ Throughput:** ทำงานเสร็จ 1 คำสั่งในทุกๆ 3 รอบสัญญาณนาฬิกา = 1/3 ≈ **0.33 IPC**
- **เวลาทั้งหมด (Total Execution Time):** 3 คำสั่ง x 3 รอบ/คำสั่ง = **9 รอบสัญญาณนาฬิกา**

#### แบบที่ 2: ใช้ไปป์ไลน์ (Pipelined Execution)
- **หลักการ:** แบ่งงานเป็นสเตจและทำงานซ้อนทับกันพร้อมเพรียงในแต่ละรอบสัญญาณนาฬิกา
- **การคำนวณ Latency:** ยังคงเป็น **3 รอบสัญญาณนาฬิกาต่อคำสั่ง** เท่าเดิม (เพราะแต่ละคำสั่งยังต้องเดินทางผ่านครบทั้ง 3 สเตจ)
- **การคำนวณ Throughput:** เมื่อไปป์ไลน์เต็ม สามารถปล่อยคำสั่งใหม่ออกมาได้ในทุกๆ 1 รอบ = **1.0 IPC (เพิ่มขึ้น 3 เท่า!)**
- **เวลาทั้งหมด (Total Execution Time):** คำนวณจากสูตร:
  `เวลาทั้งหมด = k + n - 1`
  เมื่อ k = 3 สเตจ และ n = 3 คำสั่ง
  `เวลาทั้งหมด = 3 + 3 - 1 = 5 รอบสัญญาณนาฬิกา`

<div class="metric-grid">
  <div class="metric-card">
    <div class="metric-label">ไม่ใช้ไปป์ไลน์ (เวลาทั้งหมด)</div>
    <div class="metric-value" style="color: var(--rose-danger);">9 รอบ</div>
    <div class="metric-desc">Throughput = 0.33 IPC</div>
  </div>
  <div class="metric-card">
    <div class="metric-label">ใช้ไปป์ไลน์ (เวลาทั้งหมด)</div>
    <div class="metric-value" style="color: var(--emerald-success);">5 รอบ</div>
    <div class="metric-desc">Throughput = 1.0 IPC (เร็วขึ้นเกือบเท่าตัว!)</div>
  </div>
  <div class="metric-card">
    <div class="metric-label">อัตราเร่ง (Speedup)</div>
    <div class="metric-value" style="color: var(--indigo-primary);">1.8 เท่า</div>
    <div class="metric-desc">S = 9 / 5 = 1.8 เท่า (และจะลู่เข้าหา 3 เท่าเมื่อ n มีค่ามาก)</div>
  </div>
</div>

---

### ตารางที่ 8-5: การเปรียบเทียบประสิทธิภาพระหว่าง CPU ไม่ใช้ไปป์ไลน์และใช้ไปป์ไลน์
<div class="table-responsive">
  <table class="modern-table">
    <thead>
      <tr>
        <th>คุณสมบัติ (Attributes)</th>
        <th class="cell-center">ไม่ใช้ไปป์ไลน์ (Non-Pipelined)</th>
        <th class="cell-center">ใช้ไปป์ไลน์ (Pipelined)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Latency (ความหน่วงต่อ 1 คำสั่ง)</strong></td>
        <td class="cell-center">เท่ากัน (3 รอบ)</td>
        <td class="cell-center cell-highlight">เท่ากัน (3 รอบ)</td>
      </tr>
      <tr>
        <td><strong>Throughput (อัตรางานสำเร็จ)</strong></td>
        <td class="cell-center" style="color: var(--rose-danger); font-weight: 600;">ต่ำ (0.33 IPC)</td>
        <td class="cell-center cell-highlight" style="color: var(--emerald-success); font-weight: 700;">สูง (1.0 IPC)</td>
      </tr>
      <tr>
        <td><strong>เวลาที่ใช้ทั้งหมด (3 คำสั่ง 3 สเตจ)</strong></td>
        <td class="cell-center" style="color: var(--rose-danger);">สูง (9 รอบสัญญาณนาฬิกา)</td>
        <td class="cell-center cell-highlight" style="color: var(--emerald-success); font-weight: 700;">ต่ำ (5 รอบสัญญาณนาฬิกา)</td>
      </tr>
    </tbody>
  </table>
</div>

---

### สูตรคำนวณอัตราเร่งเชิงทฤษฎี (Theoretical Speedup)
ในการคำนวณอัตราเร่ง (Speedup: S) ของไปป์ไลน์ k สเตจ สำหรับ n คำสั่ง:
- **เวลาแบบไม่ใช้ไปป์ไลน์:** `T_nonpipe = n × k`
- **เวลาแบบใช้ไปป์ไลน์:** `T_pipe = k + n - 1`
- **อัตราเร่ง (Speedup):**
  `S = (n × k) / (k + n - 1)`
- **เมื่อ n มีปริมาณมากมหาศาล (n -> ∞):**
  ค่าของ `(k + n - 1)` จะมีค่าใกล้เคียงกับ `n` ส่งผลให้:
  `S ≈ (n × k) / n = k`
  นั่นคือ **อัตราเร่งสูงสุดในอุดมคติจะมีค่าเท่ากับจำนวนสเตจ (k เท่า)** ของไปป์ไลน์นั่นเอง!

<div class="callout callout-success">
  <strong>หัวใจสำคัญที่สุดของบทเรียน (Core Takeaway):</strong> แม้ Latency ของแต่ละคำสั่งจะไม่ได้ลดลง แต่ Throughput ของระบบไปป์ไลน์สูงกว่าอย่างเห็นได้ชัด ทำให้ภาพรวมของการประมวลผลคำสั่งทั้งหมดเสร็จสิ้นได้รวดเร็วกว่ามาก ซึ่งนี่คือเหตุผลหลักที่โปรเซสเซอร์ยุคใหม่ทุกตัวต้องใช้สถาปัตยกรรมแบบไปป์ไลน์!
</div>
"""
  }
]

code_content = "export const courseModules = " + json.dumps(modules, ensure_ascii=False, indent=2) + ";\n"

with open("src/data/courseData.js", "w", encoding="utf-8") as f:
    f.write(code_content)

print(f"Generated courseData.js with {len(modules)} modules successfully!")
