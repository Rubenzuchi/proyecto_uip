import React, { useState } from 'react';

export default function ReportView({ onSubmit, onCancel, apiError, clearError }) {
  const [type, setType] = useState('lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Wallet');
  const [location, setLocation] = useState('Campus Library');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (clearError) clearError();
    onSubmit({
      type,
      title,
      category,
      location,
      description
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>Report Lost / Found Item</h3>
        <button
          type="button"
          onClick={() => {
            if (clearError) clearError();
            onCancel();
          }}
          style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ✕ Back
        </button>
      </div>

      {apiError && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #F87171', color: '#991B1B', padding: '8px 10px', borderRadius: '6px', fontSize: '12px' }}>
          <strong>Validation Error:</strong> {apiError}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          onClick={() => setType('lost')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            backgroundColor: type === 'lost' ? '#EF4444' : '#F8FAFC',
            color: type === 'lost' ? 'white' : '#0F172A',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Lost Item
        </button>
        <button
          type="button"
          onClick={() => setType('found')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            backgroundColor: type === 'found' ? '#10B981' : '#F8FAFC',
            color: type === 'found' ? 'white' : '#0F172A',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Found Item
        </button>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Item Title *</label>
        <input
          type="text"
          placeholder="e.g. Blue Backpack"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', padding: '9px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'white' }}
          >
            <option value="Wallet">Wallet</option>
            <option value="Electronics">Electronics</option>
            <option value="Documents">Documents</option>
            <option value="Keys">Keys</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Campus Location</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'white' }}
          >
            <option value="Campus Library">Campus Library</option>
            <option value="Main Cafeteria">Main Cafeteria</option>
            <option value="Building A02">Building A02</option>
            <option value="Science Building">Science Building</option>
          </select>
        </div>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Description & Evidence *</label>
        <textarea
          rows="3"
          placeholder="Color, distinguishing marks, serial number..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', padding: '9px', borderRadius: '8px', border: '1px solid #CBD5E1', fontFamily: 'inherit' }}
        />
      </div>

      <button
        type="submit"
        style={{
          marginTop: '6px',
          padding: '12px',
          backgroundColor: '#4F46E5',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        Submit Report (POST /api/items)
      </button>
    </form>
  );
}