// src/utils/storage.ts

import { type NazoRecord } from '../types/record';

const STORAGE_KEY = 'nazoRecords';

// 初期データの取得 (LocalStorageから)
export const getInitialRecords = (): NazoRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading records from LocalStorage:', error);
    return [];
  }
};

// データをLocalStorageに保存
export const saveRecords = (records: NazoRecord[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving records to LocalStorage:', error);
  }
};