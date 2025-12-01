// src/components/RecordDetail.tsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { type NazoRecord } from '../types/record';

interface RecordDetailProps {
  records: NazoRecord[];
}

const RecordDetail: React.FC<RecordDetailProps> = ({ records }) => {
  // 1. useParams() を使ってURLのパラメータ（:id）を取得
  const { id } = useParams<{ id: string }>();

  // 2. 取得したidを使って、recordsリストから該当する記録を検索
  const record = records.find(r => r.id === id);

  // 記録が見つからない場合
  if (!record) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ffcccc', backgroundColor: '#fff0f0', borderRadius: '5px' }}>
        <h2>⚠️ エラー: 記録が見つかりません</h2>
        <p>指定されたIDを持つ謎解き参加記録は存在しません。（ID: {id}）</p>
        <Link to="/">一覧へ戻る</Link>
      </div>
    );
  }

  // 記録が見つかった場合
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff', display: 'block', marginBottom: '15px' }}>
        ← 記録一覧へ戻る
      </Link>

      <h1 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
        {record.title}
      </h1>
      
      <div style={{ margin: '20px 0' }}>
        <p>
          <span style={{ fontWeight: 'bold', minWidth: '100px', display: 'inline-block' }}>🗓️ 参加日:</span> 
          {record.date}
        </p>
        <p>
          <span style={{ fontWeight: 'bold', minWidth: '100px', display: 'inline-block' }}>✅ 結果:</span> 
          <span style={{ color: record.result === '成功' ? 'green' : 'red' }}>
            **{record.result}**
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold', minWidth: '100px', display: 'inline-block' }}>⭐ 評価:</span> 
          {/* スコアを星で表現する例 */}
          {'★'.repeat(record.score) + '☆'.repeat(5 - record.score)} ({record.score}/5)
        </p>
      </div>

      <div style={{ borderTop: '1px dashed #ccc', paddingTop: '15px' }}>
        <h2>💬 感想・メモ</h2>
        <p style={{ whiteSpace: 'pre-wrap', backgroundColor: '#ffffff', padding: '15px', borderRadius: '3px', lineHeight: '1.6' }}>
          {record.memo || '感想の記録はありません。'}
        </p>
      </div>
      
    </div>
  );
};

export default RecordDetail;