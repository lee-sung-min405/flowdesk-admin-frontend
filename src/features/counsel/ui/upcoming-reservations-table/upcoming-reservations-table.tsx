import { Table, Tag, Badge, Empty } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import type { UpcomingReservationItem } from '../../types/counsel.type';
import styles from './upcoming-reservations-table.module.css';

dayjs.extend(relativeTime);
dayjs.locale('ko');

interface UpcomingReservationsTableProps {
  data: UpcomingReservationItem[];
}

const columns: ColumnsType<UpcomingReservationItem> = [
  {
    title: '번호',
    dataIndex: 'counselSeq',
    key: 'counselSeq',
    width: 70,
  },
  {
    title: '이름',
    dataIndex: 'name',
    key: 'name',
    render: (value: string | null) => value ?? <span style={{ color: 'var(--color-text-tertiary)' }}>-</span>,
  },
  {
    title: '연락처',
    dataIndex: 'counselHp',
    key: 'counselHp',
  },
  {
    title: '예약일시',
    dataIndex: 'counselResvDtm',
    key: 'counselResvDtm',
    render: (value: string) => {
      const d = dayjs(value);
      const relative = d.fromNow();
      const isSoon = d.diff(dayjs(), 'hour') < 2;
      return (
        <div className={styles.dtmCell}>
          <span>{d.format('YYYY-MM-DD HH:mm')}</span>
          <Tag color={isSoon ? 'red' : 'blue'} bordered={false} className={styles.relativeTag}>
            <ClockCircleOutlined /> {relative}
          </Tag>
        </div>
      );
    },
  },
  {
    title: '담당자',
    dataIndex: 'empName',
    key: 'empName',
    render: (value: string | null) => value ?? <span style={{ color: 'var(--color-text-tertiary)' }}>미배정</span>,
  },
  {
    title: '상태',
    dataIndex: 'statusName',
    key: 'statusName',
    render: (value: string) => <Badge status="processing" text={value} />,
  },
];

export default function UpcomingReservationsTable({ data }: UpcomingReservationsTableProps) {
  return (
    <div className={styles.card}>
      {data.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="예약된 상담이 없습니다"
        />
      ) : (
        <Table<UpcomingReservationItem>
          columns={columns}
          dataSource={data}
          rowKey="counselSeq"
          pagination={false}
          size="small"
          scroll={{ x: 700 }}
        />
      )}
    </div>
  );
}
