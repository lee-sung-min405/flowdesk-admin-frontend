import { Form, Input, Button, Alert } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetUserPassword } from '../../model/use-reset-user-password';
import { resetUserPasswordSchema } from '../../model/reset-user-password.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './user-password-form.module.css';

type ResetPasswordFormValues = z.infer<typeof resetUserPasswordSchema>;

interface UserPasswordFormProps {
  userId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UserPasswordForm({ userId, onSuccess, onCancel }: UserPasswordFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetUserPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });
  const mutation = useResetUserPassword();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({ id: userId, data: { newPassword: data.newPassword } });
      onSuccess();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      <Form.Item
        label="새 비밀번호"
        validateStatus={errors.newPassword ? 'error' : ''}
        help={errors.newPassword?.message}
      >
        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <Input.Password {...field} placeholder="새 비밀번호 (8자 이상, 영문/숫자/특수문자)" size="large" prefix={<LockOutlined />} />
          )}
        />
      </Form.Item>
      <Form.Item
        label="새 비밀번호 확인"
        validateStatus={errors.confirmPassword ? 'error' : ''}
        help={errors.confirmPassword?.message}
      >
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input.Password {...field} placeholder="새 비밀번호 확인" size="large" prefix={<LockOutlined />} />
          )}
        />
      </Form.Item>

      {apiError && (
        <Alert type="error" message={apiError} showIcon className={styles.errorAlert} />
      )}

      <div className={styles.buttonGroup}>
        <Button onClick={onCancel}>취소</Button>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          비밀번호 초기화
        </Button>
      </div>
    </Form>
  );
}
