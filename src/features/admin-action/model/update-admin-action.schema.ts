import { z } from 'zod';

export const updateAdminActionSchema = z.object({
  actionName: z.string().min(1, '액션 이름을 입력하세요').max(50, '최대 50자까지 입력 가능합니다'),
  displayName: z.string().optional().or(z.literal('')),
});
