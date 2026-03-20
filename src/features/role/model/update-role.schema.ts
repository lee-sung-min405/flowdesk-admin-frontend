import { z } from 'zod';

export const updateRoleSchema = z.object({
  roleName: z.string().min(1, '역할 이름을 입력하세요').max(50, '최대 50자까지 입력 가능합니다'),
  displayName: z.string().min(1, '표시 이름을 입력하세요').max(100, '최대 100자까지 입력 가능합니다'),
  description: z.string().optional().or(z.literal('')),
});
