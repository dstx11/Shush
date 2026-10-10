import { rm } from 'node:fs/promises';

// Never carry obsolete hashed chunks into the next deploy or bundle budget.
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
