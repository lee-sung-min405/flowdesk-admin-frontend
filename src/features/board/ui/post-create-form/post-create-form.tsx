import { Form, Input, Button, Alert, Switch, DatePicker } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useCreatePost } from '../../model/use-create-post';
import { createPostSchema } from '../../model/create-post.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import RichTextEditor from '@shared/ui/rich-text-editor/rich-text-editor';
import type { z } from 'zod';
import styles from './post-create-form.module.css';

type CreateFormValues = z.infer<typeof createPostSchema>;

interface PostCreateFormProps {
  boardId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PostCreateForm({ boardId, onSuccess, onCancel }: PostCreateFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { title: '', content: '', isNotice: 0, startDtm: null, endDtm: null },
  });
  const mutation = useCreatePost();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: CreateFormValues) => {
    setApiError(null);
    try {
      const cleaned = JSON.parse(JSON.stringify(data));
      await mutation.mutateAsync({ boardId, data: cleaned });
      onSuccess();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      <p className={styles.description}>새 게시글을 작성합니다.</p>

      <Form.Item
        label="제목"
        required
        validateStatus={errors.title ? 'error' : ''}
        help={errors.title?.message}
      >
        <Controller name="title" control={control} render={({ field }) => (
          <Input {...field} placeholder="게시글 제목을 입력하세요" size="large" />
        )} />
      </Form.Item>

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

      {apiError && <Alert type="error" message={apiError} showIcon className={styles.errorAlert} />}

      <div className={styles.buttonGroup}>
        <Button onClick={onCancel}>취소</Button>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>등록</Button>
      </div>
    </Form>
  );
}
