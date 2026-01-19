/**
 * @fileoverview Person identifier type
 * @module L0/types/Person
 */
export const Person = {
  type: 'Person',
  fields: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    title: { type: 'string', optional: true },
    department: { type: 'string', optional: true }
  },
  validate: (v) => v.id && v.name,
  display: (v) => v.title ? `${v.name}, ${v.title}` : v.name
};
