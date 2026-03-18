import { z } from 'zod';

export const updateProfileSchema = z.object({
  corpName: z.string().min(1, '회사명을 입력하세요').max(100, '회사명은 100자 이하로 입력하세요'),
  userName: z.string().min(1, '이름을 입력하세요').max(50, '이름은 50자 이하로 입력하세요'),
  userEmail: z
    .string()
    .min(1, '이메일을 입력하세요')
    .email('올바른 이메일 형식이 아닙니다'),
  userTel: z.string().max(20, '전화번호는 20자 이하로 입력하세요').optional().or(z.literal('')),
  userHp: z.string().max(20, '휴대폰 번호는 20자 이하로 입력하세요').optional().or(z.literal('')),
});
