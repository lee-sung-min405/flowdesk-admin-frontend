import { z } from 'zod';

export const createBoardTypeSchema = z.object({
  boardKey: z
    .string()
    .min(1, '게시판 키를 입력하세요')
    .max(64, '게시판 키는 64자 이하로 입력하세요')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, '소문자, 숫자, 하이픈만 사용 가능합니다 (예: notice, free-board)'),
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
