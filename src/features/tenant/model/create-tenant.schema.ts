import { z } from 'zod';

export const createTenantSchema = z.object({
  tenantName: z.string().min(1, '테넌트 이름을 입력하세요'),
  displayName: z.string().min(1, '표시 이름을 입력하세요'),
  domain: z.string().min(1, '도메인을 입력하세요'),
});
