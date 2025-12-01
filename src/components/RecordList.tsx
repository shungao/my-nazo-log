// src/components/RecordList.tsx

import React, { useState, useEffect } from 'react'; // 【★ useState, useEffect を追加 ★】
import { Link } from 'react-router-dom';
import { type NazoEvent } from '../types/event'; 
// 【★ 追加: カスタムフックのインポート ★】
// import useWindowWidth from '../hooks/useWindowWidth';

interface RecordListProps {
  events: NazoEvent[]; 
  onOpenForm: () => void; 
}

// PC表示に切り替えるブレークポイントを定義 (例: 800px)
const PC_BREAKPOINT = 800;
const LARGE_BREAKPOINT = 1200; // 3列になるブレークポイント (追加)

const RecordList: React.FC<RecordListProps> = ({ events, onOpenForm }) => {
  // 【★ 修正: ウィンドウ幅をStateで管理 ★】
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);  
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // 初回マウント時のみ実行

  // 画面幅に応じて列数を動的に決定
  const getColumnCount = (width: number) => {
    if (width >= LARGE_BREAKPOINT) {
      return 3; // 1200px以上で3列
    }
    if (width >= PC_BREAKPOINT) {
      return 2; // 800px以上で2列
    }
    return 1; // それ未満で1列 (スマホ)
  };

  const colCount = getColumnCount(windowWidth);

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
      display: 'grid',
      // 【★ 修正: 列数を動的に設定 ★】
      gridTemplateColumns: `repeat(${colCount}, 1fr)`, 
      gap: '20px', 
    } as React.CSSProperties,
    listItem: {
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      margin: colCount > 1 ? '0' : '12px 0', // PC(2列以上)ならマージンなし、スマホ(1列)ならマージンあり
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      transition: 'box-shadow 0.2s, transform 0.2s', 
      backgroundColor: 'white',
      height: '100%',
      padding: 0, // 【★修正: paddingを0にする★】
    },
    link: {
      textDecoration: 'none',
      color: '#333',
      display: 'flex', // 【★追加: Flexboxを有効化★】
      alignItems: 'flex-start', // 上端揃え
      padding: '10px', // paddingをlistItemからLinkに移す
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
      backgroundColor: '#77bb49ff', 
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      transition: 'background-color 0.2s',
    },
    imageContainer: {
        width: '100px', // 幅を固定 (例: 100px)
        flexShrink: 0,
        marginRight: '10px', 
        backgroundColor: '#eee', 
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: '4px',
        
        // 【★修正: position の値に as 'relative' を追加★】
        position: 'relative' as 'relative',
        paddingTop: '33.33%', // 縦/横 = 2/3 ≈ 66.66% (高さを幅の2/3にする)
        height: 0, // 高さを padding-top で制御するため 0 に設定
    },
    // 【★追加: テキスト情報全体を囲むコンテナのスタイル★】
    infoContainer: {
        flexGrow: 1, // 残りのスペースを埋める
        minWidth: 0, // Flexアイテムがはみ出さないように設定
    } as React.CSSProperties,
    // 【★修正: 画像のスタイル★】
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as 'cover',
        // 【★追加: 縦横比が適用されたコンテナ内に画像を配置★】
        position: 'absolute' as 'absolute',
        top: 0,
        left: 0,
    },
    // 【★修正: プレースホルダーテキストのスタイル★】
    placeholderText: {
        color: '#888',
        fontSize: '14px',
        // 【★追加: 縦横比が適用されたコンテナ内にテキストを配置★】
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center' as 'center',
    },
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
                {/* 【★ 追加: 画像表示コンテナ ★】 */}
                <div style={styles.imageContainer}>
                    {event.keyVisualUrl ? (
                        // 画像URLが存在する場合
                        <img 
                            src={event.keyVisualUrl} 
                            alt={`${event.name} キービジュアル`} 
                            style={styles.image}
                            // ★エラーハンドリング: 画像が読み込めなかった場合も代替表示に切り替える★
                            onError={(e) => {
                            const imgElement = e.target as HTMLImageElement;
                            imgElement.style.display = 'none'; // 画像を非表示にする

                            // 【★ 修正: nextSibling が存在するかチェックしてから代入を行う ★】
                            const placeholder = imgElement.nextSibling as HTMLElement | null;
                            if (placeholder) {
                                placeholder.textContent = '画像なし';
                            }
                        }}
                        />
                    ) : null}
                    {/* 画像URLがない、または読み込み失敗した場合の代替表示 */}
                    {!event.keyVisualUrl && (
                        <span style={styles.placeholderText}>
                            キービジュアルなし
                        </span>
                    )}
                </div>
                {/* 2. 情報コンテナ (右側) */}
                <div style={styles.infoContainer}>
                    <h3 style={styles.title}>{event.name}</h3>
                    <p style={styles.infoText}>団体: {event.organizer} / 会場: {event.venue}</p>
                    <p style={styles.infoText}>所要時間: {event.duration} / 難易度: <span style={styles.difficulty}>{'★'.repeat(event.difficulty) + '☆'.repeat(5 - event.difficulty)}</span></p>
                    {event.isFinished && (
                        <strong style={styles.finishedText}>[終了済み]</strong>
                    )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecordList;