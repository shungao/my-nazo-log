// src/App.tsx

import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { type NazoRecord } from './types/record';
import { type NazoEvent, initialEvents } from './types/event'; 

import RecordList from './components/RecordList';
import EventDetail from './components/EventDetail'; 
import RecordFormModal from './components/RecordFormModal'; 

import { getInitialRecords, saveRecords } from './utils/storage';

const initialRecords: NazoRecord[] = getInitialRecords();

function App() {
  const [records, setRecords] = useState<NazoRecord[]>(initialRecords); 
  const [events] = useState<NazoEvent[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetEventId, setTargetEventId] = useState<string | null>(null);
  // 【★ 追加: 編集対象の記録IDを保持するState ★】
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  // 【★ 修正: 記録の追加/更新を処理する関数 ★】
  // 【★ 修正: idToEdit の型を string | null | undefined に広げます ★】
  const handleSaveRecord = (recordData: Omit<NazoRecord, 'id'>, idToEdit?: string | null) => {
    let updatedRecords: NazoRecord[];

    // idToEdit が null または undefined でない場合に編集を実行
    if (idToEdit) { 
      // 編集の場合: 既存の記録を更新
      updatedRecords = records.map(r => 
        r.id === idToEdit ? { ...recordData, id: idToEdit } : r
      );
    } else {
      // 新規作成の場合: 新しいIDを付与して追加
      const recordWithId: NazoRecord = { ...recordData, id: Date.now().toString() };
      updatedRecords = [...records, recordWithId];
    }
    
    setRecords(updatedRecords);
    saveRecords(updatedRecords);
    
    // モーダルを閉じてStateをリセット
    setIsModalOpen(false);
    setTargetEventId(null); 
    setEditingRecordId(null); // 【★ 編集IDをリセット ★】
  };
  
  // 【★ 修正: 記録開始関数。新規と編集をIDで区別 ★】
  const startRecord = (eventId: string | null = null, recordIdToEdit: string | null = null) => {
      setTargetEventId(eventId);
      setEditingRecordId(recordIdToEdit); // 編集IDを設定
      setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTargetEventId(null);
    setEditingRecordId(null); // 【★ 編集IDをリセット ★】
  };

  // 編集対象の記録データを見つける
  const recordToEdit = editingRecordId 
    ? records.find(r => r.id === editingRecordId) 
    : undefined;

  return (
    <HashRouter>
      <div className="App" style={{ 
        maxWidth: '1200px', // 【★ 修正: 最大幅を 1200px に広げます ★】
        margin: '0 auto', 
        padding: '20px',
        backgroundColor: '#f7f9fc', 
        minHeight: '100vh',
        fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <header style={{ 
          textAlign: 'center', 
          backgroundColor: '#3498db', 
          color: 'white', 
          padding: '15px 0',
          marginBottom: '30px', 
          borderRadius: '8px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
        }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'lighter' }}>
            謎解き参加記録ログ
          </h1>
        </header>

        <Routes>
          <Route 
            path="/" 
            element={<RecordList events={events} onOpenForm={() => startRecord(null)} />} 
          /> 
          
          <Route 
            path="/event/:eventId" 
            element={<EventDetail 
                      onOpenForm={startRecord} 
                      records={records} 
                    />} 
          />
        </Routes>

        <RecordFormModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          // 【★ 修正: onSave に編集IDを渡す関数を渡す ★】
          onSave={(data) => handleSaveRecord(data, editingRecordId)} 
          targetEventId={targetEventId} 
          events={events} 
          // 【★ 追加: 編集対象の記録データを渡す ★】
          initialData={recordToEdit} 
        />
      </div>
    </HashRouter>
  );
}

export default App;