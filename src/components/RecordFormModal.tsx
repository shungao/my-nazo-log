// src/components/RecordFormModal.tsx

import React, { useState, useEffect } from 'react';
import { type NazoRecord } from '../types/record';
import { type NazoEvent } from '../types/event'; 

type NewRecord = Omit<NazoRecord, 'id'>;

interface RecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  // 【★ 修正: onSave の引数から idToEdit を削除し、App.tsx側で処理 ★】
  onSave: (record: NewRecord) => void; 
  targetEventId: string | null; 
  events: NazoEvent[]; 
  // 【★ 追加: 編集時の初期データを渡すためのプロパティ ★】
  initialData?: NazoRecord;
}

const initialFormData: NewRecord = {
  title: '',
  date: new Date().toISOString().split('T')[0],
  result: '成功',
  score: 3,
  memo: '',
};

const RecordFormModal: React.FC<RecordFormModalProps> = ({ isOpen, onClose, onSave, targetEventId, events, initialData }) => { 
  const [formData, setFormData] = useState<NewRecord>(initialFormData);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      // 編集モードの場合: initialDataをフォームにセット
      setFormData({
          title: initialData.title || '',
          date: initialData.date,
          result: initialData.result,
          score: initialData.score,
          memo: initialData.memo || '',
          eventId: initialData.eventId,
      });
    } else if (targetEventId) {
      // 新規作成モードの場合（イベント指定あり）
      const targetEvent = events.find(e => e.eventId === targetEventId);
      setFormData({
          ...initialFormData, 
          title: targetEvent?.name || '', 
          eventId: targetEventId, // フォームデータに eventId を含める
      });
    } else {
      // 新規作成モード（イベント指定なし）
      setFormData(initialFormData);
    }
  }, [targetEventId, events, isOpen, initialData]); 

  if (!isOpen) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'score' ? parseInt(value, 10) : value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('イベント名を入力してください。');
      return;
    }
    
    const recordToSave: NewRecord = {
        ...formData,
        eventId: targetEventId || undefined, 
    };

    onSave(recordToSave);
  };
  
  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative',
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: '15px',
  };


  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
          X
        </button>

        <h2>{initialData ? '参加記録の編集' : '参加記録の登録'}</h2> {/* 【★ 修正: タイトルを動的に変更 ★】 */}
        <hr />
        
        <form onSubmit={handleSubmit}>
          
          <div style={inputGroupStyle}>
            <label htmlFor="title">イベント名/公演名:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="date">参加日:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={inputGroupStyle}>
            <label>結果:</label>
            <div>
              <label style={{ marginRight: '15px' }}>
                <input
                  type="radio"
                  name="result"
                  value="成功"
                  checked={formData.result === '成功'}
                  onChange={handleChange}
                /> 成功
              </label>
              <label>
                <input
                  type="radio"
                  name="result"
                  value="失敗"
                  checked={formData.result === '失敗'}
                  onChange={handleChange}
                /> 失敗
              </label>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="score">評価 (1〜5): {formData.score}</label>
            <input
              type="range"
              id="score"
              name="score"
              min="1"
              max="5"
              step="1"
              value={formData.score}
              onChange={handleChange}
              style={{ width: '100%', marginTop: '5px' }}
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="memo">感想・メモ:</label>
            <textarea
              id="memo"
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              rows={4}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
            {initialData ? '記録を更新' : '記録を保存'} {/* 【★ 修正: ボタンテキストを動的に変更 ★】 */}
          </button>
          
          <button type="button" onClick={onClose} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#ccc', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            キャンセル
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecordFormModal;