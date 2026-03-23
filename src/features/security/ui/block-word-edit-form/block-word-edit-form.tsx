import { Form, Input, Button, Alert, Select } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateBlockWord } from '../../model/use-update-block-word';
import { updateBlockWordSchema } from '../../model/update-block-word.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './block-word-edit-form.module.css';

type UpdateFormValues = z.infer<typeof updateBlockWordSchema>;

const MATCH_TYPE_OPTIONS = [
  { value: 'CONTAINS', label: '포함 (CONTAINS)' },
  { value: 'EXACT', label: '정확히 일치 (EXACT)' },
  { value: 'REGEX', label: '정규식 (REGEX)' },
];

interface BlockWordEditFormProps {
  id: number;
  defaultValues: UpdateFormValues;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BlockWordEditForm({ id, defaultValues, onSuccess, onCancel }: BlockWordEditFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateBlockWordSchema),
    defaultValues,
  });
  const mutation = useUpdateBlockWord();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: UpdateFormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({ id, data });
      onSuccess();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      {apiError && <Alert type="error" message={apiError} showIcon closable className={styles.errorAlert} />}

      <Form.Item label="매칭 타입">
        <Controller
          name="matchType"
          control={control}
          render={({ field }) => (
            <Select {...field} options={MATCH_TYPE_OPTIONS} />
          )}
        />
      </Form.Item>

      <Form.Item
        label="차단 사유"
        validateStatus={errors.reason ? 'error' : ''}
        help={errors.reason?.message}
      >
        <Controller
          name="reason"
          control={control}
          render={({ field }) => (
            <Input.TextArea {...field} placeholder="차단 사유를 입력하세요" rows={3} />
          )}
        />
      </Form.Item>

      <div className={styles.footer}>
        <Button onClick={onCancel}>취소</Button>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>수정</Button>
      </div>
    </Form>
  );
}
