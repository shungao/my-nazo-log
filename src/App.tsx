// src/App.tsx

import { useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
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

  // スマホ/PC切り替えのブレークポイント (RecordList.tsxと合わせる)
  const PC_BREAKPOINT = 800;

  // ウィンドウ幅を取得するカスタムフック useWindowWidth があれば利用します
  // const isWideScreen = useWindowWidth(PC_BREAKPOINT);
  // (今回はフックをインポートせずに、静的なスタイルで対応します)
  const isMobile = window.innerWidth < PC_BREAKPOINT;

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

        {/* メインレイアウトコンテナ */}
        <div style={{ 
          display: 'flex', 
          paddingTop: '20px', // ヘッダーとの間隔
          // 【★ 修正: スマホ幅では flex-wrap を使用し縦積み対応 ★】
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
            
            {/* 【★ 追加: 左サイドバー ★】 */}
            <aside style={{
                // 【★ 修正: スマホでは非表示にする ★】
                display: isMobile ? 'none' : 'block',
                width: '200px',
                flexShrink: 0,
                // 背景色とパディングを調整して、画像のような浮き出たカード状にする
                backgroundColor: 'white', 
                padding: '20px 0', 
                borderRadius: '8px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
                marginLeft: '20px', // 左端の余白
                marginRight: '20px',
                height: 'fit-content', // コンテンツの高さに合わせる
                position: 'sticky', // スクロールしても位置を保持
                top: '20px',
            } as React.CSSProperties}>
                <nav>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
                                公演一覧に戻る
                            </Link>
                        </li>
                        <li style={{ color: '#333', fontWeight: 'bold' }}>
                            自分の記録を見る
                        </li>
                        {/* 将来的に他のナビゲーション要素を追加 */}
                    </ul>
                </nav>
            </aside>

            {/* 【★ 修正: メインコンテンツエリア ★】 */}
            <main style={{ 
                flexGrow: 1, 
                // 【★ 修正: スマホ表示では左右のパディングを統一する ★】
                padding: isMobile ? '0 20px' : '0 20px 0 0',
            }}>
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
            </main>

        </div> {/* メインレイアウトコンテナ終了 */}

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