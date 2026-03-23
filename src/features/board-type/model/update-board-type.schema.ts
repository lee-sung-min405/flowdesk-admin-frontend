import { z } from 'zod';

export const updateBoardTypeSchema = z.object({
  name: z
    .string()
    .min(1, '게시판 이름을 입력하세요')
    .max(256, '게시판 이름은 256자 이하로 입력하세요'),
  description: z.string().max(255, '설명은 255자 이하로 입력하세요').optional(),
  sortOrder: z
    .number()
    .int('정수만 입력 가능합니다')
    .min(0, '0 이상의 값을 입력하세요')
    .optional(),
});
