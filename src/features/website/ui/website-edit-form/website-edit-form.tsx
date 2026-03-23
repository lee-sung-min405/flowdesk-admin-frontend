import { Form, Input, Button, Alert, InputNumber, Select, Divider } from 'antd';
import {
  GlobalOutlined,
  TagOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateWebsite } from '../../model/use-update-website';
import { updateWebsiteSchema } from '../../model/update-website.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import type { User } from '@features/user';
import styles from './website-edit-form.module.css';

type UpdateWebsiteFormValues = z.infer<typeof updateWebsiteSchema>;

interface WebsiteEditFormProps {
  webCode: string;
  defaultValues: UpdateWebsiteFormValues;
  onSuccess: () => void;
  onCancel: () => void;
  users: User[];
  usersLoading: boolean;
}

export default function WebsiteEditForm({
  webCode,
  defaultValues,
  onSuccess,
  onCancel,
  users,
  usersLoading,
}: WebsiteEditFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<UpdateWebsiteFormValues>({
    resolver: zodResolver(updateWebsiteSchema),
    defaultValues,
  });
  const mutation = useUpdateWebsite();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: UpdateWebsiteFormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({ webCode, data });
      onSuccess();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      {apiError && <Alert type="error" message={apiError} showIcon closable className={styles.errorAlert} />}

      <div className={styles.section}>
        <div className={styles.sectionHeader}><TagOutlined /><span>기본 정보</span></div>

        <Form.Item
          label="제목"
          required
          validateStatus={errors.webTitle ? 'error' : ''}
          help={errors.webTitle?.message}
        >
          <Controller name="webTitle" control={control} render={({ field }) => (
            <Input {...field} placeholder="예: 메인 웹사이트" prefix={<TagOutlined />} />
          )} />
        </Form.Item>

        <Form.Item
          label="URL"
          required
          validateStatus={errors.webUrl ? 'error' : ''}
          help={errors.webUrl?.message}
        >
          <Controller name="webUrl" control={control} render={({ field }) => (
            <Input {...field} placeholder="https://example.com" prefix={<GlobalOutlined />} />
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
              loading={usersLoading}
              showSearch
              optionFilterProp="label"
              suffixIcon={<UserOutlined />}
              options={users.map((u) => ({
                value: u.userSeq,
                label: `${u.userName} (${u.userId})`,
              }))}
            />
          )} />
        </Form.Item>
      </div>

      <Divider className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionHeader}><FileTextOutlined /><span>상세 정보</span></div>

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
          className={styles.lastFormItem}
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
      </div>

      <div className={styles.footer}>
        <Button onClick={onCancel}>취소</Button>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>수정</Button>
      </div>
    </Form>
  );
}
