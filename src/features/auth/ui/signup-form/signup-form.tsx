import { Form, Input, Button, Alert } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import styles from './signup-form.module.css';
import type { SignupRequest } from '../../types/auth.type';
import { useSignup } from '../../model/use-signup';
import { useNavigate } from 'react-router-dom';
import { signupSchema } from '../../model/signup.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import { message } from 'antd';

type SignupFormValues = SignupRequest & { passwordConfirm: string };

export default function SignupForm() {
  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      companyName: '',
      adminName: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirm: '',
    },
  });
  const signupMutation = useSignup();
  const [apiError, setApiError] = React.useState<{ message: string; detail: string } | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: SignupFormValues) => {
    setApiError(null);
    const { passwordConfirm: _, ...signupData } = data;
    try {
      await signupMutation.mutateAsync(signupData);
      message.success('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (error: unknown) {
      const errorMessage = getApiErrorMessage(error);
      setApiError({ message: errorMessage, detail: '입력 정보를 확인해주세요.' });
      setTimeout(() => setFocus('companyName'), 0);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      <Form.Item validateStatus={errors.companyName ? 'error' : ''} help={errors.companyName?.message}>
        <Controller
          name="companyName"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="회사명" size="large" prefix={<BankOutlined />} />
          )}
        />
      </Form.Item>
      <Form.Item validateStatus={errors.adminName ? 'error' : ''} help={errors.adminName?.message}>
        <Controller
          name="adminName"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="관리자 이름" size="large" prefix={<UserOutlined />} />
          )}
        />
      </Form.Item>
      <Form.Item validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="이메일" size="large" prefix={<MailOutlined />} />
          )}
        />
      </Form.Item>
      <Form.Item validateStatus={errors.phone ? 'error' : ''} help={errors.phone?.message}>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="전화번호" size="large" prefix={<PhoneOutlined />} />
          )}
        />
      </Form.Item>
      <Form.Item validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password {...field} placeholder="비밀번호" size="large" prefix={<LockOutlined />} />
          )}
        />
      </Form.Item>
      <Form.Item validateStatus={errors.passwordConfirm ? 'error' : ''} help={errors.passwordConfirm?.message}>
        <Controller
          name="passwordConfirm"
          control={control}
          render={({ field }) => (
            <Input.Password {...field} placeholder="비밀번호 확인" size="large" prefix={<LockOutlined />} />
          )}
        />
      </Form.Item>
      {apiError && (
        <Alert
          type="error"
          message={apiError.message}
          description={apiError.detail}
          showIcon
          className={styles.errorAlert}
        />
      )}
      <Button type="primary" htmlType="submit" block size="large" loading={signupMutation.isPending}>
        회원가입
      </Button>
    </Form>
  );
}
