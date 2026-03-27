import { Button, Card } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './forbidden-page.module.css';

export default function ForbiddenPage() {
	const navigate = useNavigate();

	return (
		<div className={styles.container}>
			<Card className={styles.card}>
				<StopOutlined className={styles.icon} />
				<div className={styles.title}>접근 권한이 없습니다</div>
				<div className={styles.description}>
					이 페이지에 접근할 수 있는 권한이 부족합니다.
					<br />
					관리자에게 권한을 요청하거나 홈으로 이동하세요.
				</div>
				<Button type="primary" size="large" onClick={() => navigate('/home', { replace: true })}>
					홈으로 이동
				</Button>
				<div className={styles.copyright}>
					Flowdesk Admin © 2026 All rights reserved.
				</div>
			</Card>
		</div>
	);
}
