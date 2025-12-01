// src/components/EventDetail.tsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { initialEvents } from '../types/event';
import { type NazoRecord } from '../types/record'; 
import RadarChart from './RadarChart'; // 【★ 追加 ★】

interface EventDetailProps {
  // 【★ 修正: onOpenForm の型に recordIdToEdit を追加 ★】
  onOpenForm: (eventId: string, recordIdToEdit: string | null) => void; 
  records: NazoRecord[];
}

const EventDetail: React.FC<EventDetailProps> = ({ onOpenForm, records }) => {
  const { eventId } = useParams<{ eventId: string }>();

  const event = initialEvents.find(e => e.eventId === eventId);
  
  const relatedRecords = records
    .filter(r => r.eventId === eventId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 【★ 追加: 既存の記録があるか判定し、そのIDを取得 ★】
  const existingRecord = relatedRecords.length > 0 ? relatedRecords[0] : null;
  const buttonText = existingRecord ? '記録を編集する' : '参加記録をつける';
  const buttonColor = existingRecord ? '#f39c12' : '#27ae60'; // 編集はオレンジ、新規は緑

  // 【★ 追加: レーダーチャート用データの平均を算出 ★】
  // ※現在のロジックでは記録は1件のみのため、ここではその1件のデータをそのまま使います
  const averageRecordValues = relatedRecords.length > 0 ? {
    puzzle: relatedRecords[0].puzzle,
    experience: relatedRecords[0].experience,
    quantity: relatedRecords[0].quantity,
    mystery: relatedRecords[0].mystery,
    cheerfulness: relatedRecords[0].cheerfulness,
  } : null;

  // スタイル定義
  const styles: { [key: string]: React.CSSProperties } = { 
    // 【★修正対象: コンテナのスタイル★】
    container: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      
      // 【★追加: 最大幅を設定し、中央寄せにする★】
      maxWidth: '900px', // ★この値を変更して最大幅を設定★
      margin: '0 auto',  // 中央に配置
      
      minHeight: '80vh',
    } as React.CSSProperties,
    backLink: {
      textDecoration: 'none',
      color: '#3498db',
      display: 'block',
      marginBottom: '20px',
      fontWeight: 'bold',
    },
    h1: {
      borderBottom: '3px solid #3498db',
      paddingBottom: '10px',
      color: '#2c3e50',
    },
    infoBlock: {
      margin: '25px 0',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    infoLine: {
      marginBottom: '12px',
      fontSize: '1.1em',
    },
    label: {
      fontWeight: 'bold', 
      minWidth: '130px', 
      display: 'inline-block',
      color: '#34495e',
    },
    buttonArea: {
      borderTop: '1px dashed #95a5a6',
      paddingTop: '25px',
      textAlign: 'center',
    },
    actionButton: { 
      padding: '12px 30px', 
      fontSize: '18px', 
      backgroundColor: buttonColor, // 【★ 修正: 色を動的に変更 ★】
      color: 'white', 
      border: 'none', 
      borderRadius: '6px', 
      cursor: 'pointer',
      boxShadow: '0 3px 6px rgba(0, 0, 0, 0.2)',
      transition: 'background-color 0.2s',
    },
    recordHeader: {
      marginTop: '30px',
      paddingTop: '15px',
      borderTop: '1px solid #bdc3c7',
      color: '#34495e',
    },
    recordItem: {
      border: '1px solid #dcdfe3',
      margin: '10px 0',
      padding: '15px',
      borderRadius: '6px',
      backgroundColor: '#fefefe',
    },
    successText: { color: '#2ecc71', fontWeight: 'bold' },
    failText: { color: '#e74c3c', fontWeight: 'bold' },
    scoreStar: { color: '#f39c12' },
    // 【★追加: メタ情報と画像を囲むFlexコンテナ★】
    headerFlex: {
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-start',
        marginBottom: '20px',
        flexWrap: 'wrap' as 'wrap', // スマホでも崩れないように折り返しを許可

        // 【★追加: アイテムがコンテナの幅を超えたら自動で縮小させる設定★】
        // これはメインコンテンツ全体が画面幅を超えるのを防ぎます
        overflow: 'hidden',
        width: '100%',
    } as React.CSSProperties,
    // 【★修正: 詳細画面の画像コンテナのスタイル★】
    visualContainer: {
        width: '200px', // 幅を固定
        flexShrink: 0,
        backgroundColor: '#eee', 
        borderRadius: '8px',
        overflow: 'hidden',

        // 【★追加: スマホ幅が200px以下になった場合に画像を縮小させる★】
        // スマホでは幅を100%にし、200pxを超えないように制限します。
        maxWidth: '100%',
        boxSizing: 'border-box' as 'border-box',
        
        // Flexboxの振る舞いを上書きするスタイル
        flexBasis: '100%', // 【★重要: スマホでは基本的に1行全体を使う★】
        
        // 【★修正: 縦横比 3:2 を適用するコンテナ（外側）★】
        position: 'relative',
        paddingTop: '33.33%', // 縦/横 = 2/3 ≈ 66.66%
        height: 0,
    },
    // 【★修正: 画像のスタイル★】
    visualImage: {
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
        fontSize: '16px',
        fontWeight: 'bold',
        // 【★追加: 縦横比が適用されたコンテナ内にテキストを配置★】
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center' as 'center',
    },
  };

  // 公演が見つからない場合
  if (!event) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ffcccc', backgroundColor: '#fff0f0', borderRadius: '5px' }}>
        <h2>エラー: 公演が見つかりません</h2>
        <p>指定されたIDを持つ公演は存在しません。（ID: {eventId}）</p>
        <Link to="/">一覧へ戻る</Link>
      </div>
    );
  }

  // 公演が見つかった場合
  return (
    <div style={styles.container}>
      
      <Link to="/" style={styles.backLink}>
        ← 公演一覧へ戻る
      </Link>

      {/* 【★追加: 画像とH1を囲むFlexコンテナ★】 */}
      <div style={styles.headerFlex}>
          {/* 1. 画像コンテナ (左側) */}
          <div style={styles.visualContainer}>
              {event.keyVisualUrl ? (
                  <img 
                      src={event.keyVisualUrl} 
                      alt={`${event.name} キービジュアル`} 
                      style={styles.visualImage}
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
              {(!event.keyVisualUrl || event.keyVisualUrl) && ( // URLがないか、読み込み失敗時に表示
                  <span style={styles.placeholderText}>
                      キービジュアルなし
                  </span>
              )}
          </div>

          {/* 2. テキスト情報 (右側) */}
          <div>
              <h1 style={styles.h1}>{event.name}</h1>
              <p style={styles.infoText}>団体: {event.organizer} / 会場: {event.venue}</p>
              <p style={styles.infoText}>所要時間: {event.duration}</p>
              <h2 style={styles.difficultyHeader}>
                  難易度: <span style={styles.difficultyStars}>{'★'.repeat(event.difficulty) + '☆'.repeat(5 - event.difficulty)}</span>
              </h2>
          </div>
      </div>
      
      {/* 記録ボタンエリア */}
      <div style={styles.buttonArea}>
        {event.isFinished ? (
          <p style={{ color: '#dc3545', fontWeight: 'bold' }}>この公演は終了しています。</p>
        ) : (
          <button 
            onClick={() => onOpenForm(event.eventId, existingRecord ? existingRecord.id : null)} // 【★ 修正: 既存記録IDを渡す ★】
            style={{...styles.actionButton, backgroundColor: buttonColor}} // 【★ 修正: 動的な色を適用 ★】
          >
            {buttonText} {/* 【★ 修正: ボタンテキストを動的に変更 ★】 */}
          </button>
        )}
      </div>

      {/* 【★ 追加: レーダーチャート表示エリア ★】 */}
      <h2 style={styles.recordHeader}>詳細評価</h2>
      {averageRecordValues ? (
          <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              marginBottom: '30px',
              textAlign: 'center'
          }}>
              <p style={{ fontWeight: 'bold' }}>あなたの詳細評価</p>
              <RadarChart dataValues={averageRecordValues} label="あなたの評価" />
          </div>
      ) : (
          <p>記録がないため、詳細評価グラフは表示できません。</p>
      )}

      <h2 style={styles.recordHeader}>この公演の参加記録 ({relatedRecords.length} 件)</h2>
      
      {/* 【★ 修正: 記録は1件のみ表示し、それ以外は無視する ★】 */}
      {existingRecord ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li key={existingRecord.id} style={styles.recordItem}>
            <p style={{ margin: '0 0 5px 0' }}>
              参加日: {existingRecord.date} / 結果: <strong style={existingRecord.result === '成功' ? styles.successText : styles.failText}>{existingRecord.result}</strong>
            </p>
            <p style={{ margin: '5px 0' }}>
              評価: <span style={styles.scoreStar}>{'★'.repeat(existingRecord.score) + '☆'.repeat(5 - existingRecord.score)}</span>
            </p>
            <p style={{ margin: '0' }}>
              メモ: {existingRecord.memo || '(メモなし)'}
            </p>
          </li>
        </ul>
      ) : (
        <p>この公演に関する記録はまだありません。</p>
      )}
    </div>
  );
};

export default EventDetail;