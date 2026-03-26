import { Form, Input, Button, Alert } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUser } from '../../model/use-create-user';
import { createUserSchema } from '../../model/create-user.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './user-create-form.module.css';

type CreateUserFormValues = z.infer<typeof createUserSchema>;

interface UserCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UserCreateForm({ onSuccess, onCancel }: UserCreateFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      userId: '',
      password: '',
      userName: '',
      corpName: '',
      userEmail: '',
      userTel: '',
      userHp: '',
    },
  });
  const mutation = useCreateUser();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: CreateUserFormValues) => {
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
      <p className={styles.description}>새 사용자를 생성합니다.</p>

      <div className={styles.formRow}>
        <Form.Item
          label="사용자 ID"
          required
          validateStatus={errors.userId ? 'error' : ''}
          help={errors.userId?.message}
        >
          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="예: john.doe" size="large" prefix={<UserOutlined />} />
            )}
          />
        </Form.Item>
        <Form.Item
          label="비밀번호"
          required
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password {...field} placeholder="8자 이상" size="large" prefix={<LockOutlined />} />
            )}
          />
        </Form.Item>
      </div>

      <div className={styles.formRow}>
        <Form.Item
          label="이름"
          required
          validateStatus={errors.userName ? 'error' : ''}
          help={errors.userName?.message}
        >
          <Controller
            name="userName"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="예: 홍길동" size="large" prefix={<UserOutlined />} />
            )}
          />
        </Form.Item>
        <Form.Item
          label="부서명"
          required
          validateStatus={errors.corpName ? 'error' : ''}
          help={errors.corpName?.message}
        >
          <Controller
            name="corpName"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="예: ACME 주식회사" size="large" prefix={<BankOutlined />} />
            )}
          />
        </Form.Item>
      </div>

      <Form.Item
        label="이메일"
        validateStatus={errors.userEmail ? 'error' : ''}
        help={errors.userEmail?.message}
      >
        <Controller
          name="userEmail"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="예: user@company.com" size="large" prefix={<MailOutlined />} />
          )}
        />
      </Form.Item>

      <div className={styles.formRow}>
        <Form.Item
          label="전화번호"
          validateStatus={errors.userTel ? 'error' : ''}
          help={errors.userTel?.message}
        >
          <Controller
            name="userTel"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="예: 02-1234-5678" size="large" prefix={<PhoneOutlined />} />
            )}
          />
        </Form.Item>
        <Form.Item
          label="휴대폰"
          validateStatus={errors.userHp ? 'error' : ''}
          help={errors.userHp?.message}
        >
          <Controller
            name="userHp"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="예: 010-1234-5678" size="large" prefix={<PhoneOutlined />} />
            )}
          />
        </Form.Item>
      </div>

      {apiError && (
        <Alert type="error" message={apiError} showIcon className={styles.errorAlert} />
      )}

      <div className={styles.buttonGroup}>
        <Button onClick={onCancel}>취소</Button>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          생성
        </Button>
      </div>
    </Form>
  );
}
