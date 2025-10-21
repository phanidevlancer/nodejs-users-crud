const { z } = require('zod');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createUserSchema = z.object({
  name: z.string().min(1, 'name is required'),
  email: z.string().email('invalid email'),
  age: z.number().int().min(0).optional()
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  age: z.number().int().min(0).optional()
}).refine((data) => Object.keys(data).length > 0, { message: 'no fields to update' });

const idParamSchema = z.object({
  id: z.string().regex(objectIdRegex, 'invalid id')
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  idParamSchema
};
