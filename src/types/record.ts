// src/types/record.ts

export type NazoRecord = {
  id: string; // 記録の一意識別子
  // 【★ 追加: 関連する公演のID (App.tsxで設定されたもの) ★】
  eventId?: string; // 公演ID。記録が公演に紐づかない場合もあるため optional にしておきます
  title: string; 
  date: string; 
  result: '成功' | '失敗'; 
  score: number; 
  memo: string; 
};

// ... (getInitialRecords, saveRecords の import やその他のコードはそのまま)