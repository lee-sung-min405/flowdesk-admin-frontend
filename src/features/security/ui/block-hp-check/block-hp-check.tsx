import { useState } from 'react';
import { Input, Button, Alert, Descriptions, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useCheckBlockHp } from '../../model/use-check-block-hp';
import styles from './block-hp-check.module.css';

export default function BlockHpCheck() {
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const { data, isLoading, isError } = useCheckBlockHp(searchValue);

  const handleCheck = () => {
    const trimmed = inputValue.trim();
    if (trimmed) setSearchValue(trimmed);
  };

  return (
    <div className={styles.container}>
      <p className={styles.description}>
        휴대폰 번호를 입력하여 차단 여부를 확인합니다. (활성화된 차단만 검사, 하이픈 없이 입력 권장)
      </p>

      <div className={styles.inputRow}>
        <Input
          placeholder="예: 01012345678"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleCheck}
          allowClear
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleCheck}
          loading={isLoading}
        >
          확인
        </Button>
      </div>

      <div className={styles.resultArea}>
        {isLoading && <Spin />}

        {isError && (
          <Alert type="error" message="차단 여부 확인에 실패했습니다." showIcon />
        )}

        {data && !isLoading && (
          data.isBlocked ? (
            <Alert
              type="error"
              message="차단된 휴대폰 번호입니다"
              showIcon
              description={
                <Descriptions column={1} size="small" style={{ marginTop: 8 }}>
                  <Descriptions.Item label="차단 ID">{data.blockId}</Descriptions.Item>
                  <Descriptions.Item label="차단 사유">{data.reason ?? '-'}</Descriptions.Item>
                </Descriptions>
              }
            />
          ) : (
            <Alert type="success" message="차단되지 않은 휴대폰 번호입니다" showIcon />
          )
        )}
      </div>
    </div>
  );
}
