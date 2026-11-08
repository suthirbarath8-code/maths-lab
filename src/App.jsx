import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CheatSheetModal from './components/CheatSheetModal';
import NumberLab from './labs/NumberLab';
import FunctionStudio from './labs/FunctionStudio';
import ProbabilityLab from './labs/ProbabilityLab';
import SequenceLab from './labs/SequenceLab';
import MathGym from './labs/MathGym';

export default function App() {
  const [activeTab, setActiveTab] = useState('numbers');
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing inside input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'Escape') {
        setIsCheatSheetOpen(false);
      } else if (e.key === '1') {
        setActiveTab('numbers');
      } else if (e.key === '2') {
        setActiveTab('functions');
      } else if (e.key === '3') {
        setActiveTab('probability');
      } else if (e.key === '4') {
        setActiveTab('sequences');
      } else if (e.key === '5') {
        setActiveTab('gym');
      } else if (e.key === '?' || e.key === 'h' || e.key === 'H') {
        setIsCheatSheetOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-root">
      {/* Navy Background layer & ambient glow */}
      <div className="navy-bg-layer" aria-hidden="true" />
      <div className="navy-overlay" aria-hidden="true" />

      {/* Main App Container */}
      <div className="app-shell">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          openCheatSheet={() => setIsCheatSheetOpen(true)}
        />

        <main className="main-content-area" role="main">
          {activeTab === 'numbers' && <NumberLab />}
          {activeTab === 'functions' && <FunctionStudio />}
          {activeTab === 'probability' && <ProbabilityLab />}
          {activeTab === 'sequences' && <SequenceLab />}
          {activeTab === 'gym' && <MathGym />}
        </main>

        <footer className="app-footer">
          <div className="footer-left">
            <span>Built for students: Visual, Experimental &amp; Intuitive Mathematics</span>
            <span className="dot-sep">&bull;</span>
            <span className="font-tag">Font: 100% Poppins</span>
          </div>
          <div className="footer-right">
            <span>Shortcuts: Press <kbd>1</kbd>–<kbd>5</kbd> to switch labs &bull; <kbd>?</kbd> for Formula Sheet</span>
          </div>
        </footer>
      </div>

      {/* Student Cheat Sheet Modal */}
      <CheatSheetModal 
        isOpen={isCheatSheetOpen} 
        onClose={() => setIsCheatSheetOpen(false)} 
      />
    </div>
  );
}
