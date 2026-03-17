import { Card } from 'antd';
import logo from '/src/shared/assets/logo.png';
import styles from './login-page.module.css';
import { LoginForm } from '../../features/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '../../features/auth/lib/auth-storage';

export default function LoginPage() {
	const navigate = useNavigate();
	useEffect(() => {
		// accessToken이 있으면 로그인된 상태로 간주
		if (authStorage.getAccessToken()) {
			navigate('/dashboard', { replace: true });
		}
	}, [navigate]);
	return (
		<div className={styles.container}>
			<Card className={styles.card}>
				<div className={styles.logoWrapper}>
					<img
						src={logo}
						alt="FlowDesk Logo"
						className={styles.logoImg}
					/>
				</div>
				<LoginForm />
				<div className={styles.signupText}>
					아직 계정이 없으신가요? <a href="#">회원가입</a>
				</div>
			</Card>
			<div className={styles.copyright}>
				Flowdesk Admin © 2026 All rights reserved.
			</div>
		</div>
	);
}
