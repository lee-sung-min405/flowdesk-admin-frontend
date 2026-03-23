import { z } from 'zod';

export const updateTenantStatusSchema = z.object({
  statusName: z
    .string()
    .min(1, '상태명을 입력하세요')
    .max(50, '최대 50자까지 입력 가능합니다'),
  description: z.string().optional().or(z.literal('')),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, '올바른 HEX 색상 코드를 입력하세요 (#RRGGBB)'),
  sortOrder: z.number().int().min(0, '0 이상의 정수를 입력하세요').optional(),
});
