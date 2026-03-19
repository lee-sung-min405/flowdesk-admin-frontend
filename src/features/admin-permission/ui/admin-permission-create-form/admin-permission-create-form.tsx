import { Form, Input, Select, Button, Alert } from 'antd';
import {
  TagOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateAdminPermission } from '../../model/use-create-admin-permission';
import { createAdminPermissionSchema } from '../../model/create-admin-permission.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './admin-permission-create-form.module.css';

type CreateAdminPermissionFormValues = z.infer<typeof createAdminPermissionSchema>;

interface PageOption {
  pageId: number;
  displayName: string;
}

interface ActionOption {
  actionId: number;
  actionName: string;
  displayName: string | null;
}

interface AdminPermissionCreateFormProps {
  pages: PageOption[];
  actions: ActionOption[];
  initialPageId?: number;
  initialActionId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminPermissionCreateForm({ pages, actions, initialPageId, initialActionId, onSuccess, onCancel }: AdminPermissionCreateFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateAdminPermissionFormValues>({
    resolver: zodResolver(createAdminPermissionSchema),
    defaultValues: {
      pageId: initialPageId ?? 0,
      actionId: initialActionId ?? 0,
      displayName: '',
      description: '',
    },
  });
  const mutation = useCreateAdminPermission();
  const [apiError, setApiError] = useState<string | null>(null);

  const pageOptions = pages.map((p) => ({ label: p.displayName, value: p.pageId }));
  const actionOptions = actions.map((a) => ({
    label: a.displayName || a.actionName,
    value: a.actionId,
  }));

  const onSubmit = async (data: CreateAdminPermissionFormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({
        ...data,
        displayName: data.displayName || null,
        description: data.description || null,
      });
      onSuccess();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      <p className={styles.description}>새 권한을 등록합니다. 페이지와 액션의 조합으로 권한이 생성됩니다.</p>

      <div className={styles.formRow}>
        <Form.Item
          label="페이지"
          required
          validateStatus={errors.pageId ? 'error' : ''}
          help={errors.pageId?.message}
        >
          <Controller
            name="pageId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || undefined}
                onChange={field.onChange}
                placeholder="페이지를 선택하세요"
                options={pageOptions}
                showSearch
                optionFilterProp="label"
                disabled={!!initialPageId}
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label="액션"
          required
          validateStatus={errors.actionId ? 'error' : ''}
          help={errors.actionId?.message}
        >
          <Controller
            name="actionId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || undefined}
                onChange={field.onChange}
                placeholder="액션을 선택하세요"
                options={actionOptions}
                showSearch
                optionFilterProp="label"
                disabled={!!initialActionId}
              />
            )}
          />
        </Form.Item>
      </div>

      <Form.Item
        label="표시 이름"
        validateStatus={errors.displayName ? 'error' : ''}
        help={errors.displayName?.message}
      >
        <Controller
          name="displayName"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="예: 사용자 조회" size="large" prefix={<TagOutlined />} />
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
            <Input.TextArea {...field} placeholder="권한에 대한 설명을 입력하세요" rows={2} />
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
