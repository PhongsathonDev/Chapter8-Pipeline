import React, { useState, useMemo } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Zap, ShieldAlert, Cpu } from 'lucide-react';

export default function CpuCycleSimulator() {
  const samplePrograms = [
    {
      id: 'ideal',
      name: '1. ชุดคำสั่งอิสระ (ไม่มี Hazard - ท่อไหลเต็ม 100%)',
      desc: 'คำสั่ง 5 คำสั่งที่ไม่พึ่งพาข้อมูลกัน ไหลผ่านไปป์ไลน์ 5 สเตจอย่างราบรื่น ได้ Throughput เกือบ 1 IPC',
      instructions: [
        { id: 'I1', text: 'ADD R1, R2, R3', type: 'ALU', dest: 'R1', src: ['R2', 'R3'] },
        { id: 'I2', text: 'SUB R4, R5, R6', type: 'ALU', dest: 'R4', src: ['R5', 'R6'] },
        { id: 'I3', text: 'AND R7, R8, R9', type: 'ALU', dest: 'R7', src: ['R8', 'R9'] },
        { id: 'I4', text: 'OR R10, R11, R12', type: 'ALU', dest: 'R10', src: ['R11', 'R12'] },
        { id: 'I5', text: 'XOR R13, R14, R15', type: 'ALU', dest: 'R13', src: ['R14', 'R15'] }
      ],
      mode: 'ideal'
    },
    {
      id: 'stall',
      name: '2. เกิด Data Hazard (ใช้การหยุดรอ Stalling / Bubble)',
      desc: 'I2 ต้องการใช้ R1 จาก I1 ทำให้ I2 ต้องหยุดรอ (Stall 2 รอบ) จนกว่า I1 จะเขียนค่ากลับลง Register File ในสเตจ WB',
      instructions: [
        { id: 'I1', text: 'ADD R1, R2, R3', type: 'ALU', dest: 'R1', src: ['R2', 'R3'] },
        { id: 'I2', text: 'SUB R4, R1, R5', type: 'ALU', dest: 'R4', src: ['R1', 'R5'] },
        { id: 'I3', text: 'AND R7, R8, R9', type: 'ALU', dest: 'R7', src: ['R8', 'R9'] },
        { id: 'I4', text: 'OR R10, R4, R12', type: 'ALU', dest: 'R10', src: ['R4', 'R12'] }
      ],
      mode: 'stall'
    },
    {
      id: 'forwarding',
      name: '3. เกิด Data Hazard (แก้ไขด้วยวงจรส่งต่อข้อมูล Forwarding)',
      desc: 'ใช้วงจรบายพาสดึงค่า R1 จากปลายสเตจ EX ของ I1 ส่งตรงเข้าสู่สเตจ EX ของ I2 ทันที โดยไม่ต้องแทรก Bubble!',
      instructions: [
        { id: 'I1', text: 'ADD R1, R2, R3', type: 'ALU', dest: 'R1', src: ['R2', 'R3'] },
        { id: 'I2', text: 'SUB R4, R1, R5', type: 'ALU', dest: 'R4', src: ['R1', 'R5'] },
        { id: 'I3', text: 'AND R7, R4, R9', type: 'ALU', dest: 'R7', src: ['R4', 'R9'] },
        { id: 'I4', text: 'OR R10, R7, R12', type: 'ALU', dest: 'R10', src: ['R7', 'R12'] }
      ],
      mode: 'forwarding'
    }
  ];

  const [selectedProgId, setSelectedProgId] = useState('ideal');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeProg = useMemo(() => {
    return samplePrograms.find(p => p.id === selectedProgId) || samplePrograms[0];
  }, [selectedProgId]);

  // Precompute pipeline matrix (Clock Cycles 1 to 12)
  const pipelineGrid = useMemo(() => {
    const insts = activeProg.instructions;
    const maxCycles = 10;
    // Map of instruction id -> array of { cycle, stage }
    const schedule = [];

    if (activeProg.mode === 'ideal') {
      insts.forEach((inst, idx) => {
        const start = idx + 1;
        const stages = ['IF', 'ID', 'EX', 'MEM', 'WB'];
        const row = { id: inst.id, text: inst.text, cells: {} };
        stages.forEach((stg, sIdx) => {
          row.cells[start + sIdx] = { stage: stg, isBubble: false };
        });
        schedule.push(row);
      });
    } else if (activeProg.mode === 'stall') {
      // I1: 1:IF, 2:ID, 3:EX, 4:MEM, 5:WB
      // I2: 2:IF, 3:ID, 4:Bubble, 5:Bubble, 6:EX, 7:MEM, 8:WB
      // I3: 3:IF, 4:Stall(IF), 5:Stall(IF), 6:ID, 7:EX, 8:MEM, 9:WB
      // I4: 7:IF, 8:Bubble, 9:Bubble, 10:ID, 11:EX
      schedule.push({
        id: 'I1', text: insts[0].text,
        cells: { 1: { stage: 'IF' }, 2: { stage: 'ID' }, 3: { stage: 'EX' }, 4: { stage: 'MEM' }, 5: { stage: 'WB' } }
      });
      schedule.push({
        id: 'I2', text: insts[1].text,
        cells: { 2: { stage: 'IF' }, 3: { stage: 'ID' }, 4: { stage: 'Bubble', isBubble: true }, 5: { stage: 'Bubble', isBubble: true }, 6: { stage: 'EX' }, 7: { stage: 'MEM' }, 8: { stage: 'WB' } }
      });
      schedule.push({
        id: 'I3', text: insts[2].text,
        cells: { 3: { stage: 'IF' }, 6: { stage: 'ID' }, 7: { stage: 'EX' }, 8: { stage: 'MEM' }, 9: { stage: 'WB' } }
      });
      schedule.push({
        id: 'I4', text: insts[3].text,
        cells: { 7: { stage: 'IF' }, 8: { stage: 'Bubble', isBubble: true }, 9: { stage: 'Bubble', isBubble: true }, 10: { stage: 'ID' } }
      });
    } else if (activeProg.mode === 'forwarding') {
      // With Forwarding, I2 does not need to stall! Forwarding happens EX -> EX!
      insts.forEach((inst, idx) => {
        const start = idx + 1;
        const stages = ['IF', 'ID', 'EX', 'MEM', 'WB'];
        const row = { id: inst.id, text: inst.text, cells: {} };
        stages.forEach((stg, sIdx) => {
          row.cells[start + sIdx] = { stage: stg, isForwarded: (idx > 0 && stg === 'EX') };
        });
        schedule.push(row);
      });
    }

    return { maxCycles, schedule };
  }, [activeProg]);

  // Handle Play Timer
  React.useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentCycle(prev => {
          if (prev >= pipelineGrid.maxCycles) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, pipelineGrid.maxCycles]);

  // Current active instructions in each stage
  const activeInStages = useMemo(() => {
    const result = { IF: null, ID: null, EX: null, MEM: null, WB: null, Bubbles: [] };
    pipelineGrid.schedule.forEach(row => {
      const cell = row.cells[currentCycle];
      if (cell) {
        if (cell.isBubble) {
          result.Bubbles.push(row.id);
        } else if (result[cell.stage] !== undefined) {
          result[cell.stage] = { id: row.id, text: row.text, isForwarded: cell.isForwarded };
        }
      }
    });
    return result;
  }, [pipelineGrid, currentCycle]);

  // Metrics
  const completedCount = useMemo(() => {
    let count = 0;
    pipelineGrid.schedule.forEach(row => {
      Object.entries(row.cells).forEach(([cyc, cell]) => {
        if (parseInt(cyc, 10) <= currentCycle && cell.stage === 'WB') {
          count++;
        }
      });
    });
    return count;
  }, [pipelineGrid, currentCycle]);

  const ipc = currentCycle > 0 ? (completedCount / currentCycle).toFixed(2) : '0.00';

  return (
    <div className="sim-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div className="sim-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Cpu size={28} color="#4f46e5" />
          <span>จำลองการทำงานแบบไปป์ไลน์ 5 สเตจ (5-Stage Pipeline Simulator)</span>
        </h2>
        <p style={{ color: '#64748b', fontSize: '14.5px', marginTop: '6px' }}>
          สำรวจการเคลื่อนที่ของคำสั่งผ่านสเตจ IF ➔ ID ➔ EX ➔ MEM ➔ WB และการจัดการปัญหา Hazards
        </p>
      </div>

      {/* Program Selector */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
          เลือกสถานการณ์จำลอง (Simulation Scenario):
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {samplePrograms.map(prog => (
            <button
              key={prog.id}
              onClick={() => {
                setSelectedProgId(prog.id);
                setCurrentCycle(1);
                setIsPlaying(false);
              }}
              style={{
                textAlign: 'left',
                padding: '14px 16px',
                borderRadius: '10px',
                border: selectedProgId === prog.id ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                background: selectedProgId === prog.id ? '#eef2ff' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '14px', color: selectedProgId === prog.id ? '#4338ca' : '#1e293b', marginBottom: '4px' }}>
                {prog.name}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                {prog.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Play Controls & Cycle Indicator */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setCurrentCycle(prev => Math.max(1, prev - 1))}
            disabled={currentCycle <= 1}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: currentCycle <= 1 ? '#f1f5f9' : '#ffffff', cursor: currentCycle <= 1 ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px', color: '#475569' }}
          >
            <ArrowLeft size={16} /> ย้อน 1 รอบ
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '8px', border: 'none', background: isPlaying ? '#ea580c' : '#4f46e5', color: '#ffffff', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? 'หยุดชั่วคราว' : 'เล่นอัตโนมัติ'}</span>
          </button>

          <button
            onClick={() => setCurrentCycle(prev => Math.min(pipelineGrid.maxCycles, prev + 1))}
            disabled={currentCycle >= pipelineGrid.maxCycles}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: currentCycle >= pipelineGrid.maxCycles ? '#f1f5f9' : '#ffffff', cursor: currentCycle >= pipelineGrid.maxCycles ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px', color: '#475569' }}
          >
            <span>ถัดไป 1 รอบ</span> <ArrowRight size={16} />
          </button>

          <button
            onClick={() => { setCurrentCycle(1); setIsPlaying(false); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: '13px', color: '#64748b' }}
          >
            <RotateCcw size={15} /> รีเซ็ต
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>รอบสัญญาณนาฬิกา</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#4f46e5' }}>Cycle {currentCycle} / {pipelineGrid.maxCycles}</div>
          </div>
          <div style={{ width: '1px', height: '36px', background: '#e2e8f0' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>คำสั่งเสร็จสิ้น</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#16a34a' }}>{completedCount} คำสั่ง</div>
          </div>
          <div style={{ width: '1px', height: '36px', background: '#e2e8f0' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Throughput (IPC)</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0284c7' }}>{ipc} IPC</div>
          </div>
        </div>
      </div>

      {/* Active Stages Visual Cards */}
      <div style={{ marginBottom: '28px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>สถานะของฮาร์ดแวร์ในแต่ละสเตจ ณ รอบ Clock Cycle ที่ {currentCycle}:</span>
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { stage: 'IF', name: 'Fetch (ดึงคำสั่ง)', icon: '📥', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
            { stage: 'ID', name: 'Decode (ถอดรหัส)', icon: '🧠', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
            { stage: 'EX', name: 'Execute (คำนวณ ALU)', icon: '➕', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
            { stage: 'MEM', name: 'Memory (หน่วยความจำ)', icon: '💾', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
            { stage: 'WB', name: 'Write Back (เขียนกลับ)', icon: '📝', color: '#e11d48', bg: '#fff1f2', border: '#fecdd3' }
          ].map(s => {
            const active = activeInStages[s.stage];
            return (
              <div
                key={s.stage}
                style={{
                  background: active ? s.bg : '#f8fafc',
                  border: active ? `2px solid ${s.color}` : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  transition: 'all 0.2s ease',
                  boxShadow: active ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: s.color, background: 'rgba(255,255,255,0.8)', padding: '2px 8px', borderRadius: '4px' }}>
                    {s.stage}
                  </span>
                  <span style={{ fontSize: '18px' }}>{s.icon}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>
                  {s.name}
                </div>
                {active ? (
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', fontFamily: 'JetBrains Mono, monospace' }}>
                      {active.id}: {active.text}
                    </div>
                    {active.isForwarded && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#15803d', fontWeight: '700', marginTop: '6px' }}>
                        <Zap size={13} /> รับค่า Forwarded!
                      </span>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
                    [ว่าง - ไม่มีคำสั่ง]
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {activeInStages.Bubbles.length > 0 && (
          <div style={{ marginTop: '12px', padding: '10px 16px', background: '#fffbeb', border: '1px solid #fef08a', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontSize: '13px', fontWeight: '600' }}>
            <AlertTriangle size={16} />
            <span>มี Bubble (ฟองอากาศหน่วงเวลา) แทรกอยู่ในไปป์ไลน์สำหรับคำสั่ง: {activeInStages.Bubbles.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Pipeline Schedule Matrix Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '14px' }}>
          ตารางเวลาไทม์ไลน์ของคำสั่งในแต่ละรอบสัญญาณนาฬิกา (Pipeline Timing Diagram):
        </h4>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'center' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', minWidth: '160px', color: '#334155' }}>คำสั่ง (Instruction)</th>
              {Array.from({ length: pipelineGrid.maxCycles }, (_, i) => i + 1).map(c => (
                <th
                  key={c}
                  style={{
                    padding: '8px 10px',
                    color: c === currentCycle ? '#4f46e5' : '#64748b',
                    background: c === currentCycle ? '#e0e7ff' : 'transparent',
                    fontWeight: c === currentCycle ? '800' : '600',
                    borderLeft: '1px solid #e2e8f0',
                    minWidth: '55px'
                  }}
                >
                  CC {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pipelineGrid.schedule.map(row => (
              <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '700', color: '#1e293b', fontFamily: 'JetBrains Mono, monospace' }}>
                  <span style={{ color: '#4f46e5', marginRight: '6px' }}>{row.id}:</span> {row.text}
                </td>
                {Array.from({ length: pipelineGrid.maxCycles }, (_, i) => i + 1).map(c => {
                  const cell = row.cells[c];
                  const isCurrent = c === currentCycle;
                  return (
                    <td
                      key={c}
                      style={{
                        padding: '8px 4px',
                        borderLeft: '1px solid #e2e8f0',
                        background: isCurrent ? '#f5f3ff' : 'transparent'
                      }}
                    >
                      {cell ? (
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: '700',
                            fontSize: '11px',
                            fontFamily: 'JetBrains Mono, monospace',
                            background: cell.isBubble
                              ? '#fef3c7'
                              : cell.stage === 'IF' ? '#e0f2fe'
                              : cell.stage === 'ID' ? '#fef3c7'
                              : cell.stage === 'EX' ? '#dcfce7'
                              : cell.stage === 'MEM' ? '#ede9fe'
                              : '#ffe4e6',
                            color: cell.isBubble
                              ? '#b45309'
                              : cell.stage === 'IF' ? '#0369a1'
                              : cell.stage === 'ID' ? '#b45309'
                              : cell.stage === 'EX' ? '#15803d'
                              : cell.stage === 'MEM' ? '#6d28d9'
                              : '#be123c',
                            border: isCurrent ? '2px solid #4f46e5' : '1px solid rgba(0,0,0,0.06)'
                          }}
                        >
                          {cell.isBubble ? '🫧 Stall' : cell.stage}
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
    </div>
  );
}
