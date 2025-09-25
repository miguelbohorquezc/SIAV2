export const PAGE_SIZE_DEFAULT = 50 as const;

export const ORDEN = {
  CREATED_DESC: 'createdAt_desc',
  CREATED_ASC: 'createdAt_asc',
} as const;

export type Orden = typeof ORDEN[keyof typeof ORDEN];
