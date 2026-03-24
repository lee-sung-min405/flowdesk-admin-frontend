import { Form, Input, Button, Alert, Divider } from 'antd';
import { UserOutlined, PhoneOutlined, LinkOutlined, FileTextOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateCounsel } from '../../model/use-update-counsel';
import { updateCounselSchema } from '../../model/update-counsel.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './counsel-edit-form.module.css';

type UpdateCounselFormValues = z.infer<typeof updateCounselSchema>;

interface CounselEditFormProps {
  counselSeq: number;
  defaultValues: UpdateCounselFormValues;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CounselEditForm({ counselSeq, defaultValues, onSuccess, onCancel }: CounselEditFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<UpdateCounselFormValues>({
    resolver: zodResolver(updateCounselSchema),
    defaultValues,
  });
  const mutation = useUpdateCounsel();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: UpdateCounselFormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({ id: counselSeq, data });
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

      {/* 기본 정보 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <UserOutlined />
          <span>기본 정보</span>
        </div>
        <div className={styles.formRow}>
          <Form.Item
            label="이름"
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} value={field.value ?? ''} placeholder="이름" prefix={<UserOutlined />} />
              )}
            />
          </Form.Item>
          <Form.Item
            label="연락처"
            validateStatus={errors.counselHp ? 'error' : ''}
            help={errors.counselHp?.message}
          >
            <Controller
              name="counselHp"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="연락처" prefix={<PhoneOutlined />} />
              )}
            />
          </Form.Item>
        </div>
      </div>

      <Divider className={styles.divider} />

      {/* UTM 정보 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <LinkOutlined />
          <span>UTM 정보</span>
        </div>
        <div className={styles.formRow}>
          <Form.Item
            label="Source"
            validateStatus={errors.counselSource ? 'error' : ''}
            help={errors.counselSource?.message}
          >
            <Controller
              name="counselSource"
              control={control}
              render={({ field }) => (
                <Input {...field} value={field.value ?? ''} placeholder="UTM Source" />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Medium"
            validateStatus={errors.counselMedium ? 'error' : ''}
            help={errors.counselMedium?.message}
          >
            <Controller
              name="counselMedium"
              control={control}
              render={({ field }) => (
                <Input {...field} value={field.value ?? ''} placeholder="UTM Medium" />
              )}
            />
          </Form.Item>
        </div>
        <Form.Item
          label="Campaign"
          validateStatus={errors.counselCampaign ? 'error' : ''}
          help={errors.counselCampaign?.message}
        >
          <Controller
            name="counselCampaign"
            control={control}
            render={({ field }) => (
              <Input {...field} value={field.value ?? ''} placeholder="UTM Campaign" />
            )}
          />
        </Form.Item>
      </div>

      <Divider className={styles.divider} />

      {/* 메모 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <FileTextOutlined />
          <span>메모</span>
        </div>
        <Form.Item
          validateStatus={errors.counselMemo ? 'error' : ''}
          help={errors.counselMemo?.message}
        >
          <Controller
            name="counselMemo"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                value={field.value ?? ''}
                rows={3}
                placeholder="상담 메모를 입력하세요"
                showCount
                maxLength={255}
              />
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
