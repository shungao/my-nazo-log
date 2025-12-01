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

  // 【★ 追加する項目 ★】
  puzzle: number; // パズル度 (1-5)
  experience: number; // 体験度 (1-5)
  quantity: number; // 物量 (1-5)
  mystery: number; // 推理度 (1-5)
  cheerfulness: number; // わいわい度 (1-5)
};

// ... (getInitialRecords, saveRecords の import やその他のコードはそのまま)