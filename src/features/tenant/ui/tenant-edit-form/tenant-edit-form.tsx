import { Form, Input, Button, Alert, Divider } from 'antd';
import {
  BankOutlined,
  TagOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateTenant } from '../../model/use-update-tenant';
import { updateTenantSchema } from '../../model/update-tenant.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './tenant-edit-form.module.css';

type UpdateTenantFormValues = z.infer<typeof updateTenantSchema>;

interface TenantEditFormProps {
  tenantId: number;
  defaultValues: UpdateTenantFormValues;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TenantEditForm({ tenantId, defaultValues, onSuccess, onCancel }: TenantEditFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<UpdateTenantFormValues>({
    resolver: zodResolver(updateTenantSchema),
    defaultValues,
  });
  const mutation = useUpdateTenant();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: UpdateTenantFormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({ id: tenantId, data });
      onSuccess();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      {apiError && (
        <Alert type="error" message={apiError} showIcon closable className={styles.errorAlert} />
      )}

      {/* 기본 정보 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <BankOutlined />
          <span>기본 정보</span>
        </div>
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
              <Input {...field} placeholder="예: flowdesk" prefix={<BankOutlined />} />
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
              <Input {...field} placeholder="예: 플로우데스크" prefix={<TagOutlined />} />
            )}
          />
        </Form.Item>
      </div>

      <Divider className={styles.divider} />

      {/* 도메인 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <GlobalOutlined />
          <span>도메인</span>
        </div>
        <Form.Item
          label="도메인"
          required
          validateStatus={errors.domain ? 'error' : ''}
          help={errors.domain?.message}
          className={styles.lastFormItem}
        >
          <Controller
            name="domain"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="예: flowdesk.co.kr" prefix={<GlobalOutlined />} />
            )}
          />
        </Form.Item>
      </div>

      <div className={styles.footer}>
        <Button onClick={onCancel}>취소</Button>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          수정
        </Button>
      </div>
    </Form>
  );
}
