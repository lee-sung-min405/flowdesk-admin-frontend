import { Form, Input, Select, Button, Alert, Divider } from 'antd';
import {
  SafetyCertificateOutlined,
  TagOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateAdminPermission } from '../../model/use-update-admin-permission';
import { updateAdminPermissionSchema } from '../../model/update-admin-permission.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './admin-permission-edit-form.module.css';

type UpdateAdminPermissionFormValues = z.infer<typeof updateAdminPermissionSchema>;

interface PageOption {
  pageId: number;
  displayName: string;
}

interface ActionOption {
  actionId: number;
  actionName: string;
  displayName: string | null;
}

interface AdminPermissionEditFormProps {
  permissionId: number;
  defaultValues: UpdateAdminPermissionFormValues;
  pages: PageOption[];
  actions: ActionOption[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminPermissionEditForm({ permissionId, defaultValues, pages, actions, onSuccess, onCancel }: AdminPermissionEditFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<UpdateAdminPermissionFormValues>({
    resolver: zodResolver(updateAdminPermissionSchema),
    defaultValues,
  });
  const mutation = useUpdateAdminPermission();
  const [apiError, setApiError] = useState<string | null>(null);

  const pageOptions = pages.map((p) => ({ label: p.displayName, value: p.pageId }));
  const actionOptions = actions.map((a) => ({
    label: a.displayName || a.actionName,
    value: a.actionId,
  }));

  const onSubmit = async (data: UpdateAdminPermissionFormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({
        id: permissionId,
        data: {
          ...data,
          displayName: data.displayName || null,
          description: data.description || null,
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

      {/* 연결 정보 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <SafetyCertificateOutlined />
          <span>연결 정보</span>
        </div>
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
                />
              )}
            />
          </Form.Item>
        </div>
      </div>

      <Divider className={styles.divider} />

      {/* 표시 정보 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <FileTextOutlined />
          <span>표시 정보</span>
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
              <Input {...field} placeholder="예: 사용자 조회" prefix={<TagOutlined />} />
            )}
          />
        </Form.Item>
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
              <Input.TextArea {...field} placeholder="권한에 대한 설명을 입력하세요" rows={2} />
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
