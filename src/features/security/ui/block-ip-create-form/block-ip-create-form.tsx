import { Form, Input, Button, Alert, Segmented } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateBlockIp } from '../../model/use-create-block-ip';
import { useBulkCreateBlockIp } from '../../model/use-bulk-create-block-ip';
import { createBlockIpSchema } from '../../model/create-block-ip.schema';
import { bulkCreateBlockIpSchema } from '../../model/bulk-create-block-ip.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { z } from 'zod';
import styles from './block-ip-create-form.module.css';

type CreateFormValues = z.infer<typeof createBlockIpSchema>;
type BulkFormValues = z.infer<typeof bulkCreateBlockIpSchema>;

interface BlockIpCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BlockIpCreateForm({ onSuccess, onCancel }: BlockIpCreateFormProps) {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [apiError, setApiError] = useState<string | null>(null);
  const [bulkResult, setBulkResult] = useState<string | null>(null);

  const singleForm = useForm<CreateFormValues>({
    resolver: zodResolver(createBlockIpSchema),
    defaultValues: { blockIp: '', reason: '' },
  });

  const bulkForm = useForm<BulkFormValues>({
    resolver: zodResolver(bulkCreateBlockIpSchema),
    defaultValues: { ips: '', reason: '' },
  });

  const createMutation = useCreateBlockIp();
  const bulkCreateMutation = useBulkCreateBlockIp();

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
          <p className={styles.description}>차단할 IP 주소를 등록합니다. (IPv4, IPv6, CIDR 지원)</p>

          <Form.Item
            label="IP 주소"
            required
            validateStatus={singleForm.formState.errors.blockIp ? 'error' : ''}
            help={singleForm.formState.errors.blockIp?.message}
          >
            <Controller
              name="blockIp"
              control={singleForm.control}
              render={({ field }) => (
                <Input {...field} placeholder="예: 192.168.1.100" size="large" />
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
          <p className={styles.description}>여러 IP 주소를 한 번에 등록합니다.</p>

          <Form.Item
            label="IP 목록"
            required
            validateStatus={bulkForm.formState.errors.ips ? 'error' : ''}
            help={bulkForm.formState.errors.ips?.message}
          >
            <Controller
              name="ips"
              control={bulkForm.control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="IP 주소를 줄바꿈 또는 쉼표로 구분하여 입력&#10;예: 192.168.1.1&#10;192.168.1.2&#10;10.0.0.0/24" rows={6} />
              )}
            />
            <div className={styles.bulkHint}>줄바꿈(Enter) 또는 쉼표(,)로 구분. 중복된 IP는 자동으로 건너뜁니다.</div>
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
                <Input.TextArea {...field} placeholder="차단 사유 (모든 IP에 동일 적용)" rows={2} />
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
