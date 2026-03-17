import { z } from 'zod';

export const loginSchema = z.object({
  tenantName: z.string().min(1, '업체명을 입력하세요'),
  userId: z.string().min(1, '아이디를 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
});