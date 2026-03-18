import { z } from 'zod';

const passwordRule = z
  .string()
  .min(8, '비밀번호는 8자 이상이어야 합니다')
  .regex(/[A-Za-z]/, '영문자를 포함해야 합니다')
  .regex(/[0-9]/, '숫자를 포함해야 합니다')
  .regex(/[!@#$%^&*]/, '특수문자를 포함해야 합니다');

export const resetUserPasswordSchema = z
  .object({
    newPassword: passwordRule,
    confirmPassword: z.string().min(1, '비밀번호를 다시 입력하세요'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });
