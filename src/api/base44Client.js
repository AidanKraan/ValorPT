import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { token, functionsVersion, appBaseUrl } = appParams;

export const base44 = createClient({
  appId: "69e81d1ec659514472fd35e0",
  token,
  functionsVersion,
  requiresAuth: false,
  appBaseUrl
});
