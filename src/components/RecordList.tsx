// src/components/RecordList.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { type NazoEvent } from '../types/event'; 
// 【★ 追加: カスタムフックのインポート ★】
import useWindowWidth from '../hooks/useWindowWidth';

interface RecordListProps {
  events: NazoEvent[]; 
  onOpenForm: () => void; 
}

// PC表示に切り替えるブレークポイントを定義 (例: 800px)
const PC_BREAKPOINT = 800;

const RecordList: React.FC<RecordListProps> = ({ events, onOpenForm }) => {
    // 【★ 追加: ウィンドウ幅の判定 ★】
  const isWideScreen = useWindowWidth(PC_BREAKPOINT);
  
  const styles = {
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px', 
      borderBottom: '2px solid #bdc3c7',
      paddingBottom: 'none',
    },
    list: {
      listStyle: 'none',
      padding: 0,
    // PCの場合にグリッドレイアウトを適用
      display: isWideScreen ? 'grid' : 'block',
      gridTemplateColumns: isWideScreen ? '1fr 1fr' : 'none', // 2列設定
      gap: isWideScreen ? '20px' : '0', // グリッド間の間隔
    } as React.CSSProperties, // TypeScriptエラー回避のため型アサーション
    listItem: {
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      margin: isWideScreen ? '0' : '12px 0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      transition: 'box-shadow 0.2s, transform 0.2s', 
      backgroundColor: 'white',
      height: '100%',
    },
    link: {
      textDecoration: 'none',
      color: '#333',
      display: 'block',
      padding: '15px',
      height: '100%',
    },
    title: {
      margin: '0 0 5px 0', 
      color: '#34495e', 
      fontSize: '1.2em',
      fontWeight: 'bold',
      borderBottom: '1px solid #f0f0f0', // 画像には見えないが、情報ブロック間に線がある前提
      paddingBottom: '8px',
    },
    infoText: {
      margin: '5px 0', 
      fontSize: '0.9em',
      color: '#7f8c8d' 
    },
    difficulty: {
      color: '#f39c12',
      fontSize: '1.2em', // 星を少し大きく
    },
    finishedText: {
      color: '#e74c3c', 
      fontWeight: 'bold',
      fontSize: '0.9em',
      marginTop: '10px',
    },
    button: {
      padding: '8px 15px', 
      fontSize: '16px', 
      cursor: 'pointer', 
      backgroundColor: '#3498db', 
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      transition: 'background-color 0.2s',
    }
  };

  return (
    <div>
      <div style={styles.headerContainer}>
        <h2>公演・イベント一覧</h2>
        <button onClick={onOpenForm} style={styles.button}>
          記録をつける
        </button>
      </div>

      {events.length === 0 ? (
        <p>現在開催中、または予定されている公演はありません。</p>
      ) : (
        <ul style={styles.list}>
          {events.map(event => (
            <li key={event.eventId} style={styles.listItem}>
              <Link to={`/event/${event.eventId}`} style={styles.link}>
                <h3 style={styles.title}>{event.name}</h3>
                <p style={styles.infoText}>
                  団体: {event.organizer} / 会場: {event.venue}
                </p>
                <p style={styles.infoText}>
                  所要時間: {event.duration} / 
                  難易度: <span style={styles.difficulty}>{'★'.repeat(event.difficulty) + '☆'.repeat(5 - event.difficulty)}</span>
                </p>
                {event.isFinished && (
                  <strong style={styles.finishedText}>[終了済み]</strong>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecordList;