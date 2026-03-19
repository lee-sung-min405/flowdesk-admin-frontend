import { Descriptions, Badge, Spin, Empty } from 'antd';
import type { AdminActionResponse } from '../../types/admin-action.type';
import styles from './admin-action-detail.module.css';

interface AdminActionDetailProps {
  data: AdminActionResponse | undefined;
  loading: boolean;
}

export default function AdminActionDetail({ data, loading }: AdminActionDetailProps) {
  if (loading) {
    return <div className={styles.loadingContainer}><Spin /></div>;
  }

  if (!data) {
    return <Empty description="액션 정보를 불러올 수 없습니다." />;
  }

  return (
    <div className={styles.container}>
      <Descriptions
        bordered
        size="small"
        column={2}
        labelStyle={{ fontWeight: 600, width: 120 }}
      >
        <Descriptions.Item label="액션 ID">{data.actionId}</Descriptions.Item>
        <Descriptions.Item label="상태">
          <Badge
            status={data.isActive ? 'success' : 'default'}
            text={data.isActive ? '활성' : '비활성'}
          />
        </Descriptions.Item>
        <Descriptions.Item label="액션 이름">
          <code className={styles.codeName}>{data.actionName}</code>
        </Descriptions.Item>
        <Descriptions.Item label="표시 이름">
          {data.displayName || <span className={styles.emptyValue}>—</span>}
        </Descriptions.Item>
        <Descriptions.Item label="생성일">{new Date(data.createdAt).toLocaleString('ko-KR')}</Descriptions.Item>
        <Descriptions.Item label="수정일">{new Date(data.updatedAt).toLocaleString('ko-KR')}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}
