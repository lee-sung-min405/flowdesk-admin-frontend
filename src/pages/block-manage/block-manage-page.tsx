import { Tabs } from 'antd';
import {
  GlobalOutlined,
  MobileOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import BlockIpPanel from './block-ip-panel';
import BlockHpPanel from './block-hp-panel';
import BlockWordPanel from './block-word-panel';
import styles from './block-manage-page.module.css';

const TAB_ITEMS = [
  {
    key: 'ip',
    label: (
      <span>
        <GlobalOutlined /> IP 차단
      </span>
    ),
    children: <BlockIpPanel />,
  },
  {
    key: 'hp',
    label: (
      <span>
        <MobileOutlined /> 휴대폰 차단
      </span>
    ),
    children: <BlockHpPanel />,
  },
  {
    key: 'word',
    label: (
      <span>
        <FileTextOutlined /> 금칙어 관리
      </span>
    ),
    children: <BlockWordPanel />,
  },
];

export default function BlockManagePage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>차단 관리</h1>
          </div>
          <p className={styles.pageDesc}>IP, 휴대폰 번호, 금칙어 차단을 관리할 수 있습니다.</p>
        </div>
      </div>

      <div className={styles.tabsCard}>
        <Tabs defaultActiveKey="ip" items={TAB_ITEMS} />
      </div>
    </div>
  );
}
