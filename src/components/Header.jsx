import React from 'react';
import { BookOpen, Cpu, Calculator, HelpCircle, Layers, Search, Sliders } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, searchQuery, setSearchQuery, totalQuestions }) {
  return (
    <header className="main-header">
      <div className="header-top">
        <div className="brand-logo">
          <div className="logo-badge">CS 3106</div>
          <div className="title-group">
            <h1>บทที่ 8: การทำงานแบบไปป์ลายน์ (Pipeline)</h1>
            <p className="desktop-only">วิชา 020413106 โครงสร้างระบบคอมพิวเตอร์ | ครอบคลุม 16 วัตถุประสงค์เชิงพฤติกรรม</p>
          </div>
        </div>

        <div className="header-search">
          <div className="search-input-wrapper">
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="ค้นหาคำศัพท์ (เช่น IF, ID, EX, MEM, WB, Hazard, Forwarding, Stalling, Speedup)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ fontSize: '12px', color: '#94a3b8', background: '#cbd5e1', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="nav-tabs-wrapper">
        <nav className="nav-tabs">
          <button
            className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <BookOpen size={18} />
            <span>สรุปเนื้อหา <small className="tab-sub">9 โมดูล</small></span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <HelpCircle size={18} />
            <span>คลังข้อสอบ</span>
            <span className="tab-badge" style={{ background: '#dcfce7', color: '#15803d' }}>{totalQuestions} ข้อ</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'cycle-sim' ? 'active' : ''}`}
            onClick={() => setActiveTab('cycle-sim')}
          >
            <Cpu size={18} />
            <span>จำลอง 5-Stage Pipeline</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'address-calc' ? 'active' : ''}`}
            onClick={() => setActiveTab('address-calc')}
          >
            <Calculator size={18} />
            <span>คำนวณ Speedup / Throughput</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'format-tool' ? 'active' : ''}`}
            onClick={() => setActiveTab('format-tool')}
          >
            <Sliders size={18} />
            <span>เปรียบเทียบสถาปัตยกรรม CPU</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
            onClick={() => setActiveTab('flashcards')}
          >
            <Layers size={18} />
            <span>Flashcards</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
