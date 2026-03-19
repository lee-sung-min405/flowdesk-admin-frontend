import { z } from 'zod';

export const updateAdminPermissionSchema = z.object({
  pageId: z.number().min(1, '페이지를 선택하세요'),
  actionId: z.number().min(1, '액션을 선택하세요'),
  displayName: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
});
