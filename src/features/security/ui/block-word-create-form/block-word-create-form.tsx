import { Form, Input, Button, Alert, Segmented, Select } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateBlockWord } from '../../model/use-create-block-word';
import { useBulkCreateBlockWord } from '../../model/use-bulk-create-block-word';
import { createBlockWordSchema } from '../../model/create-block-word.schema';
import { bulkCreateBlockWordSchema } from '../../model/bulk-create-block-word.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './block-word-create-form.module.css';

type CreateFormValues = z.infer<typeof createBlockWordSchema>;
type BulkFormValues = z.infer<typeof bulkCreateBlockWordSchema>;

const MATCH_TYPE_OPTIONS = [
  { value: 'CONTAINS', label: '포함 (CONTAINS)' },
  { value: 'EXACT', label: '정확히 일치 (EXACT)' },
  { value: 'REGEX', label: '정규식 (REGEX)' },
];

interface BlockWordCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BlockWordCreateForm({ onSuccess, onCancel }: BlockWordCreateFormProps) {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [apiError, setApiError] = useState<string | null>(null);
  const [bulkResult, setBulkResult] = useState<string | null>(null);

  const singleForm = useForm<CreateFormValues>({
    resolver: zodResolver(createBlockWordSchema),
    defaultValues: { blockWord: '', matchType: 'CONTAINS', reason: '' },
  });

  const bulkForm = useForm<BulkFormValues>({
    resolver: zodResolver(bulkCreateBlockWordSchema),
    defaultValues: { words: '', matchType: 'CONTAINS', reason: '' },
  });

  const createMutation = useCreateBlockWord();
  const bulkCreateMutation = useBulkCreateBlockWord();

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
          <p className={styles.description}>차단할 금칙어를 등록합니다.</p>

          <Form.Item
            label="금칙어"
            required
            validateStatus={singleForm.formState.errors.blockWord ? 'error' : ''}
            help={singleForm.formState.errors.blockWord?.message}
          >
            <Controller
              name="blockWord"
              control={singleForm.control}
              render={({ field }) => (
                <Input {...field} placeholder="차단할 단어 또는 패턴" size="large" />
              )}
            />
          </Form.Item>

          <Form.Item label="매칭 타입">
            <Controller
              name="matchType"
              control={singleForm.control}
              render={({ field }) => (
                <Select {...field} options={MATCH_TYPE_OPTIONS} />
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
          <p className={styles.description}>여러 금칙어를 한 번에 등록합니다.</p>

          <Form.Item
            label="금칙어 목록"
            required
            validateStatus={bulkForm.formState.errors.words ? 'error' : ''}
            help={bulkForm.formState.errors.words?.message}
          >
            <Controller
              name="words"
              control={bulkForm.control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="금칙어를 줄바꿈 또는 쉼표로 구분하여 입력" rows={6} />
              )}
            />
            <div className={styles.bulkHint}>줄바꿈(Enter) 또는 쉼표(,)로 구분. 모든 단어에 동일한 매칭 타입이 적용됩니다.</div>
          </Form.Item>

          <Form.Item label="매칭 타입">
            <Controller
              name="matchType"
              control={bulkForm.control}
              render={({ field }) => (
                <Select {...field} options={MATCH_TYPE_OPTIONS} />
              )}
            />
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
                <Input.TextArea {...field} placeholder="차단 사유 (모든 단어에 동일 적용)" rows={2} />
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
