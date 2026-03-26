import { z } from 'zod';

const passwordRule = z
  .string()
  .min(8, '비밀번호는 8자 이상이어야 합니다')
  .regex(/[A-Za-z]/, '영문자를 포함해야 합니다')
  .regex(/[0-9]/, '숫자를 포함해야 합니다')
  .regex(/[!@#$%^&*]/, '특수문자를 포함해야 합니다');

export const createUserSchema = z.object({
  userId: z.string().min(1, '사용자 ID를 입력하세요'),
  password: passwordRule,
  userName: z.string().min(1, '이름을 입력하세요'),
  corpName: z.string().min(1, '부서명을 입력하세요'),
  userEmail: z.string().min(1, '이메일을 입력하세요').email('올바른 이메일을 입력하세요'),
  userTel: z.string().optional().or(z.literal('')),
  userHp: z.string().optional().or(z.literal('')),
});
