import { Form, Input, Button, Alert } from 'antd';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import styles from './login-form.module.css';
import type { LoginRequest } from '../types/auth.type';
import { useLogin } from '../model/use-login';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../model/login.schema';
import { getApiErrorMessage } from '../../../shared/utils/api-error-message';

export default function LoginForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      tenantName: '',
      userId: '',
      password: '',
    },
  });
  const loginMutation = useLogin();
  const [apiError, setApiError] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const onSubmit = (data: LoginRequest) => {
    setApiError(null);
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate('/dashboard');
      },
      onError: (error: unknown) => {
        const message = getApiErrorMessage(error);
        setApiError(message + '\n다시 입력해주세요.');
        if (formRef.current) {
          const inputs = formRef.current.querySelectorAll('input');
          inputs.forEach(input => (input.value = ''));
          setTimeout(() => {
            if (inputs.length > 0) inputs[0].focus();
          }, 100);
        }
      }
    });
  };
  return (
    <div ref={formRef}>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
        <Form.Item label="회사명" validateStatus={errors.tenantName ? 'error' : ''} help={errors.tenantName?.message}>
          <Controller
            name="tenantName"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="업체명" size="large" />
            )}
          />
        </Form.Item>
        <Form.Item label="아이디" validateStatus={errors.userId ? 'error' : ''} help={errors.userId?.message}>
          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="아이디" size="large" />
            )}
          />
        </Form.Item>
        <Form.Item label="비밀번호" validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password {...field} placeholder="비밀번호" size="large" />
            )}
          />
        </Form.Item>
        {apiError && (
          <Alert
            type="error"
            message={apiError.split('\n')[0] ?? '에러 발생'}
            description={apiError.split('\n')[1] ?? ''}
            showIcon
            className={styles.errorAlert}
          />
        )}
        <Button type="primary" htmlType="submit" block size="large" loading={loginMutation.isPending}>
          로그인
        </Button>
      </Form>
    </div>
  );
}