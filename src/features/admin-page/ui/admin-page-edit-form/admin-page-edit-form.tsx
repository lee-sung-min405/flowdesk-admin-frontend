import { Form, Input, InputNumber, Select, Button, Alert, Divider } from 'antd';
import {
  FileOutlined,
  LinkOutlined,
  TagOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateAdminPage } from '../../model/use-update-admin-page';
import { updateAdminPageSchema } from '../../model/update-admin-page.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { AdminPageListItem } from '../../types/admin-page.type';
import type { z } from 'zod';
import styles from './admin-page-edit-form.module.css';

type UpdateAdminPageFormValues = z.infer<typeof updateAdminPageSchema>;

interface AdminPageEditFormProps {
  pageId: number;
  defaultValues: UpdateAdminPageFormValues;
  parentPages: AdminPageListItem[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminPageEditForm({ pageId, defaultValues, parentPages, onSuccess, onCancel }: AdminPageEditFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<UpdateAdminPageFormValues>({
    resolver: zodResolver(updateAdminPageSchema),
    defaultValues,
  });
  const mutation = useUpdateAdminPage();
  const [apiError, setApiError] = useState<string | null>(null);

  const parentOptions = parentPages
    .filter((p) => p.parentId === null && p.pageId !== pageId)
    .map((p) => ({ label: p.displayName, value: p.pageId }));

  const onSubmit = async (data: UpdateAdminPageFormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({
        id: pageId,
        data: {
          ...data,
          description: data.description || null,
          parentId: data.parentId ?? null,
          sortOrder: data.sortOrder ?? null,
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
          <FileOutlined />
          <span>기본 정보</span>
        </div>
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
                <Input {...field} placeholder="예: users" prefix={<FileOutlined />} />
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
                <Input {...field} placeholder="예: /users" prefix={<LinkOutlined />} />
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
              <Input {...field} placeholder="예: 사용자 관리" prefix={<TagOutlined />} />
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
      </div>

      <Divider className={styles.divider} />

      {/* 계층 구조 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <ApartmentOutlined />
          <span>계층 구조</span>
        </div>
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
          <Form.Item label="정렬 순서" className={styles.lastFormItem}>
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
