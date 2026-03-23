import { z } from 'zod';

export const createBlockIpSchema = z.object({
  blockIp: z
    .string()
    .min(1, 'IP 주소를 입력하세요')
    .max(45, 'IP 주소는 45자 이하로 입력하세요'),
  reason: z.string().max(255, '차단 사유는 255자 이하로 입력하세요').optional(),
});
