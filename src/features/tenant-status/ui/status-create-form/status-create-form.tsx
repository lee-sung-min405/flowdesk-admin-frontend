import { useState, useMemo } from 'react';
import { Form, Input, Button, Alert, InputNumber, Select, ColorPicker } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateTenantStatus } from '../../model/use-create-tenant-status';
import { createTenantStatusSchema } from '../../model/create-tenant-status.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { GetTenantStatusesResponse } from '../../types/tenant-status.type';
import type { z } from 'zod';
import styles from './status-create-form.module.css';

type FormValues = z.infer<typeof createTenantStatusSchema>;

interface StatusCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  /** 기존 그룹 목록 (자동완성용) */
  existingGroups?: GetTenantStatusesResponse;
}

export default function StatusCreateForm({
  onSuccess,
  onCancel,
  existingGroups,
}: StatusCreateFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(createTenantStatusSchema),
    defaultValues: {
      statusGroup: '',
      statusKey: '',
      statusName: '',
      description: '',
      color: '#597EF7',
      sortOrder: 1,
    },
  });

  const mutation = useCreateTenantStatus();
  const [apiError, setApiError] = useState<string | null>(null);

  // 기존 그룹 옵션
  const groupOptions = useMemo(() => {
    if (!existingGroups) return [];
    return existingGroups.groups.map((g) => ({
      value: g.statusGroup,
      label: g.statusGroup,
    }));
  }, [existingGroups]);

  const onSubmit = async (data: FormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({
        statusGroup: data.statusGroup,
        statusKey: data.statusKey,
        statusName: data.statusName,
        description: data.description || undefined,
        color: data.color,
        sortOrder: data.sortOrder,
      });
      onSuccess();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      <p className={styles.description}>새로운 상태를 생성합니다.</p>

      {/* 상태 그룹 (기존 그룹 선택 또는 직접 입력) */}
      <Form.Item
        label="상태 그룹"
        required
        validateStatus={errors.statusGroup ? 'error' : ''}
        help={errors.statusGroup?.message}
      >
        <Controller
          name="statusGroup"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              mode="tags"
              maxCount={1}
              placeholder="그룹 선택 또는 직접 입력 (예: COUNSEL_STATUS)"
              options={groupOptions}
              value={field.value ? [field.value] : []}
              onChange={(vals) => field.onChange(vals?.[0] ?? '')}
              tokenSeparators={[]}
            />
          )}
        />
      </Form.Item>

      {/* 상태 키 */}
      <Form.Item
        label="상태 키"
        required
        validateStatus={errors.statusKey ? 'error' : ''}
        help={errors.statusKey?.message}
        extra="영문 소문자, 숫자, 언더스코어(_)만 사용 가능"
      >
        <Controller
          name="statusKey"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="예: status_pending" />
          )}
        />
      </Form.Item>

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
