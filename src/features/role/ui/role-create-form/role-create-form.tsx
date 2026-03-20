import { Form, Input, Button, Alert } from 'antd';
import { SafetyOutlined, TagOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRole } from '../../model/use-create-role';
import { createRoleSchema } from '../../model/create-role.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './role-create-form.module.css';

type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

interface RoleCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RoleCreateForm({ onSuccess, onCancel }: RoleCreateFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      roleName: '',
      displayName: '',
      description: '',
    },
  });
  const mutation = useCreateRole();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: CreateRoleFormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({
        ...data,
        description: data.description || undefined,
      });
      onSuccess();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      <p className={styles.description}>새 역할을 등록합니다.</p>

      <Form.Item
        label="역할 이름"
        required
        validateStatus={errors.roleName ? 'error' : ''}
        help={errors.roleName?.message}
      >
        <Controller
          name="roleName"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="예: admin, editor, viewer" size="large" prefix={<SafetyOutlined />} />
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
            <Input {...field} placeholder="예: 관리자, 편집자, 뷰어" size="large" prefix={<TagOutlined />} />
          )}
        />
      </Form.Item>

      <Form.Item
        label="설명"
        validateStatus={errors.description ? 'error' : ''}
        help={errors.description?.message}
      >
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input.TextArea {...field} placeholder="역할에 대한 설명을 입력하세요 (선택)" rows={3} />
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
