import { Form, Input, Button, Alert, Segmented } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateBlockHp } from '../../model/use-create-block-hp';
import { useBulkCreateBlockHp } from '../../model/use-bulk-create-block-hp';
import { createBlockHpSchema } from '../../model/create-block-hp.schema';
import { bulkCreateBlockHpSchema } from '../../model/bulk-create-block-hp.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './block-hp-create-form.module.css';

type CreateFormValues = z.infer<typeof createBlockHpSchema>;
type BulkFormValues = z.infer<typeof bulkCreateBlockHpSchema>;

interface BlockHpCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BlockHpCreateForm({ onSuccess, onCancel }: BlockHpCreateFormProps) {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [apiError, setApiError] = useState<string | null>(null);
  const [bulkResult, setBulkResult] = useState<string | null>(null);

  const singleForm = useForm<CreateFormValues>({
    resolver: zodResolver(createBlockHpSchema),
    defaultValues: { blockHp: '', reason: '' },
  });

  const bulkForm = useForm<BulkFormValues>({
    resolver: zodResolver(bulkCreateBlockHpSchema),
    defaultValues: { phones: '', reason: '' },
  });

  const createMutation = useCreateBlockHp();
  const bulkCreateMutation = useBulkCreateBlockHp();

  const handleSingleSubmit = async (data: CreateFormValues) => {
    setApiError(null);
    try {
      await createMutation.mutateAsync(data);
      onSuccess();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  const handleBulkSubmit = async (data: BulkFormValues) => {
    setApiError(null);
    setBulkResult(null);
    try {
      const result = await bulkCreateMutation.mutateAsync(data);
      if (result.skippedCount > 0) {
        setBulkResult(`${result.successCount}건 등록 완료, ${result.skippedCount}건 건너뜀 (중복)`);
      } else {
        onSuccess();
      }
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  return (
    <div className={styles.formContainer}>
      <Segmented
        className={styles.modeToggle}
        block
        value={mode}
        onChange={(v) => { setMode(v as 'single' | 'bulk'); setApiError(null); setBulkResult(null); }}
        options={[
          { label: '단건 등록', value: 'single' },
          { label: '대량 등록', value: 'bulk' },
        ]}
      />

      {mode === 'single' ? (
        <Form key="single" layout="vertical" onFinish={singleForm.handleSubmit(handleSingleSubmit)}>
          <p className={styles.description}>차단할 휴대폰 번호를 등록합니다.</p>

          <Form.Item
            label="휴대폰 번호"
            required
            validateStatus={singleForm.formState.errors.blockHp ? 'error' : ''}
            help={singleForm.formState.errors.blockHp?.message}
          >
            <Controller
              name="blockHp"
              control={singleForm.control}
              render={({ field }) => (
                <Input {...field} placeholder="예: 01012345678" size="large" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="차단 사유"
            validateStatus={singleForm.formState.errors.reason ? 'error' : ''}
            help={singleForm.formState.errors.reason?.message}
          >
            <Controller
              name="reason"
              control={singleForm.control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="차단 사유를 입력하세요" rows={3} />
              )}
            />
          </Form.Item>

          {apiError && <Alert type="error" message={apiError} showIcon className={styles.errorAlert} />}

          <div className={styles.buttonGroup}>
            <Button onClick={onCancel}>취소</Button>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending}>등록</Button>
          </div>
        </Form>
      ) : (
        <Form key="bulk" layout="vertical" onFinish={bulkForm.handleSubmit(handleBulkSubmit)}>
          <p className={styles.description}>여러 휴대폰 번호를 한 번에 등록합니다.</p>

          <Form.Item
            label="번호 목록"
            required
            validateStatus={bulkForm.formState.errors.phones ? 'error' : ''}
            help={bulkForm.formState.errors.phones?.message}
          >
            <Controller
              name="phones"
              control={bulkForm.control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="번호를 줄바꿈 또는 쉼표로 구분하여 입력&#10;예: 01012345678&#10;010-2345-6789&#10;01034567890" rows={6} />
              )}
            />
            <div className={styles.bulkHint}>줄바꿈(Enter) 또는 쉼표(,)로 구분. 하이픈은 자동 제거되며, 중복 번호는 건너뜁니다.</div>
          </Form.Item>

          <Form.Item
            label="차단 사유"
            validateStatus={bulkForm.formState.errors.reason ? 'error' : ''}
            help={bulkForm.formState.errors.reason?.message}
          >
            <Controller
              name="reason"
              control={bulkForm.control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="차단 사유 (모든 번호에 동일 적용)" rows={2} />
              )}
            />
          </Form.Item>

          {apiError && <Alert type="error" message={apiError} showIcon className={styles.errorAlert} />}
          {bulkResult && <Alert type="warning" message={bulkResult} showIcon className={styles.successAlert} closable onClose={() => { setBulkResult(null); onSuccess(); }} />}

          <div className={styles.buttonGroup}>
            <Button onClick={onCancel}>취소</Button>
            <Button type="primary" htmlType="submit" loading={bulkCreateMutation.isPending}>대량 등록</Button>
          </div>
        </Form>
      )}
    </div>
  );
}
