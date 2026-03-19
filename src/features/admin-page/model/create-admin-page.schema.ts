import { z } from 'zod';

export const createAdminPageSchema = z.object({
  pageName: z.string().min(1, '페이지 이름을 입력하세요').max(100, '최대 100자까지 입력 가능합니다'),
  path: z.string().min(1, '경로를 입력하세요').max(255, '최대 255자까지 입력 가능합니다'),
  displayName: z.string().min(1, '표시 이름을 입력하세요').max(100, '최대 100자까지 입력 가능합니다'),
  description: z.string().optional().or(z.literal('')),
  parentId: z.number().nullable(),
  sortOrder: z.number().nullable(),
});
