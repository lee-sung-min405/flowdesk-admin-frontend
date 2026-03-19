import { Form, Input, Button, Alert } from 'antd';
import {
  BankOutlined,
  TagOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateTenant } from '../../model/use-create-tenant';
import { createTenantSchema } from '../../model/create-tenant.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './tenant-create-form.module.css';

type CreateTenantFormValues = z.infer<typeof createTenantSchema>;

interface TenantCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TenantCreateForm({ onSuccess, onCancel }: TenantCreateFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateTenantFormValues>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      tenantName: '',
      displayName: '',
      domain: '',
    },
  });
  const mutation = useCreateTenant();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: CreateTenantFormValues) => {
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
      <p className={styles.description}>새 테넌트를 생성합니다.</p>

      <Form.Item
        label="테넌트 이름"
        required
        validateStatus={errors.tenantName ? 'error' : ''}
        help={errors.tenantName?.message}
      >
        <Controller
          name="tenantName"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="예: flowdesk" size="large" prefix={<BankOutlined />} />
          )}
        />
      </Form.Item>

      <Form.Item
        label="표시 이름"
        required
        validateStatus={errors.displayName ? 'error' : ''}
        help={errors.displayName?.message}
      >
        <Controller
          name="displayName"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="예: 플로우데스크" size="large" prefix={<TagOutlined />} />
          )}
        />
      </Form.Item>

      <Form.Item
        label="도메인"
        required
        validateStatus={errors.domain ? 'error' : ''}
        help={errors.domain?.message}
      >
        <Controller
          name="domain"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="예: flowdesk.co.kr" size="large" prefix={<GlobalOutlined />} />
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
