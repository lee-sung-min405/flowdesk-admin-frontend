import { Form, Input, Button, Alert, InputNumber } from 'antd';
import { KeyOutlined, TagOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateBoardType } from '../../model/use-create-board-type';
import { createBoardTypeSchema } from '../../model/create-board-type.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './board-type-create-form.module.css';

type CreateFormValues = z.infer<typeof createBoardTypeSchema>;

interface BoardTypeCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BoardTypeCreateForm({ onSuccess, onCancel }: BoardTypeCreateFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateFormValues>({
    resolver: zodResolver(createBoardTypeSchema),
    defaultValues: { boardKey: '', name: '', description: '', sortOrder: undefined },
  });
  const mutation = useCreateBoardType();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: CreateFormValues) => {
    setApiError(null);
    try {
      const cleaned = JSON.parse(JSON.stringify(data));
      await mutation.mutateAsync(cleaned);
      onSuccess();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      <p className={styles.description}>새 게시판을 생성합니다.</p>

      <Form.Item
        label="게시판 키"
        required
        validateStatus={errors.boardKey ? 'error' : ''}
        help={errors.boardKey?.message}
      >
        <Controller name="boardKey" control={control} render={({ field }) => (
          <Input {...field} placeholder="예: notice, faq, free-board" size="large" prefix={<KeyOutlined />} />
        )} />
      </Form.Item>

      <Form.Item
        label="게시판 이름"
        required
        validateStatus={errors.name ? 'error' : ''}
        help={errors.name?.message}
      >
        <Controller name="name" control={control} render={({ field }) => (
          <Input {...field} placeholder="예: 공지사항" size="large" prefix={<TagOutlined />} />
        )} />
      </Form.Item>

      <Form.Item
        label="설명"
        validateStatus={errors.description ? 'error' : ''}
        help={errors.description?.message}
      >
        <Controller name="description" control={control} render={({ field }) => (
          <Input.TextArea {...field} placeholder="게시판 설명을 입력하세요" rows={3} />
        )} />
      </Form.Item>

      <Form.Item
        label="정렬 순서"
        validateStatus={errors.sortOrder ? 'error' : ''}
        help={errors.sortOrder?.message}
      >
        <Controller name="sortOrder" control={control} render={({ field }) => (
          <InputNumber {...field} min={0} placeholder="0" style={{ width: '100%' }} />
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
