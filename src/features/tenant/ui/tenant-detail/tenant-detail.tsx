import { Descriptions, Badge, Spin, Empty } from 'antd';
import dayjs from 'dayjs';
import type { GetTenantResponse } from '../../types/tenant.type';
import styles from './tenant-detail.module.css';

interface TenantDetailProps {
  data: GetTenantResponse | undefined;
  loading: boolean;
}

export default function TenantDetail({ data, loading }: TenantDetailProps) {
  if (loading) {
    return <div className={styles.loadingContainer}><Spin /></div>;
  }

  if (!data) {
    return <Empty description="테넌트 정보를 불러올 수 없습니다." />;
  }

  return (
    <div className={styles.container}>
      <Descriptions
        bordered
        size="small"
        column={2}
        labelStyle={{ fontWeight: 600, width: 120 }}
      >
        <Descriptions.Item label="테넌트 ID">{data.tenantId}</Descriptions.Item>
        <Descriptions.Item label="상태">
          <Badge
            status={data.isActive ? 'success' : 'default'}
            text={data.isActive ? '활성' : '비활성'}
          />
        </Descriptions.Item>
        <Descriptions.Item label="테넌트명">
          <code className={styles.codeName}>{data.tenantName}</code>
        </Descriptions.Item>
        <Descriptions.Item label="표시 이름">{data.displayName}</Descriptions.Item>
        <Descriptions.Item label="도메인" span={2}>
          {data.domain || <span className={styles.emptyValue}>—</span>}
        </Descriptions.Item>
        <Descriptions.Item label="생성일">
          {dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="수정일">
          {dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
