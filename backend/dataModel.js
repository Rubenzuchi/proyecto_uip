//This file was created by Paula Segura
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Domain validation rules (Model constraints)
const ALLOWED_STATUSES = ['Pending', 'Stored', 'Returned', 'Rejected'];
const ALLOWED_TYPES = ['lost', 'found'];
const ALLOWED_LOCATIONS = [
  'Campus Library',
  'Main Cafeteria',
  'Building A02',
  'Science Building'
];

// no database: objects live in an in-memory array. They are lost when the server restarts.

// Dedicated counter to prevent ID collisions when deleting elements
let nextId = 4;

// Initial in-memory store 
let items = [
  {
    id: 1,
    title: 'Black Leather Wallet',
    category: 'Wallet',
    location: 'Campus Library',
    description: 'Contains university student ID card and metro pass.',
    type: 'lost',
    status: 'Pending',
    storageSlot: 'Shelf B-1',
    photoUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=150'
  },
  {
    id: 2,
    title: 'iPhone 13',
    category: 'Electronics',
    location: 'Main Cafeteria',
    description: 'White silicone case with a small scratch near the camera.',
    type: 'found',
    status: 'Stored',
    storageSlot: 'Shelf A-2',
    photoUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150'
  },
  {
    id: 3,
    title: 'Grey Umbrella',
    category: 'Other',
    location: 'Building A02',
    description: 'Foldable grey umbrella left next to room 104.',
    type: 'found',
    status: 'Returned',
    storageSlot: 'Shelf B-3',
    photoUrl: 'https://images.unsplash.com/photo-1498947078984-b4b349cabc29?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'
  }
];

// Centralized Model validation function
// returns an array of errors (empty if everything is fine)
function validateItemFields({ title, location, description, status, type }, isPartial = false) {
  const errors = [];

  if (!isPartial || title !== undefined) {
    if (typeof title !== 'string' || title.trim().length < 2) {
      errors.push('Title must be at least 2 characters long.');
    }
  }

  if (!isPartial || location !== undefined) {
    if (!ALLOWED_LOCATIONS.includes(location)) {
      errors.push(`Invalid location. Allowed: ${ALLOWED_LOCATIONS.join(', ')}.`);
    }
  }

  if (!isPartial || description !== undefined) {
    if (typeof description !== 'string' || description.trim().length < 3) {
      errors.push('Description must be at least 3 characters long.');
    }
  }

  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    errors.push(`Invalid status "${status}". Allowed: ${ALLOWED_STATUSES.join(', ')}.`);
  }

  if (type !== undefined && !ALLOWED_TYPES.includes(type)) {
    errors.push(`Invalid type "${type}". Allowed: ${ALLOWED_TYPES.join(', ')}.`);
  }

  return errors;
}

// GET /api/items -> Returns all objects (complete array)
app.get('/api/items', (req, res) => {
  res.json(items); 
});

// POST /api/items -> Creates a new report with strict validation
app.post('/api/items', (req, res) => {
  const { title, category, location, description, type, photoUrl } = req.body;

  const validationErrors = validateItemFields(
    { title, location, description, type: type || 'lost' },
    false
  );

  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validationErrors
    });
  }

  const newItem = {
    id: nextId++,
    title: title.trim(),
    category: category || 'Other',
    location,
    description: description.trim(),
    type: type || 'lost',
    status: 'Pending',
    storageSlot: `Shelf B-${nextId}`,
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150'
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT /api/items/:id -> In-context update of multiple attributes (location, category, status, description)
app.put('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id, 10); // locates the object. (10 -> indicates decimal base)
  const item = items.find((i) => i.id === itemId);

  // error if it doesn't exist
  if (!item) {
    return res.status(404).json({ error: `Item #${itemId} not found.` });
  }

  // extract sent data
  const { title, category, location, description, status, storageSlot } = req.body;

  // validate
  const validationErrors = validateItemFields(
    { title, location, description, status },
    true
  );

  // if there are errors -> 400 error
  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: 'Model validation rejected update',
      details: validationErrors
    });
  }

  // "if this field was sent to me, update it", the rest remains intact
  if (title !== undefined) item.title = title.trim(); // .trim() to remove extra spaces
  if (category !== undefined) item.category = category;
  if (location !== undefined) item.location = location;
  if (description !== undefined) item.description = description.trim();
  if (status !== undefined) item.status = status;
  if (storageSlot !== undefined) item.storageSlot = storageSlot;

  res.json(item); // response
});

// PUT /api/items/:id/status -> Specific status change route (compatibility)
app.put('/api/items/:id/status', (req, res) => {
  // get the id and the status
  const itemId = parseInt(req.params.id, 10);
  const { status } = req.body;

  // find the object (404 if it doesn't exist)
  const item = items.find((i) => i.id === itemId);
  if (!item) {
    return res.status(404).json({ error: `Item #${itemId} not found.` });
  }

  // validate the status
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status transition',
      details: [`Status "${status}" is not allowed. Use: ${ALLOWED_STATUSES.join(', ')}.`]
    });
  }

  // update and respond
  item.status = status;
  res.json(item);
});

// start the server
app.listen(PORT, () => {
  console.log(`Campus Lost & Found API running at http://localhost:${PORT}`);
});