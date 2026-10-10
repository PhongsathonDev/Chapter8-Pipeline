import React, { useState } from 'react';
import { Calculator, Zap, Clock, TrendingUp, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';

export default function AddressCalculator() {
  const [numInstructions, setNumInstructions] = useState(100);
  const [numStages, setNumStages] = useState(5);
  const [cycleTimeNs, setCycleTimeNs] = useState(2.0);
  const [stallCycles, setStallCycles] = useState(15);

  // Calculations
  const nonPipeCycles = numInstructions * numStages;
  const nonPipeTimeNs = nonPipeCycles * cycleTimeNs;

  const idealPipeCycles = numStages + numInstructions - 1;
  const realPipeCycles = idealPipeCycles + stallCycles;
  const realPipeTimeNs = realPipeCycles * cycleTimeNs;

  const speedupReal = (nonPipeCycles / realPipeCycles).toFixed(2);
  const speedupIdeal = (nonPipeCycles / idealPipeCycles).toFixed(2);
  const maxTheoreticalSpeedup = numStages.toFixed(1);

  const ipcReal = (numInstructions / realPipeCycles).toFixed(3);
  const ipcIdeal = (numInstructions / idealPipeCycles).toFixed(3);

  // Clock frequency in GHz = 1 / cycleTimeNs
  const clockFreqGHz = (1 / cycleTimeNs).toFixed(2);
  // MIPS = IPC * (ClockFreq in MHz) = IPC * (1000 / cycleTimeNs)
  const mipsReal = ((numInstructions / (realPipeTimeNs / 1000))).toFixed(1);

  // Time saved percentage
  const timeSavedPct = (((nonPipeTimeNs - realPipeTimeNs) / nonPipeTimeNs) * 100).toFixed(1);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      <div className="sim-container">
        <div className="sim-header">
          <span className="module-badge">PERFORMANCE CALCULATOR</span>
          <h2 style={{ marginTop: '8px', fontSize: '24px', fontWeight: '800' }}>
            เครื่องคำนวณประสิทธิภาพและอัตราเร่งไปป์ไลน์ (Pipeline Speedup & Throughput Calculator)
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '14.5px' }}>
            คำนวณและเปรียบเทียบเวลาประมวลผล, อัตราเร่ง (Speedup Factor), Throughput (IPC/MIPS) และผลกระทบของการเกิด Stalls
          </p>
        </div>

        {/* Input Parameters Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px', background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          {/* Instructions count slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                จำนวนคำสั่ง (n):
              </label>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--indigo-primary)' }}>
                {numInstructions.toLocaleString()} คำสั่ง
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="1000"
              step="1"
              value={numInstructions}
              onChange={(e) => setNumInstructions(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: 'var(--indigo-primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              {[1, 3, 10, 50, 100, 500, 1000].map(v => (
                <button
                  key={v}
                  onClick={() => setNumInstructions(v)}
                  style={{ fontSize: '11px', padding: '2px 6px', background: numInstructions === v ? 'var(--indigo-primary)' : '#e2e8f0', color: numInstructions === v ? '#fff' : '#475569', borderRadius: '4px' }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Number of stages (k) slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                จำนวนสเตจ (k):
              </label>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--indigo-primary)' }}>
                {numStages} สเตจ
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              step="1"
              value={numStages}
              onChange={(e) => setNumStages(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: 'var(--indigo-primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              {[3, 5, 8, 10, 14, 20].map(v => (
                <button
                  key={v}
                  onClick={() => setNumStages(v)}
                  style={{ fontSize: '11px', padding: '2px 6px', background: numStages === v ? 'var(--indigo-primary)' : '#e2e8f0', color: numStages === v ? '#fff' : '#475569', borderRadius: '4px' }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Cycle time (tau) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                เวลารอบสัญญาณนาฬิกา (τ):
              </label>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--indigo-primary)' }}>
                {cycleTimeNs} ns ({clockFreqGHz} GHz)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10.0"
              step="0.5"
              value={cycleTimeNs}
              onChange={(e) => setCycleTimeNs(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--indigo-primary)', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              ความถี่สัญญาณนาฬิกา: {clockFreqGHz} GHz
            </div>
          </div>

          {/* Stall cycles */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                รอบที่เกิด Hazards / Stalls:
              </label>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#b45309' }}>
                {stallCycles} รอบ
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={stallCycles}
              onChange={(e) => setStallCycles(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: '#b45309', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              ผลกระทบจาก Data/Control Stalls
            </div>
          </div>
        </div>

        {/* Big Metric Display Cards */}
        <div className="metric-grid" style={{ marginBottom: '24px' }}>
          <div className="metric-card" style={{ borderTop: '4px solid var(--emerald-success)' }}>
            <div className="metric-label">อัตราเร่งจริง (Speedup Factor)</div>
            <div className="metric-value" style={{ color: 'var(--emerald-success)' }}>
              {speedupReal}x
            </div>
            <div className="metric-desc">
              ในอุดมคติ: {speedupIdeal}x (สูงสุดทฤษฎี: {maxTheoreticalSpeedup}x)
            </div>
          </div>

          <div className="metric-card" style={{ borderTop: '4px solid var(--indigo-primary)' }}>
            <div className="metric-label">เวลาที่ประหยัดได้ (Time Saved)</div>
            <div className="metric-value" style={{ color: 'var(--indigo-primary)' }}>
              {timeSavedPct}%
            </div>
            <div className="metric-desc">
              ลดลงจาก {nonPipeTimeNs.toLocaleString()} ns เหลือ {realPipeTimeNs.toLocaleString()} ns
            </div>
          </div>

          <div className="metric-card" style={{ borderTop: '4px solid var(--sky-info)' }}>
            <div className="metric-label">Throughput (อัตรางานจริง)</div>
            <div className="metric-value" style={{ color: 'var(--sky-info)' }}>
              {ipcReal} IPC
            </div>
            <div className="metric-desc">
              อัตราการประมวลผล: {mipsReal} MIPS
            </div>
          </div>

          <div className="metric-card" style={{ borderTop: '4px solid #64748b' }}>
            <div className="metric-label">รอบเวลารวม (Total Cycles)</div>
            <div className="metric-value" style={{ color: '#475569' }}>
              {realPipeCycles.toLocaleString()}
            </div>
            <div className="metric-desc">
              เทียบกับไม่ใช้ไปป์ไลน์: {nonPipeCycles.toLocaleString()} รอบ
            </div>
          </div>
        </div>

        {/* Visual Bar Comparison */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            📊 แผนภูมิเปรียบเทียบระยะเวลาทั้งหมด (Execution Time Comparison)
          </h4>

          {/* Non-pipelined Bar */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px', fontWeight: '600' }}>
              <span style={{ color: 'var(--rose-danger)' }}>แบบไม่ใช้ไปป์ไลน์ (Non-Pipelined)</span>
              <span>{nonPipeCycles.toLocaleString()} รอบ ({nonPipeTimeNs.toLocaleString()} ns)</span>
            </div>
            <div style={{ background: '#f1f5f9', height: '28px', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '100%', background: 'linear-gradient(90deg, #f43f5e, #e11d48)', color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', paddingLeft: '10px', fontWeight: '700' }}>
                100% (เกณฑ์ฐาน)
              </div>
            </div>
          </div>

          {/* Pipelined Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px', fontWeight: '600' }}>
              <span style={{ color: 'var(--emerald-success)' }}>แบบใช้ไปป์ไลน์ (Pipelined + Stalls)</span>
              <span>{realPipeCycles.toLocaleString()} รอบ ({realPipeTimeNs.toLocaleString()} ns)</span>
            </div>
            <div style={{ background: '#f1f5f9', height: '28px', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${Math.max(4, Math.min(100, (realPipeCycles / nonPipeCycles) * 100))}%`, background: 'linear-gradient(90deg, #10b981, #059669)', color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', paddingLeft: '10px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                {((realPipeCycles / nonPipeCycles) * 100).toFixed(1)}% ของเวลาเดิม
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Formula Breakdown */}
        <div style={{ background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--indigo-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calculator size={16} /> การคำนวณตามสูตรอย่างละเอียด:
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            <div>
              <strong>1. เวลาแบบไม่ใช้ไปป์ไลน์:</strong><br />
              <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>T_seq = n x k = {numInstructions} x {numStages} = {nonPipeCycles.toLocaleString()} รอบ</code>
            </div>

            <div>
              <strong>2. เวลาไปป์ไลน์ในอุดมคติ:</strong><br />
              <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>T_ideal = k + n - 1 = {numStages} + {numInstructions} - 1 = {idealPipeCycles.toLocaleString()} รอบ</code>
            </div>

            <div>
              <strong>3. เวลาไปป์ไลน์จริงรวม Stalls:</strong><br />
              <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>T_real = T_ideal + Stalls = {idealPipeCycles} + {stallCycles} = {realPipeCycles.toLocaleString()} รอบ</code>
            </div>

            <div>
              <strong>4. อัตราเร่งเชิงคำนวณ (Speedup):</strong><br />
              <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>S = T_seq / T_real = {nonPipeCycles} / {realPipeCycles} = {speedupReal} เท่า</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
