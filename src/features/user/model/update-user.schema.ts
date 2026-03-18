import { z } from 'zod';

export const updateUserSchema = z.object({
  userName: z.string().min(1, '이름을 입력하세요'),
  corpName: z.string().min(1, '회사명을 입력하세요'),
  userEmail: z.string().min(1, '이메일을 입력하세요').email('올바른 이메일을 입력하세요'),
  userTel: z.string().optional().or(z.literal('')),
  userHp: z.string().optional().or(z.literal('')),
});
