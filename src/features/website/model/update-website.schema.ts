import { z } from 'zod';

export const updateWebsiteSchema = z.object({
  userSeq: z.number({ error: '관리자를 선택하세요' }).int().positive('관리자를 선택하세요'),
  webUrl: z
    .string()
    .min(1, 'URL을 입력하세요')
    .url('올바른 URL 형식을 입력하세요'),
  webTitle: z
    .string()
    .min(1, '제목을 입력하세요')
    .max(200, '제목은 200자 이하로 입력하세요'),
  webImg: z.string().optional(),
  webDesc: z.string().max(500, '설명은 500자 이하로 입력하세요').optional(),
  webMemo: z.string().max(500, '메모는 500자 이하로 입력하세요').optional(),
  duplicateAllowAfterDays: z
    .number()
    .int('정수만 입력 가능합니다')
    .min(0, '0 이상의 값을 입력하세요')
    .optional(),
});
