import React, { useState } from 'react';

// Coordenadas porcentuales sobre la imagen del mapa del campus
const LOCATION_COORDS = {
  'Campus Library': { top: '34%', left: '26%' },
  'Main Cafeteria': { top: '30%', left: '66%' },
  'Building A02': { top: '65%', left: '72%' },
  'Science Building': { top: '68%', left: '34%' }
};

const LOCATIONS = Object.keys(LOCATION_COORDS);
const CATEGORIES = ['Wallet', 'Electronics', 'Documents', 'Keys', 'Other'];
const STATUSES = ['Pending', 'Stored', 'Returned', 'Rejected'];

export default function UserView({ items = [], onUpdateItem, onOpenReport, apiError, clearError }) {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draftDescription, setDraftDescription] = useState('');

  // Filtrado por tipo (All / Lost / Found) y búsqueda
  const filteredItems = items.filter((item) => {
    const matchesFilter =
      filter === 'All' ? true : item.type?.toLowerCase() === filter.toLowerCase();

    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const startEditing = (item) => {
    if (clearError) clearError();
    if (editingId === item.id) {
      setEditingId(null);
      return;
    }
    setEditingId(item.id);
    setDraftDescription(item.description || '');
  };

  // Guardado inmediato atributo por atributo (Vertical Slice directo al backend)
  const handleImmediateFieldChange = (id, field, value) => {
    if (clearError) clearError();
    onUpdateItem(id, { [field]: value });
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '80px' }}>
      {/* Alerta visual cuando el Modelo rechaza una petición inválida */}
      {apiError && (
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #F87171',
          color: '#991B1B',
          padding: '10px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span><strong>Model Validation Error:</strong> {apiError}</span>
          <button
            onClick={clearError}
            style={{ background: 'none', border: 'none', color: '#991B1B', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Buscador */}
      <input
        type="text"
        placeholder="🔍 Search by item, location or description..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', width: '100%', boxSizing: 'border-box' }}
      />

      {/* Filtros interactivos All / Lost / Found */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {['All', 'Lost', 'Found'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '13px',
              backgroundColor: filter === type ? '#4F46E5' : '#E2E8F0',
              color: filter === type ? 'white' : '#475569'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Mapa Interactivo con Pines Dinámicos */}
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #CBD5E1' }}>
        <img src="/map-campus.png" alt="Interactive Campus Map" style={{ width: '100%', display: 'block' }} />

        {filteredItems.map((item, idx) => {
          const baseCoords = LOCATION_COORDS[item.location] || { top: '50%', left: '50%' };
          // Pequeño desplazamiento si hay varios objetos en el mismo edificio
          const offset = (idx % 3) * 14 - 10;
          const isLost = item.type?.toLowerCase() === 'lost';
          const isSelected = selectedId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelectedId(item.id);
                startEditing(item);
              }}
              title={`${item.title} (${item.location})`}
              style={{
                position: 'absolute',
                top: `calc(${baseCoords.top} + ${offset}px)`,
                left: `calc(${baseCoords.left} + ${offset}px)`,
                transform: isSelected ? 'translate(-50%, -50%) scale(1.25)' : 'translate(-50%, -50%)',
                backgroundColor: isLost ? '#EF4444' : '#10B981',
                color: 'white',
                border: isSelected ? '3px solid #1E293B' : '2px solid white',
                borderRadius: '999px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                transition: 'all 0.25s ease',
                zIndex: isSelected ? 10 : 2
              }}
            >
              {isLost ? '?' : '✓'} #{item.id}
            </button>
          );
        })}
      </div>

      {/* Lista de Objetos con Edición Directa In-Context */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748B', padding: '16px', fontSize: '13px' }}>
            No items match the current filter.
          </p>
        ) : (
          filteredItems.map((item) => {
            const isEditing = editingId === item.id;
            const isSelected = selectedId === item.id;

            return (
              <div
                key={item.id}
                style={{
                  padding: '12px',
                  border: isSelected || isEditing ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                {/* Cabecera de la tarjeta */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img
                    src={item.photoUrl || 'https://via.placeholder.com/70'}
                    alt={item.title}
                    style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px' }}>#{item.id} {item.title}</h4>
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        backgroundColor: item.type === 'lost' ? '#FEE2E2' : '#D1FAE5',
                        color: item.type === 'lost' ? '#EF4444' : '#10B981',
                        fontWeight: 'bold'
                      }}>
                        {item.type?.toUpperCase()}
                      </span>
                    </div>

                    <p style={{ margin: '3px 0', fontSize: '12px', color: '#475569' }}>
                      📍 <strong>{item.location}</strong> · {item.category}
                    </p>
                    <p style={{ margin: '2px 0', fontSize: '12px', color: '#64748B' }}>
                      {item.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: item.status === 'Pending' ? '#FEF08A' : item.status === 'Stored' ? '#BBF7D0' : item.status === 'Returned' ? '#C7D2FE' : '#FECACA',
                        color: '#1E293B'
                      }}>
                        Status: {item.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => startEditing(item)}
                        style={{
                          backgroundColor: isEditing ? '#1E293B' : '#EEF2FF',
                          color: isEditing ? 'white' : '#4F46E5',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        {isEditing ? 'Close Editor' : 'Edit'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Panel de Edición Directa In-Context (4 atributos guardados al instante en API) */}
                {isEditing && (
                  <div style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px dashed #CBD5E1',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    backgroundColor: '#F8FAFC',
                    padding: '10px',
                    borderRadius: '8px'
                  }}>
                    
                    {/* Atributo 1 y 2: Location (mueve el pin del mapa) y Category */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '2px' }}>
                          1. Location (updates map pin)
                        </label>
                        <select
                          value={item.location}
                          onChange={(e) => handleImmediateFieldChange(item.id, 'location', e.target.value)}
                          style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                        >
                          {LOCATIONS.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '2px' }}>
                          2. Category
                        </label>
                        <select
                          value={item.category}
                          onChange={(e) => handleImmediateFieldChange(item.id, 'category', e.target.value)}
                          style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Atributo 3: Status / Claim Decision */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '2px' }}>
                        3. Status / Claim Decision
                      </label>
                      <select
                        value={item.status}
                        onChange={(e) => handleImmediateFieldChange(item.id, 'status', e.target.value)}
                        style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 'bold' }}
                      >
                        {STATUSES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    {/* Atributo 4: Description / Claim Evidence */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '2px' }}>
                        4. Description / Evidence Notes
                      </label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="text"
                          value={draftDescription}
                          onChange={(e) => setDraftDescription(e.target.value)}
                          style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleImmediateFieldChange(item.id, 'description', draftDescription)}
                          style={{
                            backgroundColor: '#4F46E5',
                            color: 'white',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Botón flotante para crear reporte nuevo */}
      <button
        onClick={onOpenReport}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: 'calc(50% - 220px + 16px)',
          backgroundColor: '#4F46E5',
          color: 'white',
          border: 'none',
          padding: '12px 18px',
          borderRadius: '999px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
          cursor: 'pointer',
          zIndex: 20
        }}
      >
        + Report Item
      </button>
    </div>
  );
}