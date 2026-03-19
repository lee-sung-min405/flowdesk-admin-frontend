import { Form, Input, InputNumber, Select, Button, Alert } from 'antd';
import {
  FileOutlined,
  LinkOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateAdminPage } from '../../model/use-create-admin-page';
import { createAdminPageSchema } from '../../model/create-admin-page.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { AdminPageListItem } from '../../types/admin-page.type';
import type { z } from 'zod';
import styles from './admin-page-create-form.module.css';

type CreateAdminPageFormValues = z.infer<typeof createAdminPageSchema>;

interface AdminPageCreateFormProps {
  parentPages: AdminPageListItem[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminPageCreateForm({ parentPages, onSuccess, onCancel }: AdminPageCreateFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateAdminPageFormValues>({
    resolver: zodResolver(createAdminPageSchema),
    defaultValues: {
      pageName: '',
      path: '',
      displayName: '',
      description: '',
      parentId: null,
      sortOrder: null,
    },
  });
  const mutation = useCreateAdminPage();
  const [apiError, setApiError] = useState<string | null>(null);

  const parentOptions = parentPages
    .filter((p) => p.parentId === null)
    .map((p) => ({ label: p.displayName, value: p.pageId }));

  const onSubmit = async (data: CreateAdminPageFormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({
        ...data,
        description: data.description || null,
        parentId: data.parentId ?? null,
        sortOrder: data.sortOrder ?? null,
      });
      onSuccess();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      <p className={styles.description}>새 페이지를 등록합니다.</p>

      <div className={styles.formRow}>
        <Form.Item
          label="페이지 이름"
          required
          validateStatus={errors.pageName ? 'error' : ''}
          help={errors.pageName?.message}
        >
          <Controller
            name="pageName"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="예: users" size="large" prefix={<FileOutlined />} />
            )}
          />
        </Form.Item>
        <Form.Item
          label="경로"
          required
          validateStatus={errors.path ? 'error' : ''}
          help={errors.path?.message}
        >
          <Controller
            name="path"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="예: /users" size="large" prefix={<LinkOutlined />} />
            )}
          />
        </Form.Item>
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
            <Input {...field} placeholder="예: 사용자 관리" size="large" prefix={<TagOutlined />} />
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
            <Input.TextArea {...field} placeholder="페이지에 대한 설명을 입력하세요" rows={2} />
          )}
        />
      </Form.Item>

      <div className={styles.formRow}>
        <Form.Item label="상위 페이지">
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ?? undefined}
                onChange={(val) => field.onChange(val ?? null)}
                allowClear
                placeholder="상위 페이지 선택"
                options={parentOptions}
              />
            )}
          />
        </Form.Item>
        <Form.Item label="정렬 순서">
          <Controller
            name="sortOrder"
            control={control}
            render={({ field }) => (
              <InputNumber
                value={field.value ?? undefined}
                onChange={(val) => field.onChange(val ?? null)}
                placeholder="정렬 순서"
                min={0}
                style={{ width: '100%' }}
              />
            )}
          />
        </Form.Item>
      </div>

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
