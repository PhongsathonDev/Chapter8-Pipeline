import React, { useState } from 'react';
import { Sliders, Cpu, Zap, ArrowRight, Check, X, ShieldAlert, GitCommit } from 'lucide-react';

export default function FormatComparisonTool() {
  const [selectedCategory, setSelectedCategory] = useState('single-vs-pipeline');

  const comparisonData = {
    'single-vs-pipeline': {
      title: "เปรียบเทียบสถาปัตยกรรม CPU: Single-Cycle CPU vs 5-Stage Pipeline CPU",
      subtitle: "ความแตกต่างระหว่างการประมวลผล 1 คำสั่งต่อรอบยาว กับการแบ่งงาน 5 สเตจคู่ขนาน",
      cards: [
        {
          name: "Single-Cycle CPU (แบบไม่ใช้ไปป์ไลน์)",
          tag: "ง่าย / ประสิทธิภาพต่ำ",
          badgeColor: "#d97706",
          features: [
            { label: "วงรอบคำสั่ง", val: "ทุกขั้นตอน (Fetch-Decode-Ex-Mem-WB) จบใน 1 Clock Cycle" },
            { label: "ความยาวรอบนาฬิกา", val: "ยาวมาก (ถูกกำหนดโดยขั้นตอนที่ช้าที่สุด เช่น Memory)" },
            { label: "จำนวนคำสั่งพร้อมกัน", val: "1 คำสั่งเท่านั้น ไม่มีคำสั่งอื่นทำงานซ้อนทับ" },
            { label: "ปัญหา Pipeline Hazards", val: "ไม่มี Hazards ใดๆ เกิดขึ้นในระบบอย่างแน่นอน" },
            { label: "Throughput สูงสุด", val: "ต่ำมาก (ความถี่ CPU ต่ำมาก)" },
            { label: "อุปมาอุปไมย", val: "คนล้างจาน 1 คน ทำล้าง-เช็ด-เก็บ ให้เสร็จก่อนหยิบใบถัดไป" }
          ],
          pros: [
            "โครงสร้างวงจรควบคุมเรียบง่าย เข้าใจง่ายและสร้างง่าย",
            "ไม่ต้องมีวงจรตรวจจับ Hazards หรือวงจร Forwarding",
            "ไม่มีความล่าช้าสะสมจากแลตช์คั่นระหว่างสเตจ (No Latch Overhead)"
          ],
          cons: [
            "ความเร็วสัญญาณนาฬิกาต่ำมาก (Critical Path ยาว)",
            "ประสิทธิภาพ Throughput ต่ำมาก",
            "หน่วยประมวลผลส่วนใหญ่ว่างงานเฉยๆ ในขณะที่รอสเตจที่ช้าที่สุด"
          ]
        },
        {
          name: "5-Stage Pipeline CPU (แบบใช้ไปป์ไลน์)",
          tag: "คู่ขนาน / Throughput สูง",
          badgeColor: "#4f46e5",
          features: [
            { label: "วงรอบคำสั่ง", val: "แบ่งเป็น 5 สเตจ (IF, ID, EX, MEM, WB) กั้นด้วยแลตช์" },
            { label: "ความยาวรอบนาฬิกา", val: "สั้นมาก (เท่ากับเวลาของสเตจย่อยเพียงสเตจเดียว)" },
            { label: "จำนวนคำสั่งพร้อมกัน", val: "มากถึง 5 คำสั่งกำลังประมวลผลในขั้นตอนต่างกัน" },
            { label: "ปัญหา Pipeline Hazards", val: "มี Hazards (Data, Structural, Control) ที่ต้องจัดการ" },
            { label: "Throughput สูงสุด", val: "สูงมาก (เข้าใกล้ 1 คำสั่งต่อรอบ หรือ 1 IPC ในทางทฤษฎี)" },
            { label: "อุปมาอุปไมย", val: "คนล้างจาน 3 คน แบ่งหน้าที่ล้าง เช็ด เก็บ ส่งต่องานต่อเนื่อง" }
          ],
          pros: [
            "Throughput สูงกว่าแบบ Single-cycle หลายเท่าตัว",
            "สามารถเพิ่มความถี่สัญญาณนาฬิกา (Clock Speed / GHz) ได้สูงมาก",
            "ทรัพยากรทุกชิ้นใน CPU ทำงานคุ้มค่าเกือบตลอดเวลา"
          ],
          cons: [
            "โครงสร้างวงจรควบคุมซับซ้อนขึ้นมาก",
            "เกิดปัญหา Hazards ทำให้ต้องมีการ Stall, Forward หรือ Flush",
            "เวลาของคำสั่งเดี่ยว (Latency) เท่าเดิมหรือเพิ่มขึ้นเล็กน้อยจากแลตช์"
          ]
        }
      ]
    },
    'linear-vs-nonlinear': {
      title: "เปรียบเทียบประเภทไปป์ไลน์: Linear Pipeline vs Non-Linear Pipeline",
      subtitle: "ความแตกต่างระหว่างท่อตรงทิศทางเดียว กับท่อที่มี Feedback Loop และหลายเส้นทาง",
      cards: [
        {
          name: "Linear Pipeline (แบบเป็นลำดับ)",
          tag: "ทิศทางเดียว / CPU ทั่วไป",
          badgeColor: "#0284c7",
          features: [
            { label: "ทิศทางการไหล", val: "ไหลไปข้างหน้าทิศทางเดียว (Unidirectional Flow) เป็นเส้นตรง" },
            { label: "การใช้สเตจซ้ำ", val: "แต่ละสเตจถูกใช้งานเพียง 1 ครั้งต่อ 1 คำสั่ง ไม่มีการวนกลับ" },
            { label: "การควบคุมจังหวะ", val: "เรียบง่ายและเป็นจังหวะสัญญาณนาฬิกาแน่นอน (Fixed Timing)" },
            { label: "ความซับซ้อนของวงจร", val: "ต่ำ จัดการง่าย ไม่ต้องมี Reservation Table ควบคุม" },
            { label: "การนำไปใช้งาน", val: "สถาปัตยกรรม CPU ทั่วไป เช่น MIPS, RISC-V, ARM, Intel Core" }
          ],
          pros: [
            "ออกแบบและสร้างวงจรควบคุมได้ง่าย",
            "ทำนายเวลาและลำดับการประมวลผลได้แน่นอน (Deterministic)",
            "เหมาะอย่างยิ่งสำหรับชุดคำสั่งมาตรฐานของคอมพิวเตอร์"
          ],
          cons: [
            "ขาดความยืดหยุ่นสำหรับงานคำนวณที่ต้องทำซ้ำหลายรอบ",
            "คำสั่งที่ต้องการข้ามขั้นตอนยังต้องไหลผ่านสเตจนั้นไปโดยเปล่าประโยชน์"
          ]
        },
        {
          name: "Non-Linear Pipeline (แบบไม่เป็นลำดับ)",
          tag: "ยืดหยุ่นสูง / DSP & สื่อผสม",
          badgeColor: "#7c3aed",
          features: [
            { label: "ทิศทางการไหล", val: "มีวงจรย้อนกลับ (Feedback Loops) และหลายเส้นทางขนาน" },
            { label: "การใช้สเตจซ้ำ", val: "สเตจเดิมสามารถถูกเรียกประมวลผลซ้ำได้หลายรอบใน 1 คำสั่ง" },
            { label: "การควบคุมจังหวะ", val: "ซับซ้อนมาก ต้องมี Reservation Table และตารางจองฮาร์ดแวร์" },
            { label: "ความซับซ้อนของวงจร", val: "สูงมาก มีวงจรสวิตช์และมัลติเพล็กเซอร์ควบคุมเส้นทาง" },
            { label: "การนำไปใช้งาน", val: "ชิปประมวลผลสัญญาณดิจิทัล (DSP), Adaptive Image Processing" }
          ],
          pros: [
            "มีความยืดหยุ่นสูงมาก รองรับงานคำนวณแบบพลวัต (Dynamic)",
            "ประหยัดพื้นที่ฮาร์ดแวร์โดยใช้สเตจคำนวณเดิมวนซ้ำได้",
            "มีประสิทธิภาพสูงมากสำหรับอัลกอริทึมทางคณิตศาสตร์เฉพาะทาง"
          ],
          cons: [
            "วงจรควบคุมและการจัดลำดับเวลาซับซ้อนมาก",
            "เสี่ยงต่อการเกิดการชนกันของคำสั่งในสเตจ (Internal Collisions)"
          ]
        }
      ]
    },
    'stalling-vs-forwarding': {
      title: "เปรียบเทียบเทคนิคแก้ Data Hazard: Stalling (Bubble) vs Forwarding (Bypassing)",
      subtitle: "การหน่วงเวลาคำสั่งด้วย NOP แลกกับความง่าย เทียบกับการเดินสายฮาร์ดแวร์ลัดวงจร",
      cards: [
        {
          name: "Stalling / Bubble (การหยุดรอ)",
          tag: "ง่าย / เสียรอบเวลา",
          badgeColor: "#dc2626",
          features: [
            { label: "กลไกการทำงาน", val: "แทรกคำสั่งว่าง (NOP/Bubble) หน่วงเวลาคำสั่งที่ต้องรอ" },
            { label: "ความต้องการฮาร์ดแวร์", val: "ต่ำมาก ไม่ต้องเพิ่มสายสัญญาณส่งต่อข้อมูลพิเศษ" },
            { label: "ผลต่อ Clock Cycles", val: "สูญเสีย 1-2 รอบสัญญาณนาฬิกา (Stall Penalty) ต่อ Hazard" },
            { label: "ผลกระทบต่อ Throughput", val: "ทำให้ Throughput และความเร็วโดยรวมลดลงอย่างเห็นได้ชัด" },
            { label: "การนำไปใช้", val: "กรณี Load-Use Data Hazard ที่หลีกเลี่ยงไม่ได้ หรือ CPU พื้นฐาน" }
          ],
          pros: [
            "ฮาร์ดแวร์เรียบง่าย ไม่เพิ่มขนาดพื้นที่ชิปหรือสายสัญญาณ",
            "ไม่เพิ่มความซับซ้อนในการคำนวณ Critical Path ของ ALU"
          ],
          cons: [
            "สูญเสียรอบสัญญาณนาฬิกาไปกับการรอคอยโดยเปล่าประโยชน์",
            "ทำให้ค่าเฉลี่ย Cycles Per Instruction (CPI) สูงขึ้น"
          ]
        },
        {
          name: "Forwarding / Bypassing (การส่งต่อข้อมูล)",
          tag: "เร็วที่สุด / ฮาร์ดแวร์ซับซ้อน",
          badgeColor: "#059669",
          features: [
            { label: "กลไกการทำงาน", val: "ดึงผลลัพธ์จากปลายสเตจ EX/MEM ส่งตรงเข้าทางเข้า ALU ทันที" },
            { label: "ความต้องการฮาร์ดแวร์", val: "สูง ต้องเพิ่มวงจร Bypass MUX และสาย Bus เชื่อมต่อพิเศษ" },
            { label: "ผลต่อ Clock Cycles", val: "กำจัดรอบการหยุดรอได้ 100% สำหรับคำสั่งประเภท ALU" },
            { label: "ผลกระทบต่อ Throughput", val: "รักษา Throughput ให้อยู่ในระดับสูงสุดใกล้เคียง 1 IPC" },
            { label: "การนำไปใช้", val: "หน่วยประมวลผล RISC, MIPS, ARM, x86 ยุคใหม่ทุกรุ่น" }
          ],
          pros: [
            "ประสิทธิภาพการประมวลผลสูงสุด ไม่มีการเสียรอบการรอ",
            "คำสั่งถัดไปสามารถเริ่มคำนวณได้ทันทีโดยไม่ต้องรอเขียน Register File"
          ],
          cons: [
            "เพิ่มขนาดพื้นที่ซิลิคอนและการใช้พลังงานไฟฟ้าในชิป",
            "วงจรมัลติเพล็กเซอร์หน้า ALU อาจเพิ่มความหน่วงของสเตจ EX เล็กน้อย"
          ]
        }
      ]
    }
  };

  const activeCategory = comparisonData[selectedCategory];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Sliders size={28} color="#4f46e5" />
          <span>เครื่องมือเปรียบเทียบสถาปัตยกรรมและเทคโนโลยีไปป์ไลน์ (Pipeline Comparison Tool)</span>
        </h2>
        <p style={{ color: '#64748b', fontSize: '14.5px', marginTop: '6px' }}>
          เปรียบเทียบความแตกต่าง จุดเด่น จุดด้อย และการประยุกต์ใช้งานในระบบสถาปัตยกรรมคอมพิวเตอร์
        </p>
      </div>

      {/* Category Selection Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '28px' }}>
        {[
          { id: 'single-vs-pipeline', label: 'Single-Cycle vs Pipeline CPU' },
          { id: 'linear-vs-nonlinear', label: 'Linear vs Non-Linear Pipeline' },
          { id: 'stalling-vs-forwarding', label: 'Stalling (Bubble) vs Forwarding' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              border: selectedCategory === cat.id ? '2px solid #4f46e5' : '1px solid #cbd5e1',
              background: selectedCategory === cat.id ? '#4f46e5' : '#ffffff',
              color: selectedCategory === cat.id ? '#ffffff' : '#475569',
              boxShadow: selectedCategory === cat.id ? '0 4px 12px rgba(79, 70, 229, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Comparison Header */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#1e293b' }}>{activeCategory.title}</h3>
        <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>{activeCategory.subtitle}</p>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {activeCategory.cards.map((card, cIdx) => (
          <div
            key={cIdx}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Card Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#faf5ff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: card.badgeColor, background: '#ffffff', padding: '3px 10px', borderRadius: '999px', border: `1px solid ${card.badgeColor}40` }}>
                  {card.tag}
                </span>
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>{card.name}</h4>
            </div>

            {/* Feature List */}
            <div style={{ padding: '20px 24px', flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                คุณลักษณะทางสถาปัตยกรรม (Architectural Features):
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {card.features.map((f, fIdx) => (
                  <li key={fIdx} style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b', fontWeight: '600' }}>{f.label}:</span>
                    <span style={{ color: '#1e293b', fontWeight: '700', marginTop: '2px' }}>{f.val}</span>
                  </li>
                ))}
              </ul>

              {/* Pros */}
              <div style={{ marginTop: '18px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#16a34a', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={14} /> จุดเด่นและข้อได้เปรียบ (Advantages):
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '12.5px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {card.pros.map((p, pIdx) => (
                    <li key={pIdx}>{p}</li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#dc2626', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <X size={14} /> ข้อจำกัดและประเด็นที่ต้องแลก (Trade-offs):
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '12.5px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {card.cons.map((c, cIdx) => (
                    <li key={cIdx}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
