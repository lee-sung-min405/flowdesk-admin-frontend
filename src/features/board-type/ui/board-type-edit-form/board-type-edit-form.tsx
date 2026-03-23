import { Form, Input, Button, Alert, InputNumber, Divider } from 'antd';
import { TagOutlined, FileTextOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateBoardType } from '../../model/use-update-board-type';
import { updateBoardTypeSchema } from '../../model/update-board-type.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './board-type-edit-form.module.css';

type UpdateFormValues = z.infer<typeof updateBoardTypeSchema>;

interface BoardTypeEditFormProps {
  boardId: number;
  defaultValues: UpdateFormValues;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BoardTypeEditForm({
  boardId,
  defaultValues,
  onSuccess,
  onCancel,
}: BoardTypeEditFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateBoardTypeSchema),
    defaultValues,
  });
  const mutation = useUpdateBoardType();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: UpdateFormValues) => {
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
      {apiError && <Alert type="error" message={apiError} showIcon closable className={styles.errorAlert} />}

      <div className={styles.section}>
        <div className={styles.sectionHeader}><TagOutlined /><span>기본 정보</span></div>

        <Form.Item
          label="게시판 이름"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller name="name" control={control} render={({ field }) => (
            <Input {...field} placeholder="예: 공지사항" prefix={<TagOutlined />} />
          )} />
        </Form.Item>
      </div>

      <Divider className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionHeader}><FileTextOutlined /><span>상세 정보</span></div>

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
          className={styles.lastFormItem}
        >
          <Controller name="sortOrder" control={control} render={({ field }) => (
            <InputNumber {...field} min={0} placeholder="0" style={{ width: '100%' }} />
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
