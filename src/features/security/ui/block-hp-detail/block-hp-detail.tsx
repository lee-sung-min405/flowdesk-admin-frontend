import { Descriptions, Badge, Spin, Empty } from 'antd';
import dayjs from 'dayjs';
import type { GetBlockHpResponse } from '../../types/block-hp.type';
import styles from './block-hp-detail.module.css';

interface BlockHpDetailProps {
  data: GetBlockHpResponse | undefined;
  loading: boolean;
}

export default function BlockHpDetail({ data, loading }: BlockHpDetailProps) {
  if (loading) {
    return <div className={styles.loadingContainer}><Spin /></div>;
  }

  if (!data) {
    return <Empty description="차단 휴대폰 정보를 불러올 수 없습니다." />;
  }

  return (
    <div className={styles.container}>
      <Descriptions
        bordered
        size="small"
        column={2}
        labelStyle={{ fontWeight: 600, width: 120 }}
      >
        <Descriptions.Item label="ID">{data.dbhIdx}</Descriptions.Item>
        <Descriptions.Item label="상태">
          <Badge
            status={data.isActive ? 'success' : 'default'}
            text={data.isActive ? '활성' : '비활성'}
          />
        </Descriptions.Item>
        <Descriptions.Item label="휴대폰 번호" span={2}>
          <code>{data.blockHp}</code>
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
