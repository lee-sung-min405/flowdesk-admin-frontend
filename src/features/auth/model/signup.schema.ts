import { z } from 'zod';

export const signupSchema = z
  .object({
    companyName: z.string().min(1, '부서명을 입력하세요'),
    adminName: z.string().min(1, '관리자 이름을 입력하세요'),
    tenantName: z.string().min(1, '테넌트 이름을 입력하세요'),
    email: z
      .string()
      .min(1, '이메일을 입력하세요')
      .email('올바른 이메일 형식이 아닙니다'),
    phone: z.string().min(1, '전화번호를 입력하세요'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .regex(/[A-Z]/, '대문자를 포함해야 합니다')
      .regex(/[0-9]/, '숫자를 포함해야 합니다')
      .regex(/[!@#$%^&*]/, '특수문자를 포함해야 합니다'),
    passwordConfirm: z.string().min(1, '비밀번호를 다시 입력하세요'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });
