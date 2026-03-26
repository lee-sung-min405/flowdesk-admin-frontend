import { z } from 'zod';

export const createTenantStatusSchema = z.object({
  statusGroup: z
    .string()
    .min(1, '상태 그룹을 입력하세요')
    .max(50, '최대 50자까지 입력 가능합니다'),
  statusKey: z
    .string()
    .min(1, '상태 키를 입력하세요')
    .max(50, '최대 50자까지 입력 가능합니다')
    .regex(/^[a-z0-9_]+$/, '영문 소문자, 숫자, 언더스코어(_)만 사용 가능합니다'),
  statusName: z
    .string()
    .min(1, '상태명을 입력하세요')
    .max(50, '최대 50자까지 입력 가능합니다'),
  description: z.string().optional().or(z.literal('')),
  color: z.string().max(7, '올바른 HEX 색상 코드를 입력하세요 (예: #FF0000)'),
  sortOrder: z.number().int().min(0, '0 이상의 정수를 입력하세요').optional(),
});
