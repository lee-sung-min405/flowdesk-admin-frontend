import { useState, useEffect } from 'react';
import {
  Tag, Spin, Empty, Select, Button, Input, Checkbox, Tabs, Timeline, DatePicker, Modal, message,
} from 'antd';
import {
  PhoneOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  DeleteOutlined,
  SendOutlined,
  SaveOutlined,
  StopOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { CounselDetail as CounselDetailType, CounselMemo, CounselLog } from '../../types/counsel.type';
import { useUpdateCounselStatus } from '../../model/use-update-counsel-status';
import { useUpdateCounsel } from '../../model/use-update-counsel';
import { useCreateCounselMemo } from '../../model/use-create-counsel-memo';
import { useCreateBlockHp, useCreateBlockIp, useCreateBlockWord } from '@features/security';
import styles from './counsel-detail.module.css';

const DEFAULT_STATUS_COLOR = '#9ca3af';

interface AssigneeOption {
  value: number;
  label: string;
}

interface StatusOption {
  value: number;
  label: string;
  color?: string | null;
  statusKey?: string;
}

interface CounselDetailProps {
  data: CounselDetailType | undefined;
  loading: boolean;
  statusOptions?: StatusOption[];
  assigneeOptions?: AssigneeOption[];
  onDelete?: () => void;
}

export default function CounselDetail({
  data,
  loading,
  statusOptions = [],
  assigneeOptions = [],
  onDelete,
}: CounselDetailProps) {
  /* ── Local edit states ── */
  const [editSource, setEditSource] = useState<string | null>(null);
  const [editMedium, setEditMedium] = useState<string | null>(null);
  const [editCampaign, setEditCampaign] = useState<string | null>(null);
  const [editResvDtm, setEditResvDtm] = useState<Dayjs | null>(null);
  const [editMemo, setEditMemo] = useState<string>('');
  const [memoText, setMemoText] = useState('');
  const [memoWithStatus, setMemoWithStatus] = useState(true);
  const [scheduledPending, setScheduledPending] = useState<number | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Dayjs | null>(null);
  const [blockModal, setBlockModal] = useState<'hp' | 'ip' | 'word' | null>(null);
  const [blockReason, setBlockReason] = useState('');

  const updateStatus = useUpdateCounselStatus();
  const updateCounsel = useUpdateCounsel();
  const createMemo = useCreateCounselMemo();
  const createBlockHp = useCreateBlockHp();
  const createBlockIp = useCreateBlockIp();
  const createBlockWord = useCreateBlockWord();

  /* ── Initialize edit fields when data loads ── */
  useEffect(() => {
    if (data) {
      setEditSource(data.counselSource ?? '');
      setEditMedium(data.counselMedium ?? '');
      setEditCampaign(data.counselCampaign ?? '');
      setEditResvDtm(data.counselResvDtm ? dayjs(data.counselResvDtm) : null);
      setEditMemo(data.counselMemo ?? '');
    }
  }, [data]);

  if (loading) {
    return <div className={styles.loadingContainer}><Spin /></div>;
  }

  if (!data) {
    return <Empty description="상담 정보를 불러올 수 없습니다." />;
  }

  /* ── Handlers ── */
  const handleStatusChange = async (val: number) => {
    const selected = statusOptions.find((o) => o.value === val);
    if (selected?.statusKey === 'SCHEDULED') {
      setScheduledPending(val);
      setScheduledDate(null);
      return;
    }
    try {
      await updateStatus.mutateAsync({ id: data.counselSeq, data: { counselStat: val } });
      message.success('상태가 변경되었습니다.');
    } catch {
      message.error('상태 변경에 실패했습니다.');
    }
  };

  const handleScheduledConfirm = async () => {
    if (!scheduledPending || !scheduledDate) return;
    try {
      await updateStatus.mutateAsync({
        id: data.counselSeq,
        data: { counselStat: scheduledPending, counselResvDtm: scheduledDate.format('YYYY-MM-DD HH:mm:ss') },
      });
      message.success('예약 상태로 변경되었습니다.');
      setScheduledPending(null);
      setScheduledDate(null);
    } catch {
      message.error('상태 변경에 실패했습니다.');
    }
  };

  const handleAssigneeChange = async (val: number | null) => {
    try {
      await updateCounsel.mutateAsync({ id: data.counselSeq, data: { empSeq: val } });
      message.success('담당자가 변경되었습니다.');
    } catch {
      message.error('담당자 변경에 실패했습니다.');
    }
  };

  const handleSaveInfo = async () => {
    try {
      await updateCounsel.mutateAsync({
        id: data.counselSeq,
        data: {
          counselSource: editSource || null,
          counselMedium: editMedium || null,
          counselCampaign: editCampaign || null,
          counselResvDtm: editResvDtm ? editResvDtm.format('YYYY-MM-DDTHH:mm:ss') : null,
          counselMemo: editMemo || null,
        },
      });
      message.success('저장되었습니다.');
    } catch {
      message.error('저장에 실패했습니다.');
    }
  };

  const handleAddMemo = async () => {
    if (!memoText.trim()) return;
    try {
      await createMemo.mutateAsync({ id: data.counselSeq, data: { memoText: memoText.trim() } });
      setMemoText('');
      message.success('메모가 등록되었습니다.');
    } catch {
      message.error('메모 등록에 실패했습니다.');
    }
  };

  /* ── Render helper: Info tab ── */
  const renderInfoTab = () => (
    <div className={styles.tabContent}>
      <h3 className={styles.sectionTitle}>유입 정보 (UTM)</h3>

      <div className={styles.formField}>
        <label className={styles.fieldLabel}>소스 (Source)</label>
        <Input value={editSource ?? ''} onChange={(e) => setEditSource(e.target.value)} placeholder="예: google, naver" />
      </div>
      <div className={styles.formField}>
        <label className={styles.fieldLabel}>매체 (Medium)</label>
        <Input value={editMedium ?? ''} onChange={(e) => setEditMedium(e.target.value)} placeholder="예: cpc, organic" />
      </div>
      <div className={styles.formField}>
        <label className={styles.fieldLabel}>캠페인 (Campaign)</label>
        <Input value={editCampaign ?? ''} onChange={(e) => setEditCampaign(e.target.value)} placeholder="예: 봄시즌_프로모션" />
      </div>

      <h3 className={styles.sectionTitle}>예약 정보</h3>
      <div className={styles.formField}>
        <label className={styles.fieldLabel}>예약 일시</label>
        <DatePicker
          showTime
          style={{ width: '100%' }}
          value={editResvDtm}
          onChange={setEditResvDtm}
          placeholder="연도. 월. 일. -- --:--"
        />
      </div>

      <h3 className={styles.sectionTitle}>상담 요약 메모</h3>
      <div className={styles.formField}>
        <label className={styles.fieldLabel}>메모</label>
        <Input.TextArea
          rows={3}
          value={editMemo}
          onChange={(e) => setEditMemo(e.target.value)}
          placeholder="상담 내용을 간단히 요약해주세요"
        />
      </div>

      {data.fieldValues.length > 0 && (
        <>
          <h3 className={styles.sectionTitle}>추가 필드</h3>
          {data.fieldValues.map((fv) => (
            <div key={fv.fieldId} className={styles.formField}>
              <label className={styles.fieldLabel}>{fv.label}</label>
              <Input
                value={fv.valueText ?? fv.valueNumber?.toString() ?? fv.valueDate ?? fv.valueDatetime ?? ''}
                readOnly
              />
            </div>
          ))}
        </>
      )}

      <div className={styles.saveRow}>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={updateCounsel.isPending}
          onClick={handleSaveInfo}
        >
          저장
        </Button>
      </div>
    </div>
  );

  /* ── Render helper: Memo tab ── */
  const renderMemoTab = () => {
    const memos: CounselMemo[] = data.memos ?? [];

    return (
      <div className={styles.memoTab}>
        <div className={styles.memoList}>
          {memos.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>등록된 메모가 없습니다</p>
              <p className={styles.emptyDesc}>아래에서 첫 메모를 작성해보세요</p>
            </div>
          ) : (
            memos.map((memo) => (
              <div key={memo.memoLogId} className={styles.memoItem}>
                <div className={styles.memoMeta}>
                  <span className={styles.memoAuthor}>{memo.creatorName ?? '시스템'}</span>
                  {memo.statusName && (
                    <Tag className={styles.memoStatusTag}>{memo.statusName}</Tag>
                  )}
                  <span className={styles.memoDate}>{dayjs(memo.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                </div>
                <div className={styles.memoText}>{memo.memoText}</div>
              </div>
            ))
          )}
        </div>

        <div className={styles.memoInput}>
          <Input.TextArea
            rows={3}
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            placeholder="메모를 입력하세요..."
            onPressEnter={(e) => {
              if (e.ctrlKey || e.metaKey) handleAddMemo();
            }}
          />
          <div className={styles.memoInputFooter}>
            <Checkbox checked={memoWithStatus} onChange={(e) => setMemoWithStatus(e.target.checked)}>
              현재 상태로 기록
            </Checkbox>
            {memoWithStatus && data.statusName && (
              <Tag color={statusOptions.find((o) => o.value === data.counselStat)?.color || DEFAULT_STATUS_COLOR}>{data.statusName}</Tag>
            )}
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={createMemo.isPending}
              onClick={handleAddMemo}
              disabled={!memoText.trim()}
              className={styles.memoSubmitBtn}
            >
              메모 추가
            </Button>
          </div>
        </div>
      </div>
    );
  };

  /* ── Render helper: Logs tab ── */
  const renderLogsTab = () => {
    const logs: CounselLog[] = data.logs ?? [];

    if (logs.length === 0) {
      return (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>상태 변경 이력이 없습니다</p>
          <p className={styles.emptyDesc}>상태를 변경하면 자동으로 기록됩니다</p>
        </div>
      );
    }

    return (
      <div className={styles.tabContent}>
        <Timeline
          items={logs.map((log) => ({
            color: statusOptions.find((o) => o.value === log.counselStat)?.color || DEFAULT_STATUS_COLOR,
            children: (
              <div className={styles.logEntry}>
                <Tag color={statusOptions.find((o) => o.value === log.counselStat)?.color || DEFAULT_STATUS_COLOR}>{log.statusName ?? `상태 ${log.counselStat}`}</Tag>
                <span className={styles.logDate}>{dayjs(log.regDtm).format('YYYY-MM-DD HH:mm:ss')}</span>
              </div>
            ),
          }))}
        />
      </div>
    );
  };

  /* ── Render helper: Related tab ── */
  const renderRelatedTab = () => (
    <div className={styles.emptyState}>
      <p className={styles.emptyTitle}>관련 상담이 없습니다</p>
      <p className={styles.emptyDesc}>동일 연락처의 상담이 있으면 표시됩니다</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.fixedSection}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h2 className={styles.headerName}>{data.name ?? '이름 없음'}</h2>
          <Tag color={statusOptions.find((o) => o.value === data.counselStat)?.color || DEFAULT_STATUS_COLOR} className={styles.headerStatusTag}>
            {data.statusName ?? '-'}
          </Tag>
        </div>
      </div>

      {/* ── Info Grid ── */}
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <PhoneOutlined className={styles.infoIcon} />
          <span>{data.counselHp}</span>
        </div>
        <div className={styles.infoItem}>
          <GlobalOutlined className={styles.infoIcon} />
          <span>{data.webCode}</span>
        </div>
        <div className={styles.infoItem}>
          <EnvironmentOutlined className={styles.infoIcon} />
          <span>{data.counselIp}</span>
        </div>
        <div className={styles.infoItem}>
          <UserOutlined className={styles.infoIcon} />
          <span>{data.empName ?? '미배정'}</span>
        </div>
      </div>

      {/* ── Dates ── */}
      <div className={styles.dateRow}>
        <span className={styles.dateItem}>
          <CalendarOutlined /> 등록: {dayjs(data.regDtm).format('YYYY-MM-DD HH:mm:ss')}
        </span>
        <span className={styles.dateItem}>
          <CalendarOutlined /> 수정: {dayjs(data.editDtm).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </div>

      {/* ── Action Bar ── */}
      <div className={styles.actionBar}>
        <div className={styles.actionGroup}>
          <label className={styles.actionLabel}>상태 변경</label>
          <Select
            className={styles.statusSelect}
            value={data.counselStat}
            options={statusOptions.map((o) => ({
              ...o,
              label: (
                <span>
                  <span className={styles.statusDot} style={{ background: o.color || DEFAULT_STATUS_COLOR }} />
                  {o.label}
                </span>
              ),
            }))}
            onChange={handleStatusChange}
            loading={updateStatus.isPending}
          />
        </div>
        {assigneeOptions && assigneeOptions.length > 0 && (
          <div className={styles.actionGroup}>
            <label className={styles.actionLabel}>담당자 변경</label>
            <Select
              className={styles.assigneeSelect}
              value={data.empSeq}
              placeholder="미배정"
              allowClear
              showSearch
              optionFilterProp="label"
              options={assigneeOptions}
              onChange={handleAssigneeChange}
              loading={updateCounsel.isPending}
            />
          </div>
        )}
        <div className={styles.actionGroup}>
          <label className={styles.actionLabel}>관리</label>
          <Button danger icon={<DeleteOutlined />} onClick={onDelete}>
            삭제
          </Button>
        </div>
        <div className={styles.actionGroup}>
          <label className={styles.actionLabel}>차단</label>
          <div className={styles.blockBtnGroup}>
            <Button
              size="small"
              icon={<StopOutlined />}
              onClick={() => { setBlockModal('hp'); setBlockReason(''); }}
            >
              전화번호
            </Button>
            <Button
              size="small"
              icon={<StopOutlined />}
              onClick={() => { setBlockModal('ip'); setBlockReason(''); }}
            >
              IP
            </Button>
            <Button
              size="small"
              icon={<StopOutlined />}
              onClick={() => { setBlockModal('word'); setBlockReason(''); }}
            >
              금칙어
            </Button>
          </div>
        </div>
      </div>
      </div>

      {/* ── Tabs ── */}
      <div className={styles.scrollSection}>
      <Tabs
        defaultActiveKey="info"
        items={[
          { key: 'info', label: '기본 정보', children: renderInfoTab() },
          { key: 'memo', label: '메모/코멘트', children: renderMemoTab() },
          { key: 'logs', label: '상태 변경 이력', children: renderLogsTab() },
          { key: 'related', label: '관련 상담', children: renderRelatedTab() },
        ]}
      />
      </div>

      {/* 예약 상태 변경 시 예약일시 선택 모달 */}
      <Modal
        open={scheduledPending !== null}
        title="예약 일시 선택"
        okText="변경"
        cancelText="취소"
        okButtonProps={{ disabled: !scheduledDate }}
        confirmLoading={updateStatus.isPending}
        onOk={handleScheduledConfirm}
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

      {/* 차단 모달 */}
      <Modal
        open={blockModal !== null}
        title={
          blockModal === 'hp' ? `전화번호 차단 — ${data.counselHp}` :
          blockModal === 'ip' ? `IP 차단 — ${data.counselIp}` :
          '금칙어 차단'
        }
        okText="차단"
        cancelText="취소"
        okButtonProps={{
          danger: true,
          loading: createBlockHp.isPending || createBlockIp.isPending || createBlockWord.isPending,
          ...(blockModal === 'word' ? { disabled: !blockReason.trim() } : {}),
        }}
        onOk={async () => {
          try {
            if (blockModal === 'hp') {
              await createBlockHp.mutateAsync({ blockHp: data.counselHp, reason: blockReason || undefined });
              message.success(`${data.counselHp} 전화번호가 차단되었습니다.`);
            } else if (blockModal === 'ip') {
              await createBlockIp.mutateAsync({ blockIp: data.counselIp, reason: blockReason || undefined });
              message.success(`${data.counselIp} IP가 차단되었습니다.`);
            } else if (blockModal === 'word') {
              await createBlockWord.mutateAsync({ blockWord: blockReason.trim(), matchType: 'CONTAINS' });
              message.success('금칙어가 등록되었습니다.');
            }
            setBlockModal(null);
            setBlockReason('');
          } catch {
            message.error('차단 처리에 실패했습니다.');
          }
        }}
        onCancel={() => {
          setBlockModal(null);
          setBlockReason('');
        }}
        width={400}
      >
        {blockModal === 'word' ? (
          <>
            <p style={{ marginBottom: 8 }}>차단할 금칙어를 입력해주세요.</p>
            <Input
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="금칙어 입력"
            />
          </>
        ) : (
          <>
            <p style={{ marginBottom: 8 }}>차단 사유를 입력해주세요. (선택)</p>
            <Input
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="차단 사유 입력"
            />
          </>
        )}
      </Modal>
    </div>
  );
}
