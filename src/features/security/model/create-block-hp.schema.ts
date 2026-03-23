import { z } from 'zod';

export const createBlockHpSchema = z.object({
  blockHp: z
    .string()
    .min(1, '휴대폰 번호를 입력하세요')
    .max(20, '휴대폰 번호는 20자 이하로 입력하세요'),
  reason: z.string().max(255, '차단 사유는 255자 이하로 입력하세요').optional(),
});
