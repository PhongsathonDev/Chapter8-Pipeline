import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft, CheckCircle2, Cpu, HardDrive, Zap, Info } from 'lucide-react';

export default function CpuCycleSimulator() {
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const instructions = [
    { id: 1, text: "I1: ADD R1, R2, R3", desc: "บวกค่า R2 กับ R3 แล้วเก็บลง R1" },
    { id: 2, text: "I2: SUB R4, R5, R6", desc: "ลบค่า R6 จาก R5 แล้วเก็บลง R4" },
    { id: 3, text: "I3: AND R7, R8, R9", desc: "AND บิต R8 กับ R9 แล้วเก็บลง R7" }
  ];

  // Pipeline stages: 1: IF, 2: ID, 3: EX, 4: MEM, 5: WB
  const stages = [
    { code: "IF", name: "Instruction Fetch", badgeClass: "if", color: "#0284c7" },
    { code: "ID", name: "Instruction Decode", badgeClass: "id", color: "#4f46e5" },
    { code: "EX", name: "Execute / ALU", badgeClass: "ex", color: "#d97706" },
    { code: "MEM", name: "Memory Access", badgeClass: "mem", color: "#e11d48" },
    { code: "WB", name: "Write Back", badgeClass: "wb", color: "#059669" }
  ];

  // Pipeline grid matrix for 3 instructions across 7 cycles
  // instruction i starts at cycle i (1-indexed)
  const getStageForInst = (instIdx, cycle) => {
    const stageIdx = cycle - instIdx; // 1 to 5
    if (stageIdx >= 1 && stageIdx <= 5) {
      return stages[stageIdx - 1];
    }
    return null;
  };

  const cycleDetails = {
    1: {
      title: "Clock Cycle 1: เริ่มต้นป้อนคำสั่งแรกเข้าสู่ไปป์ไลน์",
      desc: "คำสั่ง I1 ถูกดึงจาก Instruction Memory ในสเตจ IF โดยใช้ค่าจาก PC ขณะที่สเตจอื่นๆ ยังคงว่างงาน",
      activeCount: 1,
      completedCount: 0,
      activeStages: [
        { stage: "IF", inst: "I1: ADD R1, R2, R3", action: "ดึงคำสั่ง ADD จาก Instruction Memory, คำนวณ PC = PC + 4" }
      ],
      buffers: {
        "IF/ID": "เก็บคำสั่ง [ADD R1, R2, R3] และค่า PC+4 เตรียมส่งให้สเตจ ID",
        "ID/EX": "ว่างงาน (ยังไม่มีคำสั่งส่งมอบ)",
        "EX/MEM": "ว่างงาน (ยังไม่มีผลลัพธ์การคำนวณ)",
        "MEM/WB": "ว่างงาน (ยังไม่มีข้อมูลเขียนกลับ)"
      }
    },
    2: {
      title: "Clock Cycle 2: เริ่มทำงานขนาน 2 คำสั่งพร้อมกัน",
      desc: "คำสั่ง I1 เคลื่อนที่เข้าสู่สเตจ ID เพื่อถอดรหัสและอ่าน Register ในเวลาเดียวกันคำสั่ง I2 เริ่มเข้าสู่สเตจ IF",
      activeCount: 2,
      completedCount: 0,
      activeStages: [
        { stage: "ID", inst: "I1: ADD R1, R2, R3", action: "ถอดรหัส OpCode ADD, อ่านค่าจาก R2 และ R3 ใน Register File" },
        { stage: "IF", inst: "I2: SUB R4, R5, R6", action: "ดึงคำสั่ง SUB จาก Instruction Memory, คำนวณ PC = PC + 4" }
      ],
      buffers: {
        "IF/ID": "เก็บคำสั่ง [SUB R4, R5, R6] เพื่อส่งให้สเตจ ID ในรอบถัดไป",
        "ID/EX": "เก็บค่าตัวถูกดำเนินการ R2, R3 และสัญญาณควบคุมสำหรับ ALU",
        "EX/MEM": "ว่างงาน",
        "MEM/WB": "ว่างงาน"
      }
    },
    3: {
      title: "Clock Cycle 3: ทำงานขนานพร้อมกัน 3 คำสั่งใน 3 สเตจ!",
      desc: "คำสั่ง I1 กำลังคำนวณใน EX, คำสั่ง I2 กำลังถอดรหัสใน ID, และคำสั่ง I3 กำลังถูกดึงเข้ามาใน IF",
      activeCount: 3,
      completedCount: 0,
      activeStages: [
        { stage: "EX", inst: "I1: ADD R1, R2, R3", action: "ALU ดำเนินการบวกค่า (R2 + R3) ได้ผลลัพธ์ชั่วคราว" },
        { stage: "ID", inst: "I2: SUB R4, R5, R6", action: "ถอดรหัส OpCode SUB, อ่านค่าจาก R5 และ R6" },
        { stage: "IF", inst: "I3: AND R7, R8, R9", action: "ดึงคำสั่ง AND จาก Instruction Memory, คำนวณ PC = PC + 4" }
      ],
      buffers: {
        "IF/ID": "เก็บคำสั่ง [AND R7, R8, R9] เตรียมส่งต่อสเตจ ID",
        "ID/EX": "เก็บค่าตัวถูกดำเนินการ R5, R6 เตรียมคำนวณใน ALU",
        "EX/MEM": "เก็บผลลัพธ์ ALU ของคำสั่ง I1 และส่งต่อสัญญาณควบคุม",
        "MEM/WB": "ว่างงาน"
      }
    },
    4: {
      title: "Clock Cycle 4: คำสั่ง I1 เข้าสู่สเตจหน่วยความจำ",
      desc: "คำสั่ง I1 อยู่ใน MEM (ส่งผ่านไป WB เนื่องจากไม่ต้องเข้าถึงแรม), คำสั่ง I2 อยู่ใน EX กำลังลบค่า, คำสั่ง I3 อยู่ใน ID",
      activeCount: 3,
      completedCount: 0,
      activeStages: [
        { stage: "MEM", inst: "I1: ADD R1, R2, R3", action: "คำสั่ง ADD ไม่มีการอ่านเขียนแรม จึงส่งผ่านผลลัพธ์ไปยัง WB" },
        { stage: "EX", inst: "I2: SUB R4, R5, R6", action: "ALU คำนวณการลบ (R5 - R6) ได้ผลลัพธ์ชั่วคราว" },
        { stage: "ID", inst: "I3: AND R7, R8, R9", action: "ถอดรหัส OpCode AND, อ่านค่าจาก R8 และ R9" }
      ],
      buffers: {
        "IF/ID": "ว่างงาน (ดึงคำสั่งหมดแล้ว)",
        "ID/EX": "เก็บค่า R8, R9 เพื่อเตรียมประมวลผลตรรกะในรอบถัดไป",
        "EX/MEM": "เก็บผลลัพธ์การลบของคำสั่ง I2",
        "MEM/WB": "เก็บผลลัพธ์บวกของคำสั่ง I1 พร้อมหมายเลขรีจิสเตอร์ปลายทาง R1"
      }
    },
    5: {
      title: "Clock Cycle 5: คำสั่งแรก (I1) เสร็จสิ้นสมบูรณ์ 100%!",
      desc: "คำสั่ง I1 ทำการ Write Back เขียนผลลัพธ์ลง R1 เสร็จสิ้น, คำสั่ง I2 อยู่ใน MEM, คำสั่ง I3 อยู่ใน EX",
      activeCount: 3,
      completedCount: 1,
      activeStages: [
        { stage: "WB", inst: "I1: ADD R1, R2, R3", action: "เขียนผลลัพธ์ ALU กลับลงรีจิสเตอร์ R1 ใน Register File (เสร็จสมบูรณ์!)" },
        { stage: "MEM", inst: "I2: SUB R4, R5, R6", action: "ส่งผ่านผลลัพธ์ไปยังสเตจถัดไป" },
        { stage: "EX", inst: "I3: AND R7, R8, R9", action: "ALU ทำการเปรียบเทียบตรรกะบิต (R8 AND R9)" }
      ],
      buffers: {
        "IF/ID": "ว่างงาน",
        "ID/EX": "ว่างงาน",
        "EX/MEM": "เก็บผลลัพธ์ AND ของคำสั่ง I3",
        "MEM/WB": "เก็บผลลัพธ์ลบของ I2 เตรียมเขียนลง R4"
      }
    },
    6: {
      title: "Clock Cycle 6: คำสั่งที่ 2 (I2) เสร็จสิ้นตามมาอย่างต่อเนื่อง!",
      desc: "คำสั่ง I2 เขียนผลลัพธ์ลง R4 ใน WB, คำสั่ง I3 อยู่ใน MEM พร้อมจะเสร็จในรอบถัดไป",
      activeCount: 2,
      completedCount: 2,
      activeStages: [
        { stage: "WB", inst: "I2: SUB R4, R5, R6", action: "เขียนผลลัพธ์การลบกลับลงรีจิสเตอร์ R4 ใน Register File (เสร็จสมบูรณ์!)" },
        { stage: "MEM", inst: "I3: AND R7, R8, R9", action: "ส่งผ่านผลลัพธ์ AND เตรียมส่งมอบให้สเตจ WB" }
      ],
      buffers: {
        "IF/ID": "ว่างงาน",
        "ID/EX": "ว่างงาน",
        "EX/MEM": "ว่างงาน",
        "MEM/WB": "เก็บผลลัพธ์ AND เตรียมเขียนลง R7"
      }
    },
    7: {
      title: "Clock Cycle 7: คำสั่งที่ 3 (I3) เสร็จสิ้น ครบทั้ง 3 คำสั่ง!",
      desc: "คำสั่ง I3 เขียนผลลัพธ์ลง R7 ใน WB สิ้นสุดการประมวลผลทั้ง 3 คำสั่งโดยใช้เวลารวมเพียง 7 รอบสัญญาณนาฬิกา",
      activeCount: 1,
      completedCount: 3,
      activeStages: [
        { stage: "WB", inst: "I3: AND R7, R8, R9", action: "เขียนผลลัพธ์กลับลงรีจิสเตอร์ R7 ใน Register File (เสร็จสมบูรณ์ทั้งหมด!)" }
      ],
      buffers: {
        "IF/ID": "ว่างงาน",
        "ID/EX": "ว่างงาน",
        "EX/MEM": "ว่างงาน",
        "MEM/WB": "เขียนเสร็จเรียบร้อย ไปป์ไลน์พร้อมรับคำสั่งชุดใหม่"
      }
    }
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentCycle(prev => {
          if (prev >= 7) {
            setIsPlaying(false);
            return 7;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentInfo = cycleDetails[currentCycle] || cycleDetails[1];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      <div className="sim-container">
        <div className="sim-header">
          <span className="module-badge">INTERACTIVE SIMULATOR</span>
          <h2 style={{ marginTop: '8px', fontSize: '24px', fontWeight: '800' }}>
            จำลองการทำงานไปป์ไลน์ 5 สเตจ (5-Stage Pipeline Cycle Simulator)
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '14.5px' }}>
            ทดลองจำลองลำดับสัญญาณนาฬิกา (Clock Cycle 1-7) เพื่อสังเกตการประมวลผลคำสั่งแบบขนานและการส่งต่อข้อมูลผ่านบัฟเฟอร์
          </p>
        </div>

        {/* Control Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', margin: '20px 0', flexWrap: 'wrap' }}>
          <button
            className="btn-secondary"
            disabled={currentCycle === 1}
            onClick={() => setCurrentCycle(prev => Math.max(1, prev - 1))}
            style={{ opacity: currentCycle === 1 ? 0.5 : 1 }}
          >
            <ArrowLeft size={16} /> รอบก่อนหน้า
          </button>

          <button
            className="btn-primary"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ minWidth: '140px' }}
          >
            {isPlaying ? <><Pause size={16} /> หยุดชั่วคราว</> : <><Play size={16} /> เล่นอัตโนมัติ</>}
          </button>

          <button
            className="btn-secondary"
            disabled={currentCycle === 7}
            onClick={() => setCurrentCycle(prev => Math.min(7, prev + 1))}
            style={{ opacity: currentCycle === 7 ? 0.5 : 1 }}
          >
            รอบถัดไป <ArrowRight size={16} />
          </button>

          <button
            className="btn-secondary"
            onClick={() => { setCurrentCycle(1); setIsPlaying(false); }}
            title="รีเซ็ตกลับไปรอบที่ 1"
          >
            <RotateCcw size={16} /> รีเซ็ต
          </button>
        </div>

        {/* Cycle Selector Buttons (1 to 7) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5, 6, 7].map(c => (
            <button
              key={c}
              onClick={() => { setCurrentCycle(c); setIsPlaying(false); }}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: '700',
                border: currentCycle === c ? '2px solid var(--indigo-primary)' : '1px solid var(--border-light)',
                background: currentCycle === c ? 'var(--indigo-primary)' : 'var(--bg-surface)',
                color: currentCycle === c ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: currentCycle === c ? '0 2px 8px rgba(79, 70, 229, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Cycle {c}
            </button>
          ))}
        </div>

        {/* Pipeline Timing Matrix Visualizer */}
        <div className="table-responsive" style={{ margin: '0 0 24px 0' }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th style={{ width: '220px' }}>คำสั่ง (Instruction)</th>
                {[1, 2, 3, 4, 5, 6, 7].map(c => (
                  <th
                    key={c}
                    className="cell-center"
                    style={{
                      background: currentCycle === c ? '#e0e7ff' : '#f8fafc',
                      color: currentCycle === c ? '#3730a3' : 'var(--text-primary)',
                      borderBottom: currentCycle === c ? '3px solid var(--indigo-primary)' : '2px solid var(--border-light)'
                    }}
                  >
                    Cycle {c} {currentCycle === c && '📍'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {instructions.map((inst, iIdx) => (
                <tr key={inst.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '13.5px' }}>{inst.text}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{inst.desc}</div>
                  </td>
                  {[1, 2, 3, 4, 5, 6, 7].map(c => {
                    const st = getStageForInst(iIdx + 1, c);
                    const isCurrentActive = currentCycle === c && st !== null;
                    return (
                      <td
                        key={c}
                        className="cell-center"
                        style={{
                          background: currentCycle === c ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                          transition: 'background 0.3s ease'
                        }}
                      >
                        {st ? (
                          <span
                            className={`stage-badge ${st.badgeClass}`}
                            style={{
                              transform: isCurrentActive ? 'scale(1.15)' : 'scale(1)',
                              boxShadow: isCurrentActive ? '0 0 10px rgba(79, 70, 229, 0.4)' : 'none',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {st.code}
                          </span>
                        ) : (
                          <span style={{ color: '#cbd5e1' }}>-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Current Cycle Details Box */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="step-number-badge" style={{ fontSize: '14px' }}>รอบที่ {currentCycle} จาก 7</span>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                {currentInfo.title}
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '12.5px', background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '4px', fontWeight: '600' }}>
                ทำงานพร้อมกัน: {currentInfo.activeCount} คำสั่ง
              </span>
              <span style={{ fontSize: '12.5px', background: '#e0e7ff', color: '#3730a3', padding: '4px 10px', borderRadius: '4px', fontWeight: '600' }}>
                สำเร็จแล้ว: {currentInfo.completedCount} / 3 คำสั่ง
              </span>
            </div>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
            {currentInfo.desc}
          </p>

          {/* Active Stages Breakdown */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={15} color="var(--indigo-primary)" />
              การทำงานในสเตจต่างๆ ณ รอบนี้:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {currentInfo.activeStages.map((act, aIdx) => (
                <div key={aIdx} style={{ background: '#f8fafc', border: '1px solid var(--border-light)', padding: '10px 14px', borderRadius: '6px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className={`stage-badge ${act.stage.toLowerCase()}`}>{act.stage}</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{act.inst}</strong>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>{act.action}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Registers / Latches State */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={15} color="var(--purple-accent)" />
              สถานะบัฟเฟอร์กั้นระหว่างขั้นตอน (Pipeline Latches):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
              {Object.entries(currentInfo.buffers).map(([bufName, bufState]) => (
                <div key={bufName} style={{ background: '#faf5ff', border: '1px solid #e9d5ff', padding: '8px 12px', borderRadius: '6px', fontSize: '12.5px' }}>
                  <span style={{ fontWeight: '700', color: '#6b21a8' }}>{bufName}: </span>
                  <span style={{ color: '#4c1d95' }}>{bufState}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Callout */}
        <div className="callout callout-info" style={{ margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Info size={20} color="var(--sky-info)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>การเปรียบเทียบประสิทธิภาพ:</strong> หากรัน 3 คำสั่งนี้แบบ <em>ไม่ใช้ไปป์ไลน์ (Sequential)</em> จะต้องใช้เวลาถึง <strong>15 รอบสัญญาณนาฬิกา</strong> (3 คำสั่ง x 5 สเตจ) แต่เมื่อใช้ <em>ไปป์ไลน์ (Pipeline)</em> งานทั้ง 3 คำสั่งจะเสร็จสมบูรณ์ในเวลาเพียง <strong>7 รอบสัญญาณนาฬิกา</strong> ประหยัดเวลาไปได้มากกว่าครึ่งหนึ่ง!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
