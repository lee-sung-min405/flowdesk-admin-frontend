import { z } from 'zod';

export const updateBlockWordSchema = z.object({
  matchType: z.enum(['EXACT', 'CONTAINS', 'REGEX']).optional(),
  reason: z.string().max(255, '차단 사유는 255자 이하로 입력하세요').optional(),
});
