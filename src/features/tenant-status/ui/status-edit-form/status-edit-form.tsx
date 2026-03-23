import { useState } from 'react';
import { Form, Input, Button, Alert, InputNumber, ColorPicker } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateTenantStatus } from '../../model/use-update-tenant-status';
import { updateTenantStatusSchema } from '../../model/update-tenant-status.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './status-edit-form.module.css';

type FormValues = z.infer<typeof updateTenantStatusSchema>;

interface StatusEditFormProps {
  tenantStatusId: number;
  defaultValues: FormValues;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function StatusEditForm({
  tenantStatusId,
  defaultValues,
  onSuccess,
  onCancel,
}: StatusEditFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(updateTenantStatusSchema),
    defaultValues,
  });

  const mutation = useUpdateTenantStatus();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({
        id: tenantStatusId,
        data: {
          statusName: data.statusName,
          description: data.description || undefined,
          color: data.color,
          sortOrder: data.sortOrder,
        },
      });
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

      {/* 상태명 */}
      <Form.Item
        label="상태명"
        required
        validateStatus={errors.statusName ? 'error' : ''}
        help={errors.statusName?.message}
      >
        <Controller
          name="statusName"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="예: 접수대기" />
          )}
        />
      </Form.Item>

      {/* 설명 */}
      <Form.Item
        label="설명"
        validateStatus={errors.description ? 'error' : ''}
        help={errors.description?.message}
      >
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input.TextArea {...field} placeholder="상태에 대한 설명 (선택사항)" rows={2} />
          )}
        />
      </Form.Item>

      {/* 색상 */}
      <Form.Item
        label="색상"
        required
        validateStatus={errors.color ? 'error' : ''}
        help={errors.color?.message}
      >
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <ColorPicker
              value={field.value}
              onChange={(_, hex) => {
                field.onChange(hex);
              }}
              showText
              format="hex"
            />
          )}
        />
      </Form.Item>

      {/* 정렬 순서 */}
      <Form.Item
        label="정렬 순서"
        validateStatus={errors.sortOrder ? 'error' : ''}
        help={errors.sortOrder?.message}
      >
        <Controller
          name="sortOrder"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0}
              placeholder="0"
              style={{ width: '100%' }}
            />
          )}
        />
      </Form.Item>

      <div className={styles.footer}>
        <Button onClick={onCancel}>취소</Button>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          수정
        </Button>
      </div>
    </Form>
  );
}
