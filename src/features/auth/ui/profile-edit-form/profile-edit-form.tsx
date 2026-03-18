import { Form, Input, Button, Alert } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateProfile } from '../../model/use-update-profile';
import { updateProfileSchema } from '../../model/update-profile.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { UpdateProfileRequest } from '../../types/auth.type';
import type { z } from 'zod';
import styles from './profile-edit-form.module.css';

type ProfileEditFormValues = z.infer<typeof updateProfileSchema>;

interface ProfileEditFormProps {
  defaultValues: Required<UpdateProfileRequest>;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProfileEditForm({ defaultValues, onSuccess, onCancel }: ProfileEditFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<ProfileEditFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
  });
  const mutation = useUpdateProfile();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: ProfileEditFormValues) => {
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
        label="회사명"
        validateStatus={errors.corpName ? 'error' : ''}
        help={errors.corpName?.message}
      >
        <Controller
          name="corpName"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="회사명" size="large" prefix={<BankOutlined />} />
          )}
        />
      </Form.Item>
      <Form.Item
        label="이름"
        validateStatus={errors.userName ? 'error' : ''}
        help={errors.userName?.message}
      >
        <Controller
          name="userName"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="이름" size="large" prefix={<UserOutlined />} />
          )}
        />
      </Form.Item>
      <Form.Item
        label="이메일"
        validateStatus={errors.userEmail ? 'error' : ''}
        help={errors.userEmail?.message}
      >
        <Controller
          name="userEmail"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="이메일" size="large" prefix={<MailOutlined />} />
          )}
        />
      </Form.Item>
      <Form.Item
        label="전화번호"
        validateStatus={errors.userTel ? 'error' : ''}
        help={errors.userTel?.message}
      >
        <Controller
          name="userTel"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="전화번호" size="large" prefix={<PhoneOutlined />} />
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
            <Input {...field} placeholder="휴대폰 번호" size="large" prefix={<PhoneOutlined />} />
          )}
        />
      </Form.Item>

      {apiError && (
        <Alert type="error" message={apiError} showIcon className={styles.errorAlert} />
      )}

      <div className={styles.buttonGroup}>
        <Button onClick={onCancel}>취소</Button>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          저장
        </Button>
      </div>
    </Form>
  );
}
