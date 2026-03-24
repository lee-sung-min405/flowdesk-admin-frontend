import { z } from 'zod';

export const updateCounselSchema = z.object({
  name: z.string().max(50, '이름은 50자 이하로 입력하세요').nullable().optional(),
  counselHp: z.string().max(50, '전화번호는 50자 이하로 입력하세요').optional(),
  empSeq: z.number().int().nullable().optional(),
  counselSource: z.string().max(50).nullable().optional(),
  counselMedium: z.string().max(50).nullable().optional(),
  counselCampaign: z.string().max(50).nullable().optional(),
  counselResvDtm: z.string().nullable().optional(),
  counselMemo: z.string().max(255, '메모는 255자 이하로 입력하세요').nullable().optional(),
});
