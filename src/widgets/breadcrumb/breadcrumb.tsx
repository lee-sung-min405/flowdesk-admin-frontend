// AppBreadcrumb 컴포넌트 예시
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useLocation, Link } from 'react-router-dom';
import { useMe } from '@features/auth/model/use-me';
import styles from './breadcrumb.module.css';

export default function Breadcrumb() {
  const location = useLocation();
  const { pathNameMap } = useMe();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const items = [
    {
      title: (
        <Link to="/home">
          <HomeOutlined />
        </Link>
      ),
    },
    ...pathSegments.map((_, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const name = pathNameMap[path] ?? pathSegments[index];
      const isLast = index === pathSegments.length - 1;

      return {
        title: isLast ? name : <Link to={path}>{name}</Link>,
      };
    }),
  ];

  return <AntBreadcrumb className={styles.breadcrumb} items={items} />;
}
