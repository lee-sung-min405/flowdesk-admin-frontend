import { useState } from 'react';
import { Input, Button, Alert, Descriptions, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useCheckBlockWord } from '../../model/use-check-block-word';
import styles from './block-word-check.module.css';

export default function BlockWordCheck() {
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const { data, isLoading, isError } = useCheckBlockWord(searchValue);

  const handleCheck = () => {
    const trimmed = inputValue.trim();
    if (trimmed) setSearchValue(trimmed);
  };

  return (
    <div className={styles.container}>
      <p className={styles.description}>
        텍스트를 입력하여 금칙어 포함 여부를 확인합니다. (EXACT → CONTAINS → REGEX 순서로 검사)
      </p>

      <div className={styles.inputRow}>
        <Input.TextArea
          placeholder="확인할 텍스트를 입력하세요..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoSize={{ minRows: 2, maxRows: 4 }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleCheck}
          loading={isLoading}
          style={{ alignSelf: 'flex-start' }}
        >
          확인
        </Button>
      </div>

      <div className={styles.resultArea}>
        {isLoading && <Spin />}

        {isError && (
          <Alert type="error" message="금칙어 확인에 실패했습니다." showIcon />
        )}

        {data && !isLoading && (
          data.isBlocked ? (
            <Alert
              type="error"
              message="금칙어가 포함되어 있습니다"
              showIcon
              description={
                <Descriptions column={1} size="small" style={{ marginTop: 8 }}>
                  <Descriptions.Item label="차단 ID">{data.blockId}</Descriptions.Item>
                  <Descriptions.Item label="매칭된 단어">{data.matchedWord ?? '-'}</Descriptions.Item>
                  <Descriptions.Item label="차단 사유">{data.reason ?? '-'}</Descriptions.Item>
                </Descriptions>
              }
            />
          ) : (
            <Alert type="success" message="금칙어가 포함되어 있지 않습니다" showIcon />
          )
        )}
      </div>
    </div>
  );
}
