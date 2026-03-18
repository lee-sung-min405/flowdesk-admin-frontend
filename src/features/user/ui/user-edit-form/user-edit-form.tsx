import { Form, Input, Button, Alert, Select, Tag, Divider } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateUser } from '../../model/use-update-user';
import { updateUserSchema } from '../../model/update-user.schema';
import { getApiErrorMessage } from '@shared/utils/api-error-message';
import type { Role } from '@features/role';
import type { z } from 'zod';
import styles from './user-edit-form.module.css';

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

interface UserEditFormProps {
  userId: number;
  defaultValues: UpdateUserFormValues;
  roles: Role[];
  assignedRoleIds: number[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UserEditForm({ userId, defaultValues, roles, assignedRoleIds, onSuccess, onCancel }: UserEditFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues,
  });
  const mutation = useUpdateUser();
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(assignedRoleIds);

  const onSubmit = async (data: UpdateUserFormValues) => {
    setApiError(null);
    try {
      await mutation.mutateAsync({ id: userId, data: { ...data, roleIds: selectedRoleIds } });
      onSuccess();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  };

  const roleOptions = roles
    .filter((r) => r.isActive)
    .map((r) => ({
      label: r.displayName,
      value: r.roleId,
    }));

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
      {apiError && (
        <Alert type="error" message={apiError} showIcon closable className={styles.errorAlert} />
      )}

      {/* 기본 정보 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <UserOutlined />
          <span>기본 정보</span>
        </div>
        <div className={styles.formRow}>
          <Form.Item
            label="이름"
            required
            validateStatus={errors.userName ? 'error' : ''}
            help={errors.userName?.message}
          >
            <Controller
              name="userName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="예: 홍길동" prefix={<UserOutlined />} />
              )}
            />
          </Form.Item>
          <Form.Item
            label="회사명"
            required
            validateStatus={errors.corpName ? 'error' : ''}
            help={errors.corpName?.message}
          >
            <Controller
              name="corpName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="예: 플로우데스크" prefix={<BankOutlined />} />
              )}
            />
          </Form.Item>
        </div>
      </div>

      <Divider className={styles.divider} />

      {/* 연락처 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <MailOutlined />
          <span>연락처</span>
        </div>
        <Form.Item
          label="이메일"
          validateStatus={errors.userEmail ? 'error' : ''}
          help={errors.userEmail?.message}
        >
          <Controller
            name="userEmail"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="예: user@company.com" prefix={<MailOutlined />} />
            )}
          />
        </Form.Item>
        <div className={styles.formRow}>
          <Form.Item
            label="전화번호"
            validateStatus={errors.userTel ? 'error' : ''}
            help={errors.userTel?.message}
          >
            <Controller
              name="userTel"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="예: 02-1234-5678" prefix={<PhoneOutlined />} />
              )}
            />
          </Form.Item>
          <Form.Item
            label="휴대폰"
            validateStatus={errors.userHp ? 'error' : ''}
            help={errors.userHp?.message}
          >
            <Controller
              name="userHp"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="예: 010-1234-5678" prefix={<MobileOutlined />} />
              )}
            />
          </Form.Item>
        </div>
      </div>

      <Divider className={styles.divider} />

      {/* 역할 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <SafetyCertificateOutlined />
          <span>역할 설정</span>
        </div>
        <Form.Item label="역할" className={styles.lastFormItem}>
          <Select
            mode="multiple"
            placeholder="역할을 선택하세요"
            value={selectedRoleIds}
            onChange={setSelectedRoleIds}
            options={roleOptions}
            tagRender={({ label, closable, onClose }) => (
              <Tag closable={closable} onClose={onClose} className={styles.roleTag}>
                {label}
              </Tag>
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
