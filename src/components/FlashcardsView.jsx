import React, { useState } from 'react';
import { Layers, RotateCcw, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';

export default function FlashcardsView() {
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const cards = [
    { front: "การทำงานแบบไปป์ไลน์ (Pipeline) คืออะไร?", back: "เทคนิคการเพิ่ม Throughput ของ CPU โดยแบ่งคำสั่งเป็นสเตจย่อยๆ แล้วประมวลผลหลายคำสั่งซ้อนทับกันพร้อมๆ กันในเวลาเดียวกัน" },
    { front: "CPU แบบไม่ใช้ไปป์ไลน์ (Single-cycle CPU) คืออะไร?", back: "CPU ที่ประมวลผลหนึ่งคำสั่งครบทุกสเตจตั้งแต่ต้นจนจบเสร็จสิ้นภายในหนึ่งรอบสัญญาณนาฬิกา (One Clock Cycle)" },
    { front: "ข้อดีและข้อจำกัดของ Single-cycle CPU คืออะไร?", back: "ข้อดี: ออกแบบง่าย ไม่มีปัญหา Pipeline Hazards | ข้อเสีย: ความถี่ต่ำ รอบนาฬิกาถูกจำกัดโดยขั้นตอนที่ช้าที่สุด (Critical Path)" },
    { front: "5 สเตจมาตรฐานของสถาปัตยกรรม MIPS/RISC มีอะไรบ้าง?", back: "1. IF (Fetch) 2. ID (Decode) 3. EX (Execute) 4. MEM (Memory Access) 5. WB (Write Back)" },
    { front: "สเตจ IF (Instruction Fetch) ทำหน้าที่อะไร?", back: "ดึงคำสั่งภาษาเครื่องจาก Instruction Memory โดยใช้แอดเดรสจาก PC แล้วเพิ่มค่า PC++ (PC = PC + 4) บันทึกใส่ IF/ID Latch" },
    { front: "สเตจ ID (Instruction Decode) ทำหน้าที่อะไร?", back: "ถอดรหัส OpCode และอ่านค่าตัวถูกดำเนินการจากรีจิสเตอร์ต้นทาง (Register File: Rs, Rt) และทำการ Sign-Extend ค่าคงที่" },
    { front: "สเตจ EX (Execute) ทำหน้าที่อะไร?", back: "ประมวลผลคำนวณทางคณิตศาสตร์/ตรรกะด้วย ALU คำนวณ Effective Address สำหรับ Load/Store และตรวจสอบเงื่อนไข Branch" },
    { front: "สเตจ MEM (Memory Access) ทำหน้าที่อะไร?", back: "เข้าถึง Data Memory เพื่ออ่านข้อมูล (คำสั่ง LOAD) หรือเขียนข้อมูล (คำสั่ง STORE) หากเป็นคำสั่งคำนวณทั่วไปจะส่งผ่านข้อมูลไป WB" },
    { front: "สเตจ WB (Write Back) ทำหน้าที่อะไร?", back: "เขียนผลลัพธ์สุดท้ายจากการคำนวณ ALU หรือที่อ่านได้จากแรม กลับไปยังรีจิสเตอร์ปลายทาง (Destination Register) ใน Register File" },
    { front: "ไปป์ไลน์แบบเป็นลำดับ (Linear Pipeline) คืออะไร?", back: "ไปป์ไลน์ที่ข้อมูลไหลไปข้างหน้าทิศทางเดียว (One-way) ไม่มีการย้อนกลับหรือข้ามสเตจ โครงสร้างเรียบง่าย นิยมใช้ใน CPU ทั่วไป" },
    { front: "ไปป์ไลน์แบบไม่เป็นลำดับ (Non-linear Pipeline) คืออะไร?", back: "ไปป์ไลน์ที่มี Feedback Loop หรือหลายเส้นทาง สามารถนำผลลัพธ์กลับมาคำนวณซ้ำในสเตจเดิมได้ นิยมใช้ในงาน DSP และ Adaptive Image" },
    { front: "Pipeline Registers (Inter-stage Buffers) คืออะไร?", back: "รีจิสเตอร์เก็บข้อมูลชั่วคราวกั้นระหว่างสเตจ (IF/ID, ID/EX, EX/MEM, MEM/WB) เพื่อแยกผลลัพธ์และประสานจังหวะสัญญาณนาฬิกา" },
    { front: "3 หน้าที่สำคัญของบัฟเฟอร์ (Pipeline Registers) คืออะไร?", back: "1. ป้องกันข้อมูลปนกัน (Isolation) 2. ส่งข้อมูลพร้อมเพรียง (Synchronization) 3. เก็บสถานะและสัญญาณควบคุม (Holding State)" },
    { front: "การเพิ่มประสิทธิภาพไปป์ไลน์ (Optimization) มี 2 วิธีหลักอะไรบ้าง?", back: "1. การเพิ่มจำนวนสเตจ (More Stages / Superpipelining) 2. การลดระยะเวลาของแต่ละสเตจ (Reducing Stage Time โดยปรับปรุงฮาร์ดแวร์)" },
    { front: "Pipeline Hazards คืออะไร?", back: "สภาวะขัดแย้งในไปป์ไลน์ที่ทำให้คำสั่งถัดไปไม่สามารถประมวลผลต่อในรอบที่กำหนดได้ ทำให้ต้องหยุดชะงัก (Stall) หรือล้างคำสั่งทิ้ง (Flush)" },
    { front: "Data Hazard (RAW: Read After Write) เกิดจากสาเหตุใด?", back: "คำสั่งถัดไปต้องการอ่านข้อมูลจากรีจิสเตอร์ที่คำสั่งก่อนหน้ายังประมวลผลไม่เสร็จ หรือยังไม่ได้เขียนค่ากลับลง Register File ในสเตจ WB" },
    { front: "Structural Hazard เกิดจากสาเหตุใด?", back: "ทรัพยากรฮาร์ดแวร์มีจำกัด ทำให้หลายคำสั่งต้องการเข้าถึงฮาร์ดแวร์ชิ้นเดียวกันในรอบสัญญาณนาฬิกาเดียวกัน (Resource Conflict)" },
    { front: "Control Hazard (Branch Hazard) เกิดจากสาเหตุใด?", back: "เกิดจากคำสั่ง Branch/Jump ที่เปลี่ยนทิศทางโปรแกรม ทำให้คำสั่งที่ดึงเข้ามาล่วงหน้า (Pre-fetch) อาจไม่ถูกต้องหากเงื่อนไขกระโดดจริง" },
    { front: "เทคนิค Stalling (การแทรก Bubble / NOP) ทำงานอย่างไร?", back: "แทรกขั้นตอนว่างเปล่า (NOP) เข้าไปในไปป์ไลน์ เพื่อหน่วงเวลาให้คำสั่งถัดไปหยุดรอ 1-2 รอบ จนกว่าข้อมูลจากคำสั่งก่อนหน้าจะพร้อม" },
    { front: "เทคนิค Forwarding (Bypassing) ทำงานอย่างไร?", back: "ส่งผลลัพธ์ที่คำนวณเสร็จในสเตจ EX หรือ MEM ไปยังอินพุตสเตจ EX ของคำสั่งถัดไปโดยตรงผ่านสายทางลัด ไม่ต้องรอให้เขียนลง Register File" },
    { front: "ทำไม Load-Use Data Hazard จึงยังต้องเกิด Stall 1 รอบแม้มี Forwarding?", back: "เพราะคำสั่ง LOAD ได้ข้อมูลจริงจาก Data Memory หลังจบสเตจ MEM เท่านั้น จึงไม่สามารถส่งย้อนเวลาไปให้สเตจ EX ของคำสั่งถัดไปได้ทัน" },
    { front: "Branch Prediction คืออะไร?", back: "การคาดเดาทิศทางของคำสั่ง Branch ล่วงหน้า (Taken หรือ Not Taken) เพื่อดึงคำสั่งที่ถูกต้องมาทำงานต่อเนื่องโดยไม่ต้องรอผลเงื่อนไข" },
    { front: "เมื่อทำนาย Branch ผิดพลาด (Misprediction) ซีพียูต้องทำอย่างไร?", back: "ต้องล้างคำสั่งที่ดึงมาล่วงหน้าทิ้งทั้งหมด (Flush the Pipeline) แล้วเริ่มดึงคำสั่งจากแอดเดรสที่ถูกต้อง ทำให้เสีย Branch Penalty" },
    { front: "Instruction Reordering โดยคอมไพเลอร์ช่วยแก้ปัญหาอย่างไร?", back: "สลับนำคำสั่งที่เป็นอิสระมาทำงานคั่นกลางระหว่างคู่คำสั่งที่มีการพึ่งพาข้อมูล เพื่ออุดช่องว่าง Stall โดยไม่ต้องเสียรอบรอคอย (Zero Stalls)" },
    { front: "ความแตกต่างระหว่าง Latency และ Throughput คืออะไร?", back: "Latency: เวลาที่ใช้ประมวลผลหนึ่งคำสั่งจนจบ (รอบ/วินาที) | Throughput: จำนวนคำสั่งที่ประมวลผลเสร็จในหนึ่งหน่วยเวลา (IPC/IPS)" }
  ];

  const current = cards[cardIdx];

  const handleNext = () => {
    setIsFlipped(false);
    setCardIdx(prev => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCardIdx(prev => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>🎴 Flashcards ทบทวนความจำก่อนสอบ</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
          คลิกที่การ์ดเพื่อพลิกดูคำตอบ ({cardIdx + 1} / {cards.length})
        </p>
      </div>

      <div className="flashcard-wrapper">
        <div className="flashcard" onClick={() => setIsFlipped(!isFlipped)}>
          <span className="card-side-tag">
            {isFlipped ? 'เฉลย / คำอธิบาย' : 'คำถาม / นิยามศัพท์'}
          </span>

          <h3 style={{ fontSize: isFlipped ? '16px' : '20px', color: isFlipped ? '#0f172a' : '#4f46e5', fontWeight: '700', lineHeight: '1.6' }}>
            {isFlipped ? current.back : current.front}
          </h3>

          <div style={{ marginTop: '24px', fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> คลิกเพื่อพลิกการ์ด
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
          <button className="btn-secondary" onClick={handlePrev}>
            <ArrowLeft size={16} /> การ์ดก่อนหน้า
          </button>

          <button className="btn-primary" onClick={handleNext}>
            การ์ดถัดไป <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
