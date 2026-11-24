import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import UserView from './views/UserView';
import AdminView from './views/AdminView';
import ReportView from './views/ReportView';

const API_BASE_URL = 'http://localhost:3000/api';

export default function App() {
  const [currentView, setView] = useState('user');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/items`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setApiError('Cannot connect to Express server on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Crear nuevo objeto (POST /api/items)
  const handleCreateItem = async (newItemData) => {
    try {
      setApiError(null);
      const res = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItemData)
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data.details ? data.details.join(' ') : data.error);
        return;
      }

      setItems((prev) => [...prev, data]);
      setView('user');
    } catch (err) {
      setApiError('Network error while creating item.');
    }
  };

  // Actualización parcial in-context de cualquier atributo (PUT /api/items/:id)
  const handleUpdateItem = async (id, updatedFields) => {
    try {
      setApiError(null);
      const res = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data.details ? data.details.join(' ') : data.error);
        return;
      }

      // Actualiza el estado local inmediatamente sin recargar la página
      setItems((prev) => prev.map((item) => (item.id === id ? data : item)));
    } catch (err) {
      setApiError('Network error while updating item.');
    }
  };

  return (
    <div className="container">
      <Navbar currentView={currentView} setView={setView} />

      {loading ? (
        <div style={{ padding: '30px', textAlign: 'center' }}>Loading Campus Lost & Found...</div>
      ) : (
        <>
          {currentView === 'user' && (
            <UserView
              items={items}
              onUpdateItem={handleUpdateItem}
              onOpenReport={() => setView('report')}
              apiError={apiError}
              clearError={() => setApiError(null)}
            />
          )}
          {currentView === 'report' && (
            <ReportView
              onSubmit={handleCreateItem}
              onCancel={() => setView('user')}
              apiError={apiError}
              clearError={() => setApiError(null)}
            />
          )}
          {currentView === 'admin' && (
            <AdminView
              items={items}
              onUpdateItem={handleUpdateItem}
            />
          )}
        </>
      )}
    </div>
  );
}