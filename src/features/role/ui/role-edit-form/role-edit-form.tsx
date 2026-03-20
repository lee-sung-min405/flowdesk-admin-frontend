import { Form, Input, Button, Alert, Divider } from 'antd';
import { SafetyOutlined, TagOutlined, FileTextOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateRole } from '../../model/use-update-role';
import { updateRoleSchema } from '../../model/update-role.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './role-edit-form.module.css';

type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;

interface RoleEditFormProps {
  roleId: number;
  defaultValues: UpdateRoleFormValues;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RoleEditForm({ roleId, defaultValues, onSuccess, onCancel }: RoleEditFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<UpdateRoleFormValues>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues,
  });
  const mutation = useUpdateRole();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: UpdateRoleFormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({
        id: roleId,
        data: {
          ...data,
          description: data.description || undefined,
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
          <SafetyOutlined />
          <span>기본 정보</span>
        </div>
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
              <Input {...field} placeholder="예: admin" prefix={<SafetyOutlined />} />
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
          required
          validateStatus={errors.displayName ? 'error' : ''}
          help={errors.displayName?.message}
        >
          <Controller
            name="displayName"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="예: 관리자" prefix={<TagOutlined />} />
            )}
          />
        </Form.Item>
      </div>

      <Divider className={styles.divider} />

      {/* 설명 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <FileTextOutlined />
          <span>설명</span>
        </div>
        <Form.Item
          label="설명"
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description?.message}
          className={styles.lastFormItem}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea {...field} placeholder="역할에 대한 설명 (선택)" rows={3} />
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
