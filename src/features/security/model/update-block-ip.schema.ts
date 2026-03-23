import { z } from 'zod';

export const updateBlockIpSchema = z.object({
  reason: z.string().max(255, '차단 사유는 255자 이하로 입력하세요').optional(),
});
