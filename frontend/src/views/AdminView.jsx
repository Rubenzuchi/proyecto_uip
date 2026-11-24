//This file was created by Rubén Granados
import React from 'react';

export default function AdminView({ items = [], onUpdateItem }) {
  const pendingCount = items.filter((i) => i.status === 'Pending').length;
  const storedCount = items.filter((i) => i.status === 'Stored').length;
  const returnedCount = items.filter((i) => i.status === 'Returned').length;

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* KPIs en tiempo real */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        <div style={{ padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px' }}>📦</div>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Pending: {pendingCount}</div>
        </div>
        <div style={{ padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px' }}>🏢</div>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Stored: {storedCount}</div>
        </div>
        <div style={{ padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px' }}>✅</div>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Returned: {returnedCount}</div>
        </div>
      </div>

      <h3 style={{ margin: 0, backgroundColor: '#4F46E5', color: 'white', padding: '6px 14px', borderRadius: '6px', width: 'fit-content', fontSize: '14px' }}>
        Staff Inventory & Claim Verification
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item) => {
          const isReturned = item.status === 'Returned';

          return (
            <div key={item.id} style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                <strong>#{String(item.id).padStart(3, '0')}</strong>
                <strong>{item.title}</strong>
              </div>

              <p style={{ margin: '2px 0', fontSize: '12px', color: '#64748B' }}>
                📍 {item.location} · {item.category}
              </p>
              <p style={{ margin: '2px 0', fontSize: '12px', color: '#475569' }}>
                {item.description}
              </p>

              {/* Edición rápida de ubicación en almacén */}
              <div style={{ margin: '8px 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span>Storage:</span>
                <input
                  type="text"
                  defaultValue={item.storageSlot || `Shelf B-${item.id}`}
                  onBlur={(e) => onUpdateItem(item.id, { storageSlot: e.target.value })}
                  style={{ padding: '3px 6px', borderRadius: '4px', border: '1px solid #CBD5E1', width: '100px', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
                <button
                  onClick={() => onUpdateItem(item.id, { status: 'Returned' })}
                  disabled={isReturned}
                  style={{
                    backgroundColor: isReturned ? '#94A3B8' : '#4F46E5',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: isReturned ? 'default' : 'pointer'
                  }}
                >
                  {isReturned ? 'Claim Verified' : 'Verify Claim'}
                </button>

                <select
                  value={item.status}
                  onChange={(e) => onUpdateItem(item.id, { status: e.target.value })}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: item.status === 'Pending' ? '#FEF08A' : item.status === 'Stored' ? '#86EFAC' : item.status === 'Returned' ? '#C7D2FE' : '#FECACA'
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Stored">Stored</option>
                  <option value="Returned">Returned</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}