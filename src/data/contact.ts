/**
 * Content for the contact section, shared by the Home page and the
 * Services page. The api/contact.ts handler keeps its own copy of the
 * interest list — the serverless function cannot import app source.
 */

/** Allowed values for the "I'm interested in" select (client copy). */
export const INTERESTS = [
  'Job opportunity',
  'Duka Manager demo',
  'Custom app',
  'Data work',
  'Something else',
] as const;

export type Interest = (typeof INTERESTS)[number];

/** Heading and intro line for the section. */
export const contactHeading = {
  title: 'Contact',
  intro: "Tell me what you're working on.",
} as const;

/** Field constraints shared by the client validation (server re-checks). */
export const contactRules = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  messageMin: 10,
  messageMax: 2000,
} as const;
