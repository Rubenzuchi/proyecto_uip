import React from 'react';

export default function Navbar({ currentView, setView }) {
  const navBtnStyle = (viewName) => ({
    backgroundColor: currentView === viewName ? '#4F46E5' : '#334155',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer'
  });

  return (
    <nav style={{
      backgroundColor: '#1E293B',
      padding: '14px 16px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px'
    }}>
      <h2 style={{ margin: 0, fontSize: '17px', letterSpacing: '0.5px' }}>
        LOST & FOUND
      </h2>

      <div style={{ display: 'flex', gap: '6px' }}>
        <button onClick={() => setView('user')} style={navBtnStyle('user')}>
          Map & List
        </button>
        <button onClick={() => setView('report')} style={navBtnStyle('report')}>
          + Report
        </button>
        <button onClick={() => setView('admin')} style={navBtnStyle('admin')}>
          Admin
        </button>
      </div>
    </nav>
  );
}