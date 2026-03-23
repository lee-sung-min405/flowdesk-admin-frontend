import { z } from 'zod';

export const createBlockWordSchema = z.object({
  blockWord: z
    .string()
    .min(1, '금칙어를 입력하세요')
    .max(100, '금칙어는 100자 이하로 입력하세요'),
  matchType: z.enum(['EXACT', 'CONTAINS', 'REGEX']).optional(),
  reason: z.string().max(255, '차단 사유는 255자 이하로 입력하세요').optional(),
});
