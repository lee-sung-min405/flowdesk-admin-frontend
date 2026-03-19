import { useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  PermissionMatrix,
  usePermissionCatalog,
} from '@features/permission-catalog';
import styles from './permission-catalog-page.module.css';

export default function PermissionCatalogPage() {
  const { data, isLoading, dataUpdatedAt, refetch, isFetching } = usePermissionCatalog();
  const [searchKeyword, setSearchKeyword] = useState('');

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>권한 카탈로그</h1>
          </div>
          <p className={styles.pageDesc}>페이지별 액션 권한 매트릭스를 조회할 수 있습니다.</p>
        </div>
        <div className={styles.toolbar}>
          <Input
            className={styles.searchInput}
            placeholder="페이지 이름 또는 경로 검색"
            prefix={<SearchOutlined />}
            allowClear
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button
            className={styles.refreshBtn}
            onClick={() => refetch()}
            disabled={isFetching}
            type="button"
          >
            <ReloadOutlined spin={isFetching} />
            <span>새로고침</span>
          </button>
          {dataUpdatedAt > 0 && (
            <span className={styles.updatedAt}>
              {dayjs(dataUpdatedAt).format('HH:mm:ss')} 기준
            </span>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <PermissionMatrix data={data} loading={isLoading} searchKeyword={searchKeyword} />
      </div>
    </div>
  );
}
