import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});
export type Login = z.infer<typeof loginSchema>;

export const createWorkspaceSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export const chainSchema = z.union([
  z.object({
    name: z.literal('cardano'),
    network: z.union([
      z.literal('mainnet'),
      z.literal('preprod'),
      z.literal('preview'),
    ]),
  }),
  z.object({
    name: z.literal('bitcoin'),
    network: z.union([z.literal('mainnet'), z.literal('testnet')]),
  }),
]);
export type Chain = z.infer<typeof chainSchema>;

export const createApiKeySchema = z.object({
  name: z.string().min(1).nullish(),
  chain: chainSchema,
});
export type CreateApiKey = z.infer<typeof createApiKeySchema>;
