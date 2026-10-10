import React, { useState } from 'react';
import { Layers, ArrowRight, ArrowLeft, RefreshCw, Shuffle } from 'lucide-react';

export default function FlashcardsView() {
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const cards = [
    {
      front: "การทำงานแบบไปป์ไลน์ (Pipeline) คืออะไร และมี 3 หลักการสำคัญอย่างไร?",
      back: "คือ เทคนิคการเพิ่มประสิทธิภาพของ CPU ด้วยการแบ่งขั้นตอนประมวลผลคำสั่งที่เดิมทำตามลำดับ (Sequential) ให้สามารถทำไปพร้อมๆ กันได้\n1. การแบ่งงานย่อย (Work Division): แบ่งวงรอบเป็นหลายสเตจ\n2. การทำพร้อมกัน (Concurrency): แต่ละสเตจประมวลผลคนละคำสั่งพร้อมกัน\n3. การทำต่อเนื่อง (Continuity): ส่งต่องานเป็นจังหวะไม่ให้มีการรอคอย"
    },
    {
      front: "Throughput และ Latency มีความหมายและพฤติกรรมในไปป์ไลน์อย่างไร?",
      back: "Latency (ความหน่วง): เวลาในการประมวลผล 1 คำสั่งเดี่ยวตั้งแต่เริ่มจนเสร็จ (ไปป์ไลน์ไม่ได้ทำให้ Latency ลดลง แต่ละคำสั่งยังใช้เวลาเท่าเดิม)\nThroughput (อัตรางาน): จำนวนคำสั่งที่ทำเสร็จต่อหนึ่งหน่วยเวลา (ไปป์ไลน์ช่วยเพิ่ม Throughput อย่างมหาศาล เพราะปล่อยงานเสร็จใหม่ได้เกือบทุกรอบสัญญาณนาฬิกา)"
    },
    {
      front: "Single-cycle CPU กับ Pipeline CPU แตกต่างกันอย่างไรในเชิงสถาปัตยกรรม?",
      back: "Single-cycle CPU: ทำ 1 คำสั่งจบใน 1 รอบสัญญาณนาฬิกายาว รอบเวลาถูกกำหนดโดยสเตจที่ช้าที่สุด วงจรเข้าใจง่าย ไม่มี Hazards แต่ประสิทธิภาพต่ำ\nPipeline CPU: แบ่งเป็นหลายสเตจ แต่ละสเตจทำงานในรอบเวลาสั้นพร้อมกัน มี Throughput สูงมาก แต่วงจรซับซ้อนและมีโอกาสเกิด Hazards"
    },
    {
      front: "ลำดับ 5 สเตจมาตรฐานของสถาปัตยกรรม MIPS / RISC มีอะไรบ้าง?",
      back: "1. IF: Instruction Fetch (ดึงคำสั่งจากหน่วยความจำ)\n2. ID: Instruction Decode (ถอดรหัสคำสั่งและอ่านค่าจากรีจิสเตอร์)\n3. EX: Execute (ประมวลผลคำนวณทางคณิตศาสตร์/ตรรกะด้วย ALU หรือคำนวณแอดเดรส)\n4. MEM: Memory Access (เข้าถึงหน่วยความจำเพื่ออ่าน LOAD หรือเขียน STORE)\n5. WB: Write Back (เขียนผลลัพธ์กลับสู่รีจิสเตอร์ไฟล์)"
    },
    {
      front: "ในสเตจ IF (Instruction Fetch) มีหน้าที่และการทำงานหลักอย่างไร?",
      back: "หน้าที่: ดึงคำสั่งจาก Instruction Memory โดยใช้แอดเดรสที่ระบุใน Program Counter (PC)\nการทำงาน: นำคำสั่งมาพักไว้ในบัฟเฟอร์ IF/ID และบวกค่า PC เพิ่ม (PC + 4 ใน MIPS) เพื่อเตรียมดึงคำสั่งถัดไปในรอบถัดไป"
    },
    {
      front: "ในสเตจ ID (Instruction Decode) มีหน้าที่และการทำงานหลักอย่างไร?",
      back: "หน้าที่: ถอดรหัสคำสั่ง (Opcode) เพื่อระบุว่าเป็นคำสั่งชนิดใด และอ่านค่าตัวถูกดำเนินการ (Operands) จาก Register File ต้นทางที่คำสั่งระบุไว้ พร้อมเตรียมส่งต่อให้สเตจ EX"
    },
    {
      front: "ในสเตจ EX (Execute) มีหน้าที่และการทำงานหลักอย่างไร?",
      back: "หน้าที่: ดำเนินการประมวลผลด้วยหน่วย ALU (Arithmetic and Logic Unit)\n- ถ้าเป็นคำสั่งคณิตศาสตร์/ตรรกะ (เช่น ADD, SUB): ALU จะคำนวณผลลัพธ์\n- ถ้าเป็นคำสั่ง Memory (เช่น LOAD, STORE): ALU จะคำนวณตำแหน่ง Effective Address"
    },
    {
      front: "ในสเตจ MEM (Memory Access) มีหน้าที่และการทำงานหลักอย่างไร?",
      back: "หน้าที่: เข้าถึงหน่วยความจำข้อมูล (Data Memory)\n- คำสั่ง LOAD: อ่านข้อมูลจากหน่วยความจำ ณ แอดเดรสที่คำนวณได้จาก EX\n- คำสั่ง STORE: เขียนข้อมูลจากรีจิสเตอร์ลงสู่หน่วยความจำ ณ แอดเดรสที่คำนวณได้\n(หากเป็นคำสั่งทางคณิตศาสตร์ สเตจนี้จะเพียงส่งผ่านข้อมูลต่อไปยังสเตจ WB)"
    },
    {
      front: "ในสเตจ WB (Write Back) มีหน้าที่และการทำงานหลักอย่างไร?",
      back: "หน้าที่: บันทึกผลลัพธ์สุดท้ายของการประมวลผล (ค่าที่ได้จาก ALU ในสเตจ EX หรือค่าที่อ่านได้จาก Memory ในสเตจ MEM) เขียนบันทึกกลับลงสู่รีจิสเตอร์ปลายทางใน Register File เพื่อให้คำสั่งอื่นนำไปใช้ต่อไป"
    },
    {
      front: "Linear Pipeline (แบบเป็นลำดับ) กับ Non-linear Pipeline แตกต่างกันอย่างไร?",
      back: "Linear Pipeline: ข้อมูลไหลทิศทางเดียว (Unidirectional) จากสเตจแรกไปสเตจสุดท้าย ไม่มีการย้อนกลับหรือข้ามสเตจ ควบคุมง่าย ใช้ใน CPU ทั่วไป\nNon-linear Pipeline: มีวงจรย้อนกลับ (Feedback Loop) หรือหลายเส้นทาง สามารถคำนวณซ้ำหรือข้ามสเตจได้ นิยมใช้ในงาน DSP หรือ Adaptive Image Processing"
    },
    {
      front: "บัฟเฟอร์ระหว่างสเตจ (Pipeline Registers / Latches) มี 3 บทบาทสำคัญอย่างไร?",
      back: "1. Isolation: กั้นแยกไม่ให้ข้อมูลของสเตจก่อนหน้าไหลล้นไปปนกับสเตจถัดไปก่อนเวลาอันควร\n2. Synchronization: ส่งผ่านข้อมูลอย่างพร้อมเพรียงกันในจังหวะขอบสัญญาณนาฬิกา (Clock Edge)\n3. Holding State: กักเก็บสถานะ ตัวแปร และสัญญาณควบคุมของคำสั่งตลอดการเดินทาง"
    },
    {
      front: "สองแนวทางหลักในการเพิ่มประสิทธิภาพไปป์ไลน์ (Pipeline Optimization) คืออะไร?",
      back: "1. การเพิ่มจำนวนสเตจ (More Stages / Superpipelining): ซอยงานให้เล็กลง ลดรอบเวลา Clock Cycle Time ทำให้เร่งความถี่ CPU (GHz) และเพิ่ม Throughput ได้ (แต่แลกกับ Hazards สูงขึ้น)\n2. การลดระยะเวลาของแต่ละสเตจ (Reducing Stage Time): ใช้ฮาร์ดแวร์ความเร็วสูง (เช่น Fast ALU) ลดเวลาประมวลผลโดยตรง (แต่ต้นทุนและความร้อนสูงขึ้น)"
    },
    {
      front: "Pipeline Hazards คืออะไร และแบ่งออกเป็น 3 รูปแบบใดบ้าง?",
      back: "Pipeline Hazards คือ เหตุการณ์ที่ขัดขวางไม่ให้คำสั่งถัดไปเริ่มทำงานในรอบเวลาที่กำหนด ทำให้ไปป์ไลน์ต้องหยุดรอ (Stall) หรือล้างท่อ (Flush)\n1. Data Hazard: การพึ่งพาข้อมูลระหว่างคำสั่งที่ยังทำไม่เสร็จ\n2. Structural Hazard: ทรัพยากรฮาร์ดแวร์ไม่พอ ทำให้แย่งใช้งานพร้อมกัน\n3. Control Hazard: คำสั่งกระโดด/เงื่อนไขทำให้ทิศทางการไหลของโค้ดเปลี่ยนไป"
    },
    {
      front: "Data Hazard แบบ RAW (Read After Write) เกิดขึ้นเมื่อใด ยกตัวอย่าง?",
      back: "เกิดขึ้นเมื่อคำสั่งถัดไปพยายามอ่าน (Read) ข้อมูลจากรีจิสเตอร์ที่คำสั่งก่อนหน้ากำลังคำนวณและยังเขียน (Write) กลับไม่เสร็จ\nตัวอย่าง: ADD R1, R2, R3 (เขียน R1 ในรอบ WB) ตามด้วย SUB R4, R1, R5 (ต้องการอ่าน R1 ในรอบ ID) เปรียบเหมือนจะทำข้าวผัดไข่ แต่ไข่เจียวยังทอดไม่เสร็จ"
    },
    {
      front: "Structural Hazard เกิดขึ้นจากสาเหตุใด และมีวิธีแก้ไขพื้นฐานอย่างไร?",
      back: "สาเหตุ: ฮาร์ดแวร์มีจำกัด เช่น มีพอร์ตหน่วยความจำเพียงพอร์ตเดียว ทำให้คำสั่ง LOAD/STORE (สเตจ MEM) ชนกับคำสั่งดึงรหัสคำสั่ง (สเตจ IF) ในรอบเวลาเดียวกัน\nวิธีแก้ไข: การทำสำเนาทรัพยากร (Resource Replication) เช่น แยก Memory เป็น Instruction Memory และ Data Memory (Harvard Architecture) หรือเพิ่มพอร์ต"
    },
    {
      front: "Control Hazard เกิดจากอะไร และหากเดาทิศทางผิดจะเกิดผลกระทบใด?",
      back: "สาเหตุ: เกิดจากคำสั่งประเภท Branch/Jump (เช่น BEQZ) ซึ่งไปป์ไลน์ดึงคำสั่งถัดไปมาล่วงหน้า (Pre-fetch) โดยยังไม่รู้ผลเงื่อนไขที่แท้จริง\nผลกระทบ: หากการเดาผิดพลาด คำสั่งที่ดึงมาล่วงหน้าทั้งหมดจะต้องถูก 'ล้างทิ้ง' (Pipeline Flush) ออกจากไปป์ไลน์ ทำให้สูญเสียรอบเวลาไปโดยเปล่าประโยชน์"
    },
    {
      front: "เทคนิคการหยุดรอ (Stalling) หรือการแทรกฟองอากาศ (Bubble / NOP) คืออะไร?",
      back: "คือการแทรกคำสั่งว่างเปล่าที่ไม่มีการทำงาน (NOP: No Operation) เข้าไปในไปป์ไลน์ เพื่อถ่วงเวลาให้คำสั่งที่ต้องรอหยุดคอยจนกว่าคำสั่งก่อนหน้าจะเขียนข้อมูลลงรีจิสเตอร์เสร็จ\nข้อดี: ฮาร์ดแวร์เรียบง่าย ไม่ซับซ้อน\nข้อเสีย: สูญเสียรอบสัญญาณนาฬิกา (Stall Cycles) ทำให้ประสิทธิภาพลดลง"
    },
    {
      front: "เทคนิคการส่งต่อข้อมูล (Forwarding / Bypassing) ทำงานอย่างไร และมีข้อดีอย่างไร?",
      back: "การทำงาน: วงจรฮาร์ดแวร์จะดักจับผลลัพธ์ที่คำนวณเสร็จแล้วจากสเตจ EX หรือ MEM ส่งตรงผ่านสายสัญญาณบายพาสไปยังทางเข้าของ ALU ในสเตจ EX ของคำสั่งถัดไปทันที โดยไม่ต้องรอเขียนลง Register File ในสเตจ WB ก่อน\nข้อดี: กำจัดรอบการหยุดรอ (Stall Cycles) ได้เกือบ 100% ทำให้ประสิทธิภาพสูงมาก"
    },
    {
      front: "เทคนิค Branch Prediction ทำงานอย่างไร และการทำนายมีกี่ประเภท?",
      back: "การทำงาน: ระบบจะคาดเดาทิศทางล่วงหน้าว่าคำสั่งเงื่อนไขจะกระโดด (Taken) หรือไม่กระโดด (Not Taken) แล้วดึงคำสั่งทางนั้นมาทำทันที หากเดาถูกจะไม่มีการเสียเวลาเลย\nประเภท:\n- Static Prediction: ทำนายแบบคงที่ เช่น ไม่กระโดดเสมอ หรือลูปให้กระโดดกลับ\n- Dynamic Prediction: มีตารางประวัติ (Branch History Table) บันทึกพฤติกรรมในอดีตเพื่อทำนายอย่างแม่นยำ"
    },
    {
      front: "เทคนิค Instruction Reordering ของ Compiler ช่วยแก้ Data Hazard อย่างไร?",
      back: "คอมไพเลอร์จะตรวจจับคำสั่งที่เป็นอิสระต่อกัน (Independent Instructions) แล้วสลับตำแหน่งนำมาประมวลผลคั่นกลางระหว่างคำสั่งที่สร้างข้อมูลกับคำสั่งที่ใช้ข้อมูล เพื่อสร้างช่องว่างให้ข้อมูลพร้อมใช้งาน โดยที่ระบบไม่ต้องหยุดรอ (No Stall Cycles) และไม่ต้องเพิ่มต้นทุนฮาร์ดแวร์"
    },
    {
      front: "สูตรคำนวณเวลาประมวลผลของ Pipelined vs Non-pipelined และค่า Speedup?",
      back: "เมื่อมี n คำสั่ง และไปป์ไลน์มี k สเตจ:\n- Non-pipelined: T_seq = n × k รอบสัญญาณนาฬิกา\n- Pipelined: T_pipe = (k + n - 1) รอบสัญญาณนาฬิกา\n- Speedup = (n × k) / (k + n - 1)\n(เมื่อ n มีค่ามากมหาศาล อัตราเร่ง Speedup ในอุดมคติจะมีค่าเข้าใกล้ k เท่า ตามจำนวนสเตจ)"
    },
    {
      front: "เหตุใดในทางปฏิบัติ อัตราเร่ง (Speedup) ของไปป์ไลน์จึงไม่ถึง k เท่าตามทฤษฎี?",
      back: "1. Stage Imbalance: เวลาในการทำงานของแต่ละสเตจไม่เท่ากันอย่างสมบูรณ์ ทำให้สเตจที่เร็วกว่าต้องรอสเตจที่ช้ากว่า\n2. Register Overhead: ความล่าช้าสะสมของบัฟเฟอร์/แลตช์กั้นสเตจ (Setup time & Clock-to-Q)\n3. Pipeline Hazards: การเกิดการหยุดรอ (Stalls) และการล้างท่อคำสั่ง (Flushes) จากปัญหาข้อมูล โครงสร้าง และคำสั่งกระโดด"
    }
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

  const handleShuffle = () => {
    setIsFlipped(false);
    const randomIdx = Math.floor(Math.random() * cards.length);
    setCardIdx(randomIdx);
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>🎴 Flashcards ทบทวนความจำบทที่ 8: การทำงานแบบไปป์ลายน์</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}>
          คลิกที่การ์ดเพื่อพลิกดูเฉลยและการสรุปแนวคิดสำคัญ ({cardIdx + 1} / {cards.length})
        </p>
      </div>

      <div className="flashcard-wrapper" style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div 
          className="flashcard" 
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            cursor: 'pointer',
            minHeight: '260px',
            padding: '32px',
            background: isFlipped ? '#f8fafc' : '#ffffff',
            border: isFlipped ? '2px solid #6366f1' : '2px solid #e2e8f0',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.25s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span 
              className="card-side-tag" 
              style={{
                fontSize: '12px',
                fontWeight: '700',
                padding: '4px 12px',
                borderRadius: '999px',
                background: isFlipped ? '#e0e7ff' : '#f1f5f9',
                color: isFlipped ? '#4338ca' : '#475569'
              }}
            >
              {isFlipped ? '💡 คำอธิบายและสาระสำคัญ' : '❓ คำถาม / ประเด็นหลัก'}
            </span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8' }}>
              ข้อที่ {cardIdx + 1} จาก {cards.length}
            </span>
          </div>

          <div style={{ margin: '24px 0' }}>
            <h3 style={{ 
              fontSize: isFlipped ? '15.5px' : '18.5px', 
              color: isFlipped ? '#1e293b' : '#312e81', 
              fontWeight: isFlipped ? '500' : '700', 
              lineHeight: '1.7',
              whiteSpace: 'pre-line'
            }}>
              {isFlipped ? current.back : current.front}
            </h3>
          </div>

          <div style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={14} /> คลิกบนการ์ดเพื่อ {isFlipped ? 'กลับไปดูคำถาม' : 'พลิกดูคำตอบ'}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
          <button className="btn-secondary" onClick={handlePrev} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontWeight: '600' }}>
            <ArrowLeft size={16} /> การ์ดก่อนหน้า
          </button>

          <button className="btn-secondary" onClick={handleShuffle} title="สุ่มการ์ด" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontWeight: '600' }}>
            <Shuffle size={16} /> สุ่ม
          </button>

          <button className="btn-primary" onClick={handleNext} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: '#ffffff', cursor: 'pointer', fontWeight: '600' }}>
            การ์ดถัดไป <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
