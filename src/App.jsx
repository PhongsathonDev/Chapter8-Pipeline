import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SummaryViewer from './components/SummaryViewer';
import CpuCycleSimulator from './components/CpuCycleSimulator';
import AddressCalculator from './components/AddressCalculator';
import FormatComparisonTool from './components/FormatComparisonTool';
import QuizView from './components/QuizView';
import FlashcardsView from './components/FlashcardsView';

import { courseModules } from './data/courseData';
import { allQuizQuestions, quizQuestionsSet1, quizQuestionsSet2, quizSets } from './data/quizData';

export default function App() {
  const [activeTab, setActiveTab] = useState('summary');
  const [activeModuleId, setActiveModuleId] = useState(courseModules[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalQuestions={allQuizQuestions.length}
      />

      <div className="layout-body">
        {activeTab === 'summary' && (
          <div className="summary-layout">
            <Sidebar
              modules={courseModules}
              activeModuleId={activeModuleId}
              setActiveModuleId={setActiveModuleId}
              searchQuery={searchQuery}
            />
            <SummaryViewer
              modules={courseModules}
              activeModuleId={activeModuleId}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {activeTab === 'cycle-sim' && <CpuCycleSimulator />}

        {activeTab === 'address-calc' && <AddressCalculator />}

        {activeTab === 'format-tool' && <FormatComparisonTool />}

        {activeTab === 'flashcards' && <FlashcardsView />}

        {activeTab === 'quiz' && (
          <QuizView
            allQuestions={allQuizQuestions}
            set1Questions={quizQuestionsSet1}
            set2Questions={quizQuestionsSet2}
            quizSets={quizSets}
          />
        )}
      </div>

      <footer className="main-footer">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontWeight: '600', color: '#334155' }}>
            วิชา 020413106 โครงสร้างระบบคอมพิวเตอร์ (Computer System Organization)
          </p>
          <p style={{ marginTop: '4px' }}>
            บทที่ 8: การทำงานแบบไปป์ลายน์ (Pipeline)
          </p>
          <p style={{ fontSize: '12px', marginTop: '12px', color: '#94a3b8' }}>
            ออกแบบอย่างประณีตสำหรับอ่านทบทวนก่อนสอบ | สรุปละเอียดครบถ้วนทุกหน้า 1-31 และ 16 วัตถุประสงค์เชิงพฤติกรรม
          </p>
        </div>
      </footer>
    </div>
  );
}
