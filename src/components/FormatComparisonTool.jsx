import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight, Zap, RefreshCw, Cpu, Layers } from 'lucide-react';

export default function FormatComparisonTool() {
  const [selectedHazard, setSelectedHazard] = useState('raw');
  const [resolutionMode, setResolutionMode] = useState('resolved'); // 'unresolved' or 'resolved'

  const hazards = {
    raw: {
      id: 'raw',
      title: 'Data Hazard: RAW (Read After Write)',
      badge: 'Data Hazard',
      badgeClass: 'data-hazard',
      codeSnippet: `I1: ADD R1, R2, R3    # R1 คำนวณเสร็จใน EX, บันทึกลง R1 ในสเตจ WB
I2: SUB R4, R1, R5    # ต้องการอ่านค่า R1 ในสเตจ ID เพื่อนำไปลบ`,
      cause: 'คำสั่ง I2 พยายามอ่านค่าจากรีจิสเตอร์ R1 ในสเตจ ID แต่คำสั่ง I1 ยังไม่ได้เขียนผลลัพธ์ลง R1 (จะเขียนในสเตจ WB)',
      unresolvedCycles: [
        { inst: "I1: ADD", stages: ["IF", "ID", "EX", "MEM", "WB", "-", "-"] },
        { inst: "I2: SUB", stages: ["-", "IF", "ID(รอ)", "Bubble", "Bubble", "EX", "MEM"] }
      ],
      resolvedCycles: [
        { inst: "I1: ADD", stages: ["IF", "ID", "EX (ALU ผลลัพธ์พร้อม)", "MEM", "WB"] },
        { inst: "I2: SUB", stages: ["-", "IF", "ID", "EX (รับ Forwarding)", "MEM"] }
      ],
      unresolvedDesc: 'หากไม่มี Forwarding คำสั่ง I2 จะต้องถูก Stall ในสเตจ ID และแทรก Bubble 2 รอบสัญญาณนาฬิกา จนกว่า I1 จะจบสเตจ WB',
      resolvedDesc: 'ใช้วงจร Forwarding (Bypassing) ดักจับผลลัพธ์จากปลายสเตจ EX ของ I1 แล้วส่งผ่านสายลัดไปยังอินพุตของสเตจ EX ของ I2 ทันที! ทำให้ไม่ต้อง Stall แม้แต่รอบเดียว',
      resolutionName: 'Forwarding / Bypassing (การส่งต่อข้อมูลทางลัด)'
    },
    loaduse: {
      id: 'loaduse',
      title: 'Load-Use Data Hazard (คำสั่ง LOAD ตามด้วยคำสั่งใช้ข้อมูล)',
      badge: 'Data Hazard',
      badgeClass: 'data-hazard',
      codeSnippet: `I1: LW  R1, 0(R2)     # โหลดข้อมูลจาก RAM เข้า R1 (ข้อมูลพร้อมหลังสเตจ MEM)
I2: ADD R3, R1, R4    # ต้องการนำค่า R1 ไปบวกทันทีในสเตจ EX`,
      cause: 'คำสั่ง LW จะได้ข้อมูลจริงจาก RAM หลังจากสิ้นสุดสเตจ MEM เท่านั้น ไม่สามารถ Forward ย้อนอดีตไปให้สเตจ EX ของ I2 ในรอบเดียวกันได้',
      unresolvedCycles: [
        { inst: "I1: LW",  stages: ["IF", "ID", "EX", "MEM", "WB", "-"] },
        { inst: "I2: ADD", stages: ["-", "IF", "ID(รอ)", "Bubble", "EX", "MEM"] }
      ],
      resolvedCycles: [
        { inst: "I1: LW",  stages: ["IF", "ID", "EX", "MEM (Data พร้อม)", "WB"] },
        { inst: "I2: ADD", stages: ["-", "IF", "ID", "Bubble (Stall 1 รอบ)", "EX (รับ Forward)"] }
      ],
      unresolvedDesc: 'หากไม่มีวงจร Forwarding คำสั่ง ADD จะต้องหยุดรอถึง 2 รอบสัญญาณนาฬิกาจนกว่า LW จะผ่านสเตจ WB',
      resolvedDesc: 'ฮาร์ดแวร์แทรก Stall (Bubble) 1 รอบในสเตจ EX เพื่อรอให้ LW จบสเตจ MEM จากนั้นจึง Forward ข้อมูลจาก MEM/WB ไปยังสเตจ EX ของ ADD ทันที (เสียเพียง 1 cycle)',
      resolutionName: 'Stall 1 Cycle + Forwarding จากสเตจ MEM'
    },
    structural: {
      id: 'structural',
      title: 'Structural Hazard: แย่งพอร์ตหน่วยความจำ (Single-Port Memory)',
      badge: 'Structural Hazard',
      badgeClass: 'structural-hazard',
      codeSnippet: `I1: LW R1, 100(R2)    # ในรอบที่ 4: สเตจ MEM กำลังอ่านข้อมูลจาก RAM
I4: ADD R5, R6, R7    # ในรอบที่ 4: สเตจ IF กำลังต้องการดึงคำสั่งจาก RAM เดียวกัน`,
      cause: 'สถาปัตยกรรมแบบ Von Neumann มีพอร์ตหน่วยความจำร่วมกันเพียงชุดเดียว ทำให้คำสั่ง I1 (อ่านข้อมูลใน MEM) ชนกับคำสั่ง I4 (ดึงคำสั่งใน IF) ในรอบที่ 4',
      unresolvedCycles: [
        { inst: "I1: LW",  stages: ["IF", "ID", "EX", "MEM (ใช้ RAM)", "WB"] },
        { inst: "I4: ADD", stages: ["-", "-", "-", "IF (ถูกชน! ต้อง Stall)", "IF จริง"] }
      ],
      resolvedCycles: [
        { inst: "I1: LW",  stages: ["IF", "ID", "EX", "MEM (เข้า Data Cache)", "WB"] },
        { inst: "I4: ADD", stages: ["-", "-", "-", "IF (เข้า Inst Cache)", "ID"] }
      ],
      unresolvedDesc: 'พอร์ตหน่วยความจำเดี่ยวไม่สามารถรองรับการอ่าน 2 จุดพร้อมกัน ทำให้คำสั่ง I4 ต้องหยุดรอ (Stall 1 รอบ) ให้ I1 ใช้พอร์ตเสร็จก่อน',
      resolvedDesc: 'ใช้สถาปัตยกรรมแบบ Harvard Architecture โดยแยกหน่วยความจำแคชออกเป็น Instruction Cache (I-Cache) และ Data Cache (D-Cache) ทำให้ IF และ MEM เข้าถึงได้พร้อมกัน 100%',
      resolutionName: 'Harvard Architecture (แยก I-Cache และ D-Cache)'
    },
    control: {
      id: 'control',
      title: 'Control Hazard: คำสั่งเงื่อนไขกระโดด (Branch Taken / Penalty)',
      badge: 'Control Hazard',
      badgeClass: 'control-hazard',
      codeSnippet: `I1: BEQZ R1, TARGET   # ตรวจสอบเงื่อนไขในสเตจ ID/EX (ผลลัพธ์: กระโดดจริง!)
I2: ADD  R2, R3, R4   # คำสั่งถัดไปถูก Pre-fetch เข้ามาใน IF
I3: SUB  R5, R6, R7   # คำสั่งถัดไปถูก Pre-fetch เข้ามาใน IF`,
      cause: 'ซีพียูดึงคำสั่ง I2 และ I3 เข้ามาล่วงหน้า (Pre-fetch) แต่เมื่อ I1 ประมวลผลเสร็จพบว่าเงื่อนไขเป็นจริง (Branch Taken) ต้องกระโดดไป TARGET ทำให้คำสั่ง I2 และ I3 กลายเป็นคำสั่งที่ผิด',
      unresolvedCycles: [
        { inst: "I1: BEQZ", stages: ["IF", "ID", "EX (ตัดสิน: กระโดด!)", "MEM", "WB"] },
        { inst: "I2: ADD",  stages: ["-", "IF", "ID (ล้างทิ้ง Flush!)", "-", "-"] },
        { inst: "TARGET",   stages: ["-", "-", "-", "IF (เริ่มดึงใหม่)", "ID"] }
      ],
      resolvedCycles: [
        { inst: "I1: BEQZ", stages: ["IF", "ID (ทำนาย: Taken)", "EX (ตรงตามที่ทาย)", "MEM", "WB"] },
        { inst: "TARGET",   stages: ["-", "IF (ดึงเป้าหมายทันที)", "ID", "EX", "MEM"] }
      ],
      unresolvedDesc: 'ไม่มีการทำนาย (เดาว่าไม่กระโดด) เมื่อกระโดดจริง คำสั่งที่ดึงเข้ามาใน IF และ ID ต้องถูก Flush ล้างทิ้งทั้งหมด เสียค่าปรับ (Penalty 2 รอบสัญญาณนาฬิกา)',
      resolvedDesc: 'ใช้วงจร Dynamic Branch Prediction ร่วมกับ Branch Target Buffer (BTB) คาดเดาว่าเงื่อนไขจะกระโดด (Taken) ทำให้ดึงคำสั่งที่ TARGET เข้ามาได้ตั้งแต่รอบที่ 2 โดยไม่เสียเวลาเลย!',
      resolutionName: 'Dynamic Branch Prediction + Branch Target Buffer'
    }
  };

  const current = hazards[selectedHazard];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      <div className="sim-container">
        <div className="sim-header">
          <span className="module-badge">HAZARD ANALYZER</span>
          <h2 style={{ marginTop: '8px', fontSize: '24px', fontWeight: '800' }}>
            เครื่องมือวิเคราะห์ Hazards และการแก้ปัญหา (Pipeline Hazard & Resolution Analyzer)
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '14.5px' }}>
            เจาะลึก 3 รูปแบบความเสี่ยงของไปป์ไลน์: Data Hazard, Structural Hazard, Control Hazard และเปรียบเทียบผลลัพธ์ก่อน-หลังแก้ไข
          </p>
        </div>

        {/* Hazard Scenario Selector Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '24px' }}>
          {Object.values(hazards).map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHazard(h.id)}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                border: selectedHazard === h.id ? '2px solid var(--indigo-primary)' : '1px solid var(--border-light)',
                background: selectedHazard === h.id ? '#eef2ff' : 'var(--bg-surface)',
                textAlign: 'left',
                boxShadow: selectedHazard === h.id ? 'var(--shadow-md)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span className={`hazard-card ${h.badgeClass}`} style={{ display: 'inline-block', padding: '2px 8px', fontSize: '11px', fontWeight: '700', borderRadius: '4px', margin: '0 0 6px 0', border: 'none' }}>
                {h.badge}
              </span>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: selectedHazard === h.id ? 'var(--indigo-primary)' : 'var(--text-primary)', lineHeight: '1.4' }}>
                {h.title}
              </div>
            </button>
          ))}
        </div>

        {/* Active Hazard Detail Header */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} color="#b45309" />
              {current.title}
            </h3>

            {/* Toggle Resolution Button */}
            <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: 'var(--radius-full)' }}>
              <button
                onClick={() => setResolutionMode('unresolved')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  background: resolutionMode === 'unresolved' ? 'var(--rose-danger)' : 'transparent',
                  color: resolutionMode === 'unresolved' ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                ⚠️ ก่อนแก้ (Unresolved / Stall)
              </button>
              <button
                onClick={() => setResolutionMode('resolved')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  background: resolutionMode === 'resolved' ? 'var(--emerald-success)' : 'transparent',
                  color: resolutionMode === 'resolved' ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                ✅ หลังแก้ ({current.resolutionName.split(' ')[0]})
              </button>
            </div>
          </div>

          {/* Code snippet & Cause breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                ตัวอย่างคำสั่งที่เกิดปัญหา:
              </div>
              <div className="code-block" style={{ margin: 0, padding: '12px 16px' }}>
                <pre style={{ margin: 0 }}>{current.codeSnippet}</pre>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#b45309', marginBottom: '6px' }}>
                สาเหตุของปัญหา (Root Cause):
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                {current.cause}
              </p>
            </div>
          </div>

          {/* Pipeline Timing Matrix for Current State */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={16} color="var(--indigo-primary)" />
              ผังการประมวลผลในไปป์ไลน์ ({resolutionMode === 'resolved' ? 'สภาวะหลังใช้เทคนิคแก้ไข' : 'สภาวะที่มีการหยุดชะงัก'}):
            </div>

            <div className="table-responsive" style={{ margin: '8px 0 16px 0' }}>
              <table className="modern-table">
                <thead>
                  <tr>
                    <th style={{ width: '180px' }}>คำสั่ง</th>
                    <th className="cell-center">Cycle 1</th>
                    <th className="cell-center">Cycle 2</th>
                    <th className="cell-center">Cycle 3</th>
                    <th className="cell-center">Cycle 4</th>
                    <th className="cell-center">Cycle 5</th>
                  </tr>
                </thead>
                <tbody>
                  {(resolutionMode === 'resolved' ? current.resolvedCycles : current.unresolvedCycles).map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{row.inst}</td>
                      {row.stages.slice(0, 5).map((st, sIdx) => {
                        let badgeBg = '#f1f5f9';
                        let badgeColor = '#475569';
                        if (st.includes('IF')) { badgeBg = '#e0f2fe'; badgeColor = '#0369a1'; }
                        else if (st.includes('ID')) { badgeBg = '#e0e7ff'; badgeColor = '#4338ca'; }
                        else if (st.includes('EX')) { badgeBg = '#fef3c7'; badgeColor = '#b45309'; }
                        else if (st.includes('MEM')) { badgeBg = '#ffe4e6'; badgeColor = '#be123c'; }
                        else if (st.includes('WB')) { badgeBg = '#d1fae5'; badgeColor = '#047857'; }
                        else if (st.includes('Bubble') || st.includes('รอ') || st.includes('Flush')) {
                          badgeBg = '#fee2e2'; badgeColor = '#991b1b';
                        }

                        return (
                          <td key={sIdx} className="cell-center">
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '700',
                                background: badgeBg,
                                color: badgeColor,
                                border: '1px solid rgba(0,0,0,0.06)'
                              }}
                            >
                              {st}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Status Description Callout */}
            <div
              className={`callout ${resolutionMode === 'resolved' ? 'callout-success' : 'callout-warning'}`}
              style={{ margin: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                {resolutionMode === 'resolved' ? (
                  <CheckCircle2 size={18} color="var(--emerald-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                ) : (
                  <AlertTriangle size={18} color="var(--amber-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                )}
                <div>
                  <strong>{resolutionMode === 'resolved' ? 'ผลลัพธ์การแก้ไขด้วย ' + current.resolutionName : 'ผลกระทบเมื่อไม่ได้รับการแก้ไข:'}</strong>
                  <p style={{ marginTop: '4px', fontSize: '13.5px', lineHeight: '1.5' }}>
                    {resolutionMode === 'resolved' ? current.resolvedDesc : current.unresolvedDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
