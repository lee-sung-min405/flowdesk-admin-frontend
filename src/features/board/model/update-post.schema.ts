import { z } from 'zod';

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력하세요')
    .max(255, '제목은 255자 이하로 입력하세요'),
  content: z
    .string()
    .min(1, '내용을 입력하세요'),
  isNotice: z.number().optional(),
  isActive: z.number().optional(),
  startDtm: z.string().nullable().optional(),
  endDtm: z.string().nullable().optional(),
}).refine(
  (data) => {
    if (data.startDtm && data.endDtm) {
      return new Date(data.startDtm) < new Date(data.endDtm);
    }
    return true;
  },
  { message: '종료일은 시작일보다 이후여야 합니다', path: ['endDtm'] },
);
