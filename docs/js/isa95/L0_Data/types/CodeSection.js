/**
 * @fileoverview PA County Code section reference
 * @module L0/types/CodeSection
 */
export const CodeSection = {
  type: 'CodeSection',
  fields: {
    title: { type: 'number', min: 1, max: 75 },
    section: { type: 'number' },
    subsection: { type: 'string', optional: true }
  },
  format: (v) => `${v.title} Pa.C.S. §${v.section}${v.subsection || ''}`,
  parse: (s) => {
    const m = s.match(/(\d+)\s*Pa\.C\.S\.\s*§(\d+)(\.\d+)?/);
    return m ? { title: +m[1], section: +m[2], subsection: m[3] } : null;
  }
};
