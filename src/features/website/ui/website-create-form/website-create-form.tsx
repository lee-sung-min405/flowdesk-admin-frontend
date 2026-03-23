import { Form, Input, Button, Alert, InputNumber, Select } from 'antd';
import {
  CodeOutlined,
  GlobalOutlined,
  TagOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateWebsite } from '../../model/use-create-website';
import { createWebsiteSchema } from '../../model/create-website.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import type { User } from '@features/user';
import styles from './website-create-form.module.css';

type CreateWebsiteFormValues = z.infer<typeof createWebsiteSchema>;

interface WebsiteCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  users: User[];
  usersLoading: boolean;
}

export default function WebsiteCreateForm({ onSuccess, onCancel, users, usersLoading }: WebsiteCreateFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateWebsiteFormValues>({
    resolver: zodResolver(createWebsiteSchema),
    defaultValues: {
      webCode: '',
      userSeq: undefined as unknown as number,
      webUrl: '',
      webTitle: '',
      webImg: '',
      webDesc: '',
      webMemo: '',
      duplicateAllowAfterDays: 30,
    },
  });
  const mutation = useCreateWebsite();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: CreateWebsiteFormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync(data);
      onSuccess();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      <p className={styles.description}>새 웹사이트를 등록합니다.</p>

      <Form.Item
        label="웹사이트 코드"
        required
        validateStatus={errors.webCode ? 'error' : ''}
        help={errors.webCode?.message}
      >
        <Controller name="webCode" control={control} render={({ field }) => (
          <Input {...field} placeholder="예: WEB-001-MAIN" size="large" prefix={<CodeOutlined />} />
        )} />
      </Form.Item>

      <Form.Item
        label="제목"
        required
        validateStatus={errors.webTitle ? 'error' : ''}
        help={errors.webTitle?.message}
      >
        <Controller name="webTitle" control={control} render={({ field }) => (
          <Input {...field} placeholder="예: 메인 웹사이트" size="large" prefix={<TagOutlined />} />
        )} />
      </Form.Item>

      <Form.Item
        label="URL"
        required
        validateStatus={errors.webUrl ? 'error' : ''}
        help={errors.webUrl?.message}
      >
        <Controller name="webUrl" control={control} render={({ field }) => (
          <Input {...field} placeholder="https://example.com" size="large" prefix={<GlobalOutlined />} />
        )} />
      </Form.Item>

      <Form.Item
        label="관리자"
        required
        validateStatus={errors.userSeq ? 'error' : ''}
        help={errors.userSeq?.message}
      >
        <Controller name="userSeq" control={control} render={({ field }) => (
          <Select
            {...field}
            placeholder="관리자를 선택하세요"
            size="large"
            loading={usersLoading}
            showSearch
            optionFilterProp="label"
            options={users.map((u) => ({
              value: u.userSeq,
              label: `${u.userName} (${u.userId})`,
            }))}
          />
        )} />
      </Form.Item>

      <Form.Item label="이미지 URL" validateStatus={errors.webImg ? 'error' : ''} help={errors.webImg?.message}>
        <Controller name="webImg" control={control} render={({ field }) => (
          <Input {...field} placeholder="https://example.com/image.png" prefix={<FileTextOutlined />} />
        )} />
      </Form.Item>

      <Form.Item label="설명" validateStatus={errors.webDesc ? 'error' : ''} help={errors.webDesc?.message}>
        <Controller name="webDesc" control={control} render={({ field }) => (
          <Input.TextArea {...field} placeholder="웹사이트에 대한 설명을 입력하세요" rows={3} />
        )} />
      </Form.Item>

      <Form.Item label="메모" validateStatus={errors.webMemo ? 'error' : ''} help={errors.webMemo?.message}>
        <Controller name="webMemo" control={control} render={({ field }) => (
          <Input.TextArea {...field} placeholder="관리자 메모를 입력하세요" rows={2} />
        )} />
      </Form.Item>

      <Form.Item
        label="중복허용 기간 (일)"
        validateStatus={errors.duplicateAllowAfterDays ? 'error' : ''}
        help={errors.duplicateAllowAfterDays?.message}
      >
        <Controller name="duplicateAllowAfterDays" control={control} render={({ field }) => (
          <InputNumber
            {...field}
            min={0}
            placeholder="30"
            style={{ width: '100%' }}
            prefix={<CalendarOutlined />}
          />
        )} />
      </Form.Item>

      {apiError && <Alert type="error" message={apiError} showIcon className={styles.errorAlert} />}

      <div className={styles.buttonGroup}>
        <Button onClick={onCancel}>취소</Button>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>생성</Button>
      </div>
    </Form>
  );
}
