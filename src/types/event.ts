// src/types/event.ts

// 公演（イベント）データの型定義
export type NazoEvent = {
  eventId: string;     // 公演の一意識別子
  name: string;        // イベント名/公演名
  organizer: string;   // 開催団体名
  venue: string;       // 開催場所/会場
  duration: string;    // 開催期間や所要時間
  difficulty: number;  // 難易度（1〜5）
  isFinished: boolean; // 終了した公演かどうかのフラグ
};

// src/types/event.ts (続けて記述)

export const initialEvents: NazoEvent[] = [
  {
    eventId: 'E001',
    name: '時の迷宮からの脱出',
    organizer: 'SCRAP',
    venue: '東京ドームシティ',
    duration: '60分',
    difficulty: 4,
    isFinished: false, // 開催中
  },
  {
    eventId: 'E002',
    name: '星空の下の暗号解読',
    organizer: 'よだかのレコード',
    venue: 'オンライン',
    duration: '制限なし',
    difficulty: 3,
    isFinished: false,
  },
  {
    eventId: 'E003',
    name: '地下アイドルの秘密',
    organizer: 'タンブルウィード',
    venue: '下北沢',
    duration: '120分',
    difficulty: 5,
    isFinished: true, // 終了済み
  },
];