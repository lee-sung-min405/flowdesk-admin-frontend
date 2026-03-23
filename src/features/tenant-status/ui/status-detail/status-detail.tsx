import { Descriptions, Badge, Spin, Empty } from 'antd';
import type { GetTenantStatusResponse } from '../../types/tenant-status.type';
import styles from './status-detail.module.css';

interface StatusDetailProps {
  data: GetTenantStatusResponse | undefined;
  loading: boolean;
}

export default function StatusDetail({ data, loading }: StatusDetailProps) {
  if (loading) {
    return <div className={styles.loadingContainer}><Spin /></div>;
  }

  if (!data) {
    return <Empty description="상태 정보를 불러올 수 없습니다." />;
  }

  return (
    <div className={styles.container}>
      <Descriptions
        bordered
        size="small"
        column={2}
        labelStyle={{ fontWeight: 600, width: 120 }}
      >
        <Descriptions.Item label="상태 ID">{data.tenantStatusId}</Descriptions.Item>
        <Descriptions.Item label="활성 여부">
          <Badge
            status={data.isActive ? 'success' : 'default'}
            text={data.isActive ? '활성' : '비활성'}
          />
        </Descriptions.Item>
        <Descriptions.Item label="상태 그룹">
          <code className={styles.codeName}>{data.statusGroup}</code>
        </Descriptions.Item>
        <Descriptions.Item label="상태 키">
          <code className={styles.codeName}>{data.statusKey}</code>
        </Descriptions.Item>
        <Descriptions.Item label="상태명">{data.statusName}</Descriptions.Item>
        <Descriptions.Item label="색상">
          <div className={styles.colorCell}>
            <span className={styles.colorSwatch} style={{ backgroundColor: data.color }} />
            <code className={styles.codeName}>{data.color}</code>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="설명" span={2}>
          {data.description || <span className={styles.emptyValue}>—</span>}
        </Descriptions.Item>
        <Descriptions.Item label="정렬 순서">{data.sortOrder}</Descriptions.Item>
        <Descriptions.Item label="생성일">
          {new Date(data.createdAt).toLocaleString('ko-KR')}
        </Descriptions.Item>
        <Descriptions.Item label="수정일" span={2}>
          {new Date(data.updatedAt).toLocaleString('ko-KR')}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
