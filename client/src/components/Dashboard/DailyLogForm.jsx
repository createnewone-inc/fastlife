import React, { useState, useEffect } from 'react';
import { addDailyLog } from '../../services/api';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import ja from 'date-fns/locale/ja';
import { FaCalendarAlt, FaWeight, FaSave, FaTimes } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import './DailyLogForm.css';

// 日本語ロケールの登録
registerLocale('ja', ja);

const DailyLogForm = ({ userCourseId, onLogSaved, existingLog = null }) => {
  const [logDate, setLogDate] = useState(existingLog?.log_date ? new Date(existingLog.log_date) : new Date());
  const [weight, setWeight] = useState(existingLog?.weight || '');
  const [memo, setMemo] = useState(existingLog?.memo || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 既存のログデータがある場合、フォームに設定
    if (existingLog) {
      setLogDate(new Date(existingLog.log_date));
      setWeight(existingLog.weight || '');
      setMemo(existingLog.memo || '');
    }
  }, [existingLog]);

  const handleWeightChange = (e) => {
    // 数値と小数点のみ許可
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setWeight(value);
    }
  };

  const handleMemoChange = (e) => {
    setMemo(e.target.value);
  };

  const resetForm = () => {
    setLogDate(new Date());
    setWeight('');
    setMemo('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userCourseId) {
      setError('ユーザーコースIDが未設定です');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const logData = {
        log_date: logDate.toISOString(),
        weight: weight === '' ? null : parseFloat(weight),
        memo
      };

      await addDailyLog(userCourseId, logData);
      
      if (onLogSaved) {
        onLogSaved();
      }
      
      // 新規ログの場合はフォームをリセット
      if (!existingLog) {
        resetForm();
      }
      
    } catch (err) {
      setError('ログの保存に失敗しました');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="daily-log-form-container">
      <h3 className="form-title">
        {existingLog ? 'ログを編集' : '今日の記録を追加'}
      </h3>
      
      <form className="daily-log-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="logDate">
            <FaCalendarAlt /> 日付
          </label>
          <div className="date-picker-container">
            <DatePicker
              id="logDate"
              selected={logDate}
              onChange={date => setLogDate(date)}
              locale="ja"
              dateFormat="yyyy年MM月dd日"
              className="date-input"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="weight">
            <FaWeight /> 体重 (kg)
          </label>
          <input
            id="weight"
            type="text"
            value={weight}
            onChange={handleWeightChange}
            placeholder="例: 65.5"
            className="weight-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="memo">メモ</label>
          <textarea
            id="memo"
            value={memo}
            onChange={handleMemoChange}
            placeholder="今日の体調や気づきを記録しましょう"
            className="memo-input"
            rows={4}
          />
        </div>
        
        {error && <div className="form-error">{error}</div>}
        
        <div className="form-actions">
          {!existingLog && (
            <button
              type="button"
              className="reset-button"
              onClick={resetForm}
            >
              <FaTimes /> リセット
            </button>
          )}
          
          <button
            type="submit"
            className="save-button"
            disabled={saving}
          >
            <FaSave /> {saving ? '保存中...' : '保存する'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyLogForm; 