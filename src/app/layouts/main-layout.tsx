import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@widgets/sidebar/sidebar';
import Header from '@widgets/header/header';
import styles from './main-layout.module.css';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <div className={styles.main} data-collapsed={collapsed}>
        <Header collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
        <main className={styles.content} data-scroll-area>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
