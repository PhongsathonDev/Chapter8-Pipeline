import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, Zap, TrendingUp, AlertCircle, CheckCircle2, Sliders } from 'lucide-react';

export default function AddressCalculator() {
  const [numInstructions, setNumInstructions] = useState(100);
  const [numStages, setNumStages] = useState(5);
  const [clockPeriodNs, setClockPeriodNs] = useState(1.0); // 1.0 ns (1 GHz)
  const [stallCycles, setStallCycles] = useState(10); // hazard penalties

  const calc = useMemo(() => {
    const n = Math.max(1, parseInt(numInstructions, 10) || 1);
    const k = Math.max(1, parseInt(numStages, 10) || 1);
    const period = Math.max(0.1, parseFloat(clockPeriodNs) || 1.0);
    const stalls = Math.max(0, parseInt(stallCycles, 10) || 0);

    // Non-pipelined calculations
    const nonPipeCycles = n * k;
    const nonPipeTimeNs = nonPipeCycles * period;
    const nonPipeThroughputIpc = (1 / k).toFixed(3);

    // Pipelined ideal calculations
    const pipeIdealCycles = k + n - 1;
    const idealSpeedup = (nonPipeCycles / pipeIdealCycles).toFixed(2);

    // Pipelined actual calculations (with stalls)
    const pipeActualCycles = pipeIdealCycles + stalls;
    const pipeActualTimeNs = pipeActualCycles * period;
    const actualSpeedup = (nonPipeCycles / pipeActualCycles).toFixed(2);
    const actualIpc = (n / pipeActualCycles).toFixed(3);
    const efficiency = ((actualSpeedup / k) * 100).toFixed(1);

    // Time saved
    const timeSavedNs = Math.max(0, nonPipeTimeNs - pipeActualTimeNs);
    const timeSavedPercent = ((timeSavedNs / nonPipeTimeNs) * 100).toFixed(1);

    return {
      n, k, period, stalls,
      nonPipeCycles, nonPipeTimeNs, nonPipeThroughputIpc,
      pipeIdealCycles, idealSpeedup,
      pipeActualCycles, pipeActualTimeNs, actualSpeedup, actualIpc,
      efficiency, timeSavedNs, timeSavedPercent
    };
  }, [numInstructions, numStages, clockPeriodNs, stallCycles]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Calculator size={28} color="#4f46e5" />
          <span>เครื่องคำนวณประสิทธิภาพและอัตราเร่งไปป์ไลน์ (Pipeline Speedup Calculator)</span>
        </h2>
        <p style={{ color: '#64748b', fontSize: '14.5px', marginTop: '6px' }}>
          วิเคราะห์ Latency, Throughput (IPC), เวลารวม และ Speedup เปรียบเทียบระหว่าง Non-pipelined กับ Pipelined
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Input Parameters Panel */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#334155', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="#4f46e5" />
            <span>กำหนดค่าพารามิเตอร์การประมวลผล</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Number of Instructions */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#475569' }}>จำนวนคำสั่งทั้งหมด (n):</label>
                <span style={{ fontWeight: '700', color: '#4f46e5', fontFamily: 'JetBrains Mono, monospace' }}>{calc.n.toLocaleString()} คำสั่ง</span>
              </div>
              <input
                type="range"
                min="1"
                max="1000"
                step="1"
                value={numInstructions}
                onChange={(e) => setNumInstructions(e.target.value)}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {[3, 10, 50, 100, 500, 1000].map(v => (
                  <button
                    key={v}
                    onClick={() => setNumInstructions(v)}
                    style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: calc.n === v ? '#4f46e5' : '#f8fafc', color: calc.n === v ? '#ffffff' : '#64748b', cursor: 'pointer' }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Stages */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#475569' }}>จำนวนสเตจของไปป์ไลน์ (k):</label>
                <span style={{ fontWeight: '700', color: '#4f46e5', fontFamily: 'JetBrains Mono, monospace' }}>{calc.k} สเตจ</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                step="1"
                value={numStages}
                onChange={(e) => setNumStages(e.target.value)}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {[3, 4, 5, 8, 10, 20].map(v => (
                  <button
                    key={v}
                    onClick={() => setNumStages(v)}
                    style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: calc.k === v ? '#4f46e5' : '#f8fafc', color: calc.k === v ? '#ffffff' : '#64748b', cursor: 'pointer' }}
                  >
                    {v} สเตจ
                  </button>
                ))}
              </div>
            </div>

            {/* Clock Period */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#475569' }}>เวลาต่อรอบสัญญาณนาฬิกา (T):</label>
                <span style={{ fontWeight: '700', color: '#4f46e5', fontFamily: 'JetBrains Mono, monospace' }}>{calc.period} ns ({((1 / calc.period) * 1000).toFixed(0)} MHz)</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="5.0"
                step="0.1"
                value={clockPeriodNs}
                onChange={(e) => setClockPeriodNs(e.target.value)}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            {/* Stall Cycles */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#475569' }}>รอบที่สูญเสียจาก Hazards (Stall Cycles):</label>
                <span style={{ fontWeight: '700', color: '#ea580c', fontFamily: 'JetBrains Mono, monospace' }}>{calc.stalls} รอบ</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={stallCycles}
                onChange={(e) => setStallCycles(e.target.value)}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '4px' }}>
                *รอบเวลาที่เสียจากการหยุดรอ (Stalls) และการล้างท่อ (Flushes)
              </div>
            </div>
          </div>
        </div>

        {/* Results Overview Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', border: '1px solid #c7d2fe', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#4338ca', textTransform: 'uppercase', letterSpacing: '0.5px' }}>อัตราเร่งความเร็วจริง (Actual Speedup)</div>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#312e81', marginTop: '4px' }}>{calc.actualSpeedup}× เท่า</div>
              <div style={{ fontSize: '12.5px', color: '#4338ca', marginTop: '2px' }}>
                (ทางทฤษฎีอุดมคติสูงสุด: <strong>{calc.idealSpeedup}× เท่า</strong> | ขีดจำกัด n➔∞ คือ <strong>{calc.k}× เท่า</strong>)
              </div>
            </div>
            <Zap size={44} color="#4f46e5" opacity={0.8} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Throughput ของไปป์ไลน์</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#16a34a', marginTop: '4px' }}>{calc.actualIpc} <small style={{ fontSize: '13px' }}>IPC</small></div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Non-pipe: {calc.nonPipeThroughputIpc} IPC</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>ประสิทธิภาพท่อ (Efficiency)</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#0284c7', marginTop: '4px' }}>{calc.efficiency}%</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>เทียบกับขีดจำกัด k เท่า</div>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>ระยะเวลาที่ประหยัดได้ (Time Saved):</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '22px', fontWeight: '800', color: '#16a34a' }}>{calc.timeSavedPercent}%</span>
                <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '8px' }}>({calc.timeSavedNs.toLocaleString()} ns)</span>
              </div>
              <div style={{ width: '120px', height: '10px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${calc.timeSavedPercent}%`, height: '100%', background: '#16a34a', borderRadius: '999px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-side Detailed Comparison Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
          ตารางเปรียบเทียบผลลัพธ์เชิงตัวเลขและการแจกแจงสูตร (Formula Breakdown):
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', color: '#334155' }}>รายการเปรียบเทียบ</th>
                <th style={{ padding: '12px 16px', color: '#991b1b' }}>แบบไม่ใช้ไปป์ไลน์ (Non-Pipelined)</th>
                <th style={{ padding: '12px 16px', color: '#15803d' }}>แบบใช้ไปป์ไลน์ (Pipelined)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>สูตรการคำนวณรอบเวลา</td>
                <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace' }}>n × k</td>
                <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace' }}>(k + n - 1) + Stalls</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>จำนวนรอบสัญญาณนาฬิกาทั้งหมด</td>
                <td style={{ padding: '12px 16px', fontWeight: '700', color: '#991b1b', fontFamily: 'JetBrains Mono, monospace' }}>
                  {calc.nonPipeCycles.toLocaleString()} รอบ
                </td>
                <td style={{ padding: '12px 16px', fontWeight: '700', color: '#15803d', fontFamily: 'JetBrains Mono, monospace' }}>
                  {calc.pipeActualCycles.toLocaleString()} รอบ
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>เวลารวมในการประมวลผล (นาโนวินาที)</td>
                <td style={{ padding: '12px 16px', color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>
                  {calc.nonPipeTimeNs.toLocaleString()} ns
                </td>
                <td style={{ padding: '12px 16px', color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>
                  {calc.pipeActualTimeNs.toLocaleString()} ns
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>Throughput (คำสั่งต่อรอบ IPC)</td>
                <td style={{ padding: '12px 16px', color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>
                  {calc.nonPipeThroughputIpc} IPC (1 คำสั่งในทุก {calc.k} รอบ)
                </td>
                <td style={{ padding: '12px 16px', color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>
                  {calc.actualIpc} IPC (เกือบ 1 คำสั่งในทุก 1 รอบ)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>Latency ต่อ 1 คำสั่งเดี่ยว</td>
                <td style={{ padding: '12px 16px', color: '#475569' }}>
                  {(calc.k * calc.period).toFixed(1)} ns ({calc.k} รอบ)
                </td>
                <td style={{ padding: '12px 16px', color: '#475569' }}>
                  {(calc.k * calc.period).toFixed(1)} ns ({calc.k} รอบ - เท่าเดิม!)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
