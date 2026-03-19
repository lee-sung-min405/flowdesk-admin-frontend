import { Descriptions, Badge, Tag, Spin, Empty } from 'antd';
import type { AdminPermissionResponse } from '../../types/admin-permission.type';
import styles from './admin-permission-detail.module.css';

interface AdminPermissionDetailProps {
  data: AdminPermissionResponse | undefined;
  loading: boolean;
}

export default function AdminPermissionDetail({ data, loading }: AdminPermissionDetailProps) {
  if (loading) {
    return <div className={styles.loadingContainer}><Spin /></div>;
  }

  if (!data) {
    return <Empty description="권한 정보를 불러올 수 없습니다." />;
  }

  return (
    <div className={styles.container}>
      <Descriptions
        bordered
        size="small"
        column={2}
        labelStyle={{ fontWeight: 600, width: 120 }}
      >
        <Descriptions.Item label="권한 ID">{data.permissionId}</Descriptions.Item>
        <Descriptions.Item label="상태">
          <Badge
            status={data.isActive ? 'success' : 'default'}
            text={data.isActive ? '활성' : '비활성'}
          />
        </Descriptions.Item>
        <Descriptions.Item label="페이지">
          <Tag color="blue">{data.page.displayName}</Tag>
          <code className={styles.codeName}>{data.page.pageName}</code>
        </Descriptions.Item>
        <Descriptions.Item label="액션">
          <Tag color="green">{data.action.displayName || data.action.actionName}</Tag>
          <code className={styles.codeName}>{data.action.actionName}</code>
        </Descriptions.Item>
        <Descriptions.Item label="표시 이름" span={2}>
          {data.displayName || <span className={styles.emptyValue}>—</span>}
        </Descriptions.Item>
        <Descriptions.Item label="설명" span={2}>
          {data.description || <span className={styles.emptyValue}>—</span>}
        </Descriptions.Item>
        <Descriptions.Item label="생성일">{new Date(data.createdAt).toLocaleString('ko-KR')}</Descriptions.Item>
        <Descriptions.Item label="수정일">{new Date(data.updatedAt).toLocaleString('ko-KR')}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}
