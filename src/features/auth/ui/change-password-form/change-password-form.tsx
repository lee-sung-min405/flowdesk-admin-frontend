import { Form, Input, Button, Alert } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChangePassword } from '../../model/use-change-password';
import { changePasswordSchema } from '../../model/change-password.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { ChangePasswordRequest } from '../../types/auth.type';
import styles from './change-password-form.module.css';

interface ChangePasswordFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ChangePasswordForm({ onSuccess, onCancel }: ChangePasswordFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<ChangePasswordRequest>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const mutation = useChangePassword();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: ChangePasswordRequest) => {
    setApiError(null);
    try {
      await mutation.mutateAsync(data);
      onSuccess();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      <Form.Item
        label="현재 비밀번호"
        validateStatus={errors.currentPassword ? 'error' : ''}
        help={errors.currentPassword?.message}
      >
        <Controller
          name="currentPassword"
          control={control}
          render={({ field }) => (
            <Input.Password {...field} placeholder="현재 비밀번호" size="large" prefix={<LockOutlined />} />
          )}
        />
      </Form.Item>
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
          비밀번호 변경
        </Button>
      </div>
    </Form>
  );
}
