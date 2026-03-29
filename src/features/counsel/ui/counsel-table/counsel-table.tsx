import { useState } from 'react';
import { Table, Tag, Button, Dropdown, Tooltip, Select, Modal, DatePicker, message } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import type { TableProps, MenuProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { CounselListItem, GetCounselsResponse, GetCounselsRequest } from '../../types/counsel.type';
import styles from './counsel-table.module.css';

interface SelectOption {
  value: number;
  label: string;
  color?: string | null;
  statusKey?: string;
}

interface CounselTableProps {
  data: GetCounselsResponse | undefined;
  loading: boolean;
  params: GetCounselsRequest;
  onParamsChange: (params: GetCounselsRequest) => void;
  onDetail: (item: CounselListItem) => void;
  onEdit: (item: CounselListItem) => void;
  onDelete: (item: CounselListItem) => void;
  /** counsels.admin 권한이 있을 때 true */
  hasAdmin?: boolean;
  /** 담당자 선택 옵션 목록 */
  assigneeOptions?: SelectOption[];
  /** 담당자 변경 콜백 */
  onAssign?: (counselSeq: number, empSeq: number | null) => void;
  /** 상태 선택 옵션 목록 */
  statusOptions?: SelectOption[];
  /** 상태 인라인 변경 콜백 */
  onStatusChangeInline?: (counselSeq: number, counselStat: number, counselResvDtm?: string) => void;
  /** 선택된 행 키 (controlled) */
  selectedRowKeys?: React.Key[];
  /** 선택 변경 콜백 (controlled) */
  onSelectionChange?: (keys: React.Key[]) => void;
  canUpdate?: boolean;
  canDelete?: boolean;
}

const DEFAULT_STATUS_COLOR = '#9ca3af';

export default function CounselTable({
  data,
  loading,
  params,
  onParamsChange,
  onDetail,
  onEdit,
  onDelete,
  hasAdmin,
  assigneeOptions,
  onAssign,
  statusOptions,
  onStatusChangeInline,
  selectedRowKeys: controlledKeys,
  onSelectionChange,
  canUpdate = true,
  canDelete = true,
}: CounselTableProps) {
  const [internalKeys, setInternalKeys] = useState<React.Key[]>([]);
  const selectedRowKeys = controlledKeys ?? internalKeys;
  const setSelectedRowKeys = onSelectionChange ?? setInternalKeys;
  const [scheduledPending, setScheduledPending] = useState<{ counselSeq: number; counselStat: number } | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Dayjs | null>(null);

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone).then(() => {
      message.success('전화번호가 복사되었습니다.');
    });
  };

  const getActionMenuItems = (record: CounselListItem): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      {
        key: 'detail',
        icon: <EyeOutlined />,
        label: '상세 보기',
        onClick: () => onDetail(record),
      },
    ];
    if (canUpdate) {
      items.push({
        key: 'edit',
        icon: <EditOutlined />,
        label: '수정',
        onClick: () => onEdit(record),
      });
    }
    if (canDelete) {
      items.push(
        { type: 'divider' },
        {
          key: 'delete',
          icon: <DeleteOutlined />,
          label: '삭제',
          danger: true,
          onClick: () => onDelete(record),
        },
      );
    }
    return items;
  };

  const columns: TableProps<CounselListItem>['columns'] = [
    {
      title: '상태',
      dataIndex: 'counselStat',
      width: statusOptions && statusOptions.length > 0 ? 130 : 90,
      align: 'center',
      render: (stat: number, record) => {
        const statusColor = statusOptions?.find((o) => o.value === stat)?.color || DEFAULT_STATUS_COLOR;
        return statusOptions && statusOptions.length > 0 && onStatusChangeInline ? (
          <Select
            size="small"
            variant="borderless"
            className={styles.statusSelect}
            value={stat}
            options={statusOptions.map((o) => ({
              ...o,
              label: (
                <Tag color={o.color || DEFAULT_STATUS_COLOR} className={styles.statusTag}>
                  {o.label}
                </Tag>
              ),
            }))}
            onChange={(val) => {
              const selected = statusOptions.find((o) => o.value === val);
              if (selected?.statusKey === 'SCHEDULED') {
                setScheduledPending({ counselSeq: record.counselSeq, counselStat: val });
                setScheduledDate(null);
              } else {
                onStatusChangeInline(record.counselSeq, val);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <Tag color={statusColor} className={styles.statusTag}>
            {record.statusName ?? '-'}
          </Tag>
        );
      },
    },
    {
      title: '고객명',
      dataIndex: 'name',
      width: 120,
      render: (value: string | null, record) => (
        <span className={styles.customerName} onClick={() => onDetail(record)}>
          {value ?? '-'}
        </span>
      ),
    },
    {
      title: '전화번호',
      dataIndex: 'counselHp',
      width: 160,
      render: (value: string) => (
        <div className={styles.phoneCell}>
          <div className={styles.phoneRow}>
            <span>{value}</span>
            <Tooltip title="복사">
              <CopyOutlined
                className={styles.copyBtn}
                onClick={() => handleCopyPhone(value)}
              />
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      title: '웹사이트',
      dataIndex: 'webTitle',
      width: 120,
      render: (value: string | null, record) => value || record.webCode,
    },
    {
      title: '담당자',
      dataIndex: 'empSeq',
      width: hasAdmin ? 150 : 110,
      render: (_: number | null, record) =>
        hasAdmin && assigneeOptions ? (
          <Select
            size="small"
            variant="borderless"
            className={styles.assigneeSelect}
            value={record.empSeq}
            placeholder="미배정"
            allowClear
            options={assigneeOptions}
            onChange={(val) => onAssign?.(record.counselSeq, val ?? null)}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={record.empName ? styles.assigneeAssigned : styles.assignee}>
            {record.empName ?? '미배정'}
          </span>
        ),
    },
    {
      title: '등록일',
      dataIndex: 'regDtm',
      width: 150,
      sorter: true,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '예약일',
      dataIndex: 'counselResvDtm',
      width: 140,
      render: (value: string | null) =>
        value ? dayjs(value).format('YYYY-MM-DD HH:mm') : <span className={styles.emptyText}>-</span>,
    },
    {
      title: '',
      width: 48,
      align: 'center',
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionMenuItems(record) }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="text" size="small" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleTableChange: TableProps<CounselListItem>['onChange'] = (pagination) => {
    onParamsChange({
      ...params,
      page: pagination.current,
      limit: pagination.pageSize,
    });
  };

  const pageInfo = data?.pageInfo;

  return (
    <>
      <Table<CounselListItem>
        rowKey="counselSeq"
        columns={columns}
        dataSource={data?.items ?? []}
        loading={loading}
        onChange={handleTableChange}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{
          current: pageInfo?.currentPage ?? 1,
          pageSize: pageInfo?.pageSize ?? 20,
          total: pageInfo?.totalItems ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `총 ${total}건`,
        }}
        scroll={{ x: 900 }}
        size="middle"
      />

      {/* 예약 상태 변경 시 예약일시 선택 모달 */}
      <Modal
        open={!!scheduledPending}
        title="예약 일시 선택"
        okText="변경"
        cancelText="취소"
        okButtonProps={{ disabled: !scheduledDate }}
        onOk={() => {
          if (scheduledPending && scheduledDate && onStatusChangeInline) {
            onStatusChangeInline(
              scheduledPending.counselSeq,
              scheduledPending.counselStat,
              scheduledDate.format('YYYY-MM-DD HH:mm:ss'),
            );
          }
          setScheduledPending(null);
          setScheduledDate(null);
        }}
        onCancel={() => {
          setScheduledPending(null);
          setScheduledDate(null);
        }}
        width={360}
      >
        <p style={{ marginBottom: 12 }}>예약 상태로 변경하려면 예약 일시를 선택해주세요.</p>
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          value={scheduledDate}
          onChange={setScheduledDate}
          style={{ width: '100%' }}
          placeholder="예약 일시 선택"
        />
      </Modal>
    </>
  );
}
