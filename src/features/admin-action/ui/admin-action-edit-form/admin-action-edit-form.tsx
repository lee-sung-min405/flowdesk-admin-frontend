import { Form, Input, Button, Alert, Divider } from 'antd';
import {
  ThunderboltOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateAdminAction } from '../../model/use-update-admin-action';
import { updateAdminActionSchema } from '../../model/update-admin-action.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './admin-action-edit-form.module.css';

type UpdateAdminActionFormValues = z.infer<typeof updateAdminActionSchema>;

interface AdminActionEditFormProps {
  actionId: number;
  defaultValues: UpdateAdminActionFormValues;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminActionEditForm({ actionId, defaultValues, onSuccess, onCancel }: AdminActionEditFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<UpdateAdminActionFormValues>({
    resolver: zodResolver(updateAdminActionSchema),
    defaultValues,
  });
  const mutation = useUpdateAdminAction();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: UpdateAdminActionFormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({
        id: actionId,
        data: {
          ...data,
          displayName: data.displayName || null,
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

      {/* 기본 정보 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <ThunderboltOutlined />
          <span>기본 정보</span>
        </div>
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
              <Input {...field} placeholder="예: read" prefix={<ThunderboltOutlined />} />
            )}
          />
        </Form.Item>
      </div>

      <Divider className={styles.divider} />

      {/* 표시 정보 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <TagOutlined />
          <span>표시 정보</span>
        </div>
        <Form.Item
          label="표시 이름"
          validateStatus={errors.displayName ? 'error' : ''}
          help={errors.displayName?.message}
          className={styles.lastFormItem}
        >
          <Controller
            name="displayName"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="예: 조회" prefix={<TagOutlined />} />
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
