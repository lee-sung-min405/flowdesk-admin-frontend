import { Form, Input, Button, Alert, Switch, DatePicker, Divider } from 'antd';
import { TagOutlined, FileTextOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useUpdatePost } from '../../model/use-update-post';
import { updatePostSchema } from '../../model/update-post.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import RichTextEditor from '@shared/ui/rich-text-editor/rich-text-editor';
import type { z } from 'zod';
import styles from './post-edit-form.module.css';

type UpdateFormValues = z.infer<typeof updatePostSchema>;

interface PostEditFormProps {
  boardId: number;
  postId: number;
  defaultValues: UpdateFormValues;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PostEditForm({
  boardId,
  postId,
  defaultValues,
  onSuccess,
  onCancel,
}: PostEditFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<UpdateFormValues>({
    resolver: zodResolver(updatePostSchema),
    defaultValues,
  });
  const mutation = useUpdatePost();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: UpdateFormValues) => {
    setApiError(null);
    try {
      const cleaned = JSON.parse(JSON.stringify(data));
      await mutation.mutateAsync({ boardId, postId, data: cleaned });
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
          validateStatus={errors.title ? 'error' : ''}
          help={errors.title?.message}
        >
          <Controller name="title" control={control} render={({ field }) => (
            <Input {...field} placeholder="게시글 제목" prefix={<TagOutlined />} />
          )} />
        </Form.Item>

        <Form.Item label="공지 여부">
          <Controller name="isNotice" control={control} render={({ field }) => (
            <Switch
              checked={field.value === 1}
              onChange={(checked) => field.onChange(checked ? 1 : 0)}
              checkedChildren="공지"
              unCheckedChildren="일반"
            />
          )} />
        </Form.Item>

        <Form.Item label="활성 상태">
          <Controller name="isActive" control={control} render={({ field }) => (
            <Switch
              checked={field.value === 1}
              onChange={(checked) => field.onChange(checked ? 1 : 0)}
              checkedChildren="활성"
              unCheckedChildren="비활성"
            />
          )} />
        </Form.Item>
      </div>

      <Divider className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionHeader}><FileTextOutlined /><span>내용 및 설정</span></div>

        <Form.Item
          label="내용"
          required
          validateStatus={errors.content ? 'error' : ''}
          help={errors.content?.message}
        >
          <Controller name="content" control={control} render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="게시글 내용을 입력하세요"
            />
          )} />
        </Form.Item>

        <div className={styles.dateRow}>
          <Form.Item label="게시 시작일" className={styles.dateItem}>
            <Controller name="startDtm" control={control} render={({ field }) => (
              <DatePicker
                showTime
                style={{ width: '100%' }}
                placeholder="즉시 노출"
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date ? date.toISOString() : null)}
              />
            )} />
          </Form.Item>
          <Form.Item label="게시 종료일" className={styles.dateItem}>
            <Controller name="endDtm" control={control} render={({ field }) => (
              <DatePicker
                showTime
                style={{ width: '100%' }}
                placeholder="제한 없음"
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date ? date.toISOString() : null)}
              />
            )} />
          </Form.Item>
        </div>
      </div>

      <div className={styles.footer}>
        <Button onClick={onCancel}>취소</Button>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>수정</Button>
      </div>
    </Form>
  );
}
