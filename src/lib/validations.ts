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

const cardanoNetworks = ['mainnet', 'preprod', 'preview'] as const;
const bitcoinNetworks = ['mainnet', 'testnet'] as const;

export const chainSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('cardano'),
    network: z.enum(cardanoNetworks),
  }),
  z.object({
    name: z.literal('bitcoin'),
    network: z.enum(bitcoinNetworks),
  }),
]);

export type Chain = z.infer<typeof chainSchema>;

// Define the base structure for CreateApiKey
const createApiKeyBase = z.object({
  keyName: z.string().min(1).nullish(),
  name: z.enum(['cardano', 'bitcoin']),
  network: z.string(),
});

// Define the type without circular reference
export type CreateApiKey = z.infer<typeof createApiKeyBase>;

// Create the schema with refinement
export const createApiKeySchema = createApiKeyBase.refine(
  (data): data is CreateApiKey => {
    if (data.name === 'cardano') {
      // @ts-expect-error it is what it is
      return cardanoNetworks.includes(data.network);
    } else if (data.name === 'bitcoin') {
      // @ts-expect-error it is what it is
      return bitcoinNetworks.includes(data.network);
    }

    return false;
  },
  {
    message: 'Network must be valid for the selected blockchain',
    path: ['network'],
  },
);

export const inviteUserSchema = z.object({
  email: z.string().email(),
});
export type InviteUser = z.infer<typeof inviteUserSchema>;
