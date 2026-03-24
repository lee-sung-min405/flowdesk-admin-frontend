import { z } from 'zod';

export const createMemoSchema = z.object({
  memoText: z
    .string()
    .min(1, '메모 내용을 입력하세요')
    .max(65535, '메모는 65535자 이하로 입력하세요'),
});
