const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { createUserSchema, updateUserSchema, idParamSchema } = require('../validators/userValidator');

// POST /api/users
const createUser = asyncHandler(async (req, res) => {
  const data = createUserSchema.parse(req.body);
  const user = await User.create(data);
  return res.status(201).json(user);
});

// GET /api/users
// Supports pagination and simple search:
//   ?page=1&limit=10&q=term&sort=-createdAt (default) or sort=name / -name / email / -email
const getUsers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
  const q = (req.query.q || '').trim();
  const sort = (req.query.sort || '-createdAt').trim();

  const filter = q ? { $text: { $search: q } } : {};
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  res.json({
    data: users,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
  });
});

// GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
  idParamSchema.parse(req.params);
  const user = await User.findById(req.params.id).lean();
  if (!user) return res.status(404).json({ message: 'user not found' });
  res.json(user);
});

// PATCH /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
  idParamSchema.parse(req.params);
  const data = updateUserSchema.parse(req.body);
  const updated = await User.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true
  }).lean();
  if (!updated) return res.status(404).json({ message: 'user not found' });
  res.json(updated);
});

// DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  idParamSchema.parse(req.params);
  const deleted = await User.findByIdAndDelete(req.params.id).lean();
  if (!deleted) return res.status(404).json({ message: 'user not found' });
  res.status(204).send();
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
