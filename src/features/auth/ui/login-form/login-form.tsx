import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { ApartmentOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import styles from './login-form.module.css';
import type { LoginRequest } from '../../types/auth.type';
import { useLogin } from '../../model/use-login';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../../model/login.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import { queryClient } from '@shared/api/query-client';

export default function LoginForm() {
  const { control, handleSubmit, reset, setFocus, formState: { errors } } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      tenantName: '',
      userId: '',
      password: '',
    },
  });
  const loginMutation = useLogin();
  const [apiError, setApiError] = React.useState<{ message: string; detail: string } | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginRequest) => {
    setApiError(null);
    try {
      queryClient.clear();
      await loginMutation.mutateAsync(data);
      navigate('/home');
    } catch (error: unknown) {
      const message = getApiErrorMessage(error);
      setApiError({ message, detail: '다시 입력해주세요.' });
      reset();
      setTimeout(() => setFocus('tenantName'), 0);
    }
  };
  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      <Form.Item validateStatus={errors.tenantName ? 'error' : ''} help={errors.tenantName?.message}>
        <Controller
          name="tenantName"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="업체명" size="large" prefix={<ApartmentOutlined />} />
          )}
        />
      </Form.Item>
      <Form.Item validateStatus={errors.userId ? 'error' : ''} help={errors.userId?.message}>
        <Controller
          name="userId"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="아이디" size="large" prefix={<UserOutlined />} />
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
      {apiError && (
        <Alert
          type="error"
          message={apiError.message}
          description={apiError.detail}
          showIcon
          className={styles.errorAlert}
        />
      )}
      <Button type="primary" htmlType="submit" block size="large" loading={loginMutation.isPending}>
        로그인
      </Button>
    </Form>
  );
}