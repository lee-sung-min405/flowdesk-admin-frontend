import { Descriptions, Badge, Spin, Empty } from 'antd';
import dayjs from 'dayjs';
import type { GetBlockIpResponse } from '../../types/block-ip.type';
import styles from './block-ip-detail.module.css';

interface BlockIpDetailProps {
  data: GetBlockIpResponse | undefined;
  loading: boolean;
}

export default function BlockIpDetail({ data, loading }: BlockIpDetailProps) {
  if (loading) {
    return <div className={styles.loadingContainer}><Spin /></div>;
  }

  if (!data) {
    return <Empty description="차단 IP 정보를 불러올 수 없습니다." />;
  }

  return (
    <div className={styles.container}>
      <Descriptions
        bordered
        size="small"
        column={2}
        labelStyle={{ fontWeight: 600, width: 120 }}
      >
        <Descriptions.Item label="ID">{data.dbiIdx}</Descriptions.Item>
        <Descriptions.Item label="상태">
          <Badge
            status={data.isActive ? 'success' : 'default'}
            text={data.isActive ? '활성' : '비활성'}
          />
        </Descriptions.Item>
        <Descriptions.Item label="IP 주소" span={2}>
          <code>{data.blockIp}</code>
        </Descriptions.Item>
        <Descriptions.Item label="차단 사유" span={2}>
          {data.reason || <span className={styles.emptyValue}>—</span>}
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
