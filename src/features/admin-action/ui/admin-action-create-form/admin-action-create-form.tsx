import { Form, Input, Button, Alert } from 'antd';
import {
  ThunderboltOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateAdminAction } from '../../model/use-create-admin-action';
import { createAdminActionSchema } from '../../model/create-admin-action.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './admin-action-create-form.module.css';

type CreateAdminActionFormValues = z.infer<typeof createAdminActionSchema>;

interface AdminActionCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminActionCreateForm({ onSuccess, onCancel }: AdminActionCreateFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateAdminActionFormValues>({
    resolver: zodResolver(createAdminActionSchema),
    defaultValues: {
      actionName: '',
      displayName: '',
    },
  });
  const mutation = useCreateAdminAction();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: CreateAdminActionFormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({
        ...data,
        displayName: data.displayName || null,
      });
      onSuccess();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      <p className={styles.description}>새 액션을 등록합니다.</p>

      <Form.Item
        label="액션 이름"
        required
        validateStatus={errors.actionName ? 'error' : ''}
        help={errors.actionName?.message}
      >
        <Controller
          name="actionName"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="예: read, create, update, delete" size="large" prefix={<ThunderboltOutlined />} />
          )}
        />
      </Form.Item>

      <Form.Item
        label="표시 이름"
        validateStatus={errors.displayName ? 'error' : ''}
        help={errors.displayName?.message}
      >
        <Controller
          name="displayName"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="예: 조회, 생성, 수정, 삭제" size="large" prefix={<TagOutlined />} />
          )}
        />
      </Form.Item>

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
