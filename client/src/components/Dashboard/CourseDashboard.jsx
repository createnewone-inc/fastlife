import React, { useState, useEffect } from 'react';
import { getActiveCourse, updateUserCourse } from '../../services/api';
import { FaCalendarAlt, FaChartLine, FaClipboardCheck } from 'react-icons/fa';
import DailyLogForm from './DailyLogForm';
import DailyLogHistory from './DailyLogHistory';
import './CourseDashboard.css';

const CourseDashboard = () => {
  const [activeCourse, setActiveCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchActiveCourse();
  }, []);

  const fetchActiveCourse = async () => {
    try {
      setLoading(true);
      const response = await getActiveCourse();
      setActiveCourse(response.data);
      setError(null);
    } catch (err) {
      setError('アクティブなコースの取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSaved = () => {
    // ログが保存されたら選択状態をリセットして履歴を更新
    setSelectedLog(null);
    fetchActiveCourse();
  };

  const handleLogSelect = (log) => {
    setSelectedLog(log);
  };

  // 進捗状況の計算
  const calculateProgress = () => {
    if (!activeCourse) return 0;
    
    const startDate = new Date(activeCourse.start_date);
    const endDate = new Date(activeCourse.end_date);
    const today = new Date();
    
    // 開始前の場合
    if (today < startDate) return 0;
    // 終了後の場合
    if (today > endDate) return 100;
    
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    return Math.min(Math.round((daysElapsed / totalDays) * 100), 100);
  };

  // 期間の計算
  const calculatePeriod = (type) => {
    if (!activeCourse) return { start: null, end: null };
    
    const startDate = new Date(activeCourse.start_date);
    const course = activeCourse.Course;
    
    if (type === 'preparation') {
      const endPrep = new Date(startDate);
      endPrep.setDate(startDate.getDate() + course.preparation_days - 1);
      return { start: startDate, end: endPrep };
    } else if (type === 'fasting') {
      const startFast = new Date(startDate);
      startFast.setDate(startDate.getDate() + course.preparation_days);
      const endFast = new Date(startFast);
      endFast.setDate(startFast.getDate() + course.total_days - 1);
      return { start: startFast, end: endFast };
    } else if (type === 'recovery') {
      const startRec = new Date(startDate);
      startRec.setDate(startDate.getDate() + course.preparation_days + course.total_days);
      const endRec = new Date(startRec);
      endRec.setDate(startRec.getDate() + course.recovery_days - 1);
      return { start: startRec, end: endRec };
    }
    
    return { start: null, end: null };
  };

  // 日付のフォーマット
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  // 現在のフェーズを判定
  const getCurrentPhase = () => {
    if (!activeCourse) return null;
    
    const today = new Date();
    const prep = calculatePeriod('preparation');
    const fast = calculatePeriod('fasting');
    const rec = calculatePeriod('recovery');
    
    if (today >= prep.start && today <= prep.end) {
      return 'preparation';
    } else if (today >= fast.start && today <= fast.end) {
      return 'fasting';
    } else if (today >= rec.start && today <= rec.end) {
      return 'recovery';
    } else if (today < prep.start) {
      return 'before';
    } else {
      return 'after';
    }
  };

  if (loading) return <div className="loading-spinner">コース情報を読み込み中...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!activeCourse) return <div className="no-active-course">アクティブなコースがありません</div>;

  const progress = calculateProgress();
  const currentPhase = getCurrentPhase();
  const prepPeriod = calculatePeriod('preparation');
  const fastPeriod = calculatePeriod('fasting');
  const recPeriod = calculatePeriod('recovery');

  return (
    <div className="course-dashboard-container">
      <div className="course-header">
        <h2>{activeCourse.Course.name}</h2>
        <div className="course-status">
          <span className={`status-badge ${activeCourse.status.toLowerCase()}`}>
            {activeCourse.status === 'ACTIVE' ? '進行中' : 
             activeCourse.status === 'COMPLETED' ? '完了' : '中断'}
          </span>
        </div>
      </div>
      
      <div className="course-progress-container">
        <div className="progress-header">
          <h3>進捗状況</h3>
          <span className="progress-percentage">{progress}%</span>
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="progress-timeline">
          <div className="timeline-phase preparation">
            <div className="phase-label">準備期間</div>
            <div className="phase-dates">
              {formatDate(prepPeriod.start)} - {formatDate(prepPeriod.end)}
            </div>
            <div className={`phase-indicator ${currentPhase === 'preparation' ? 'active' : ''}`}></div>
          </div>
          
          <div className="timeline-phase fasting">
            <div className="phase-label">ファスティング</div>
            <div className="phase-dates">
              {formatDate(fastPeriod.start)} - {formatDate(fastPeriod.end)}
            </div>
            <div className={`phase-indicator ${currentPhase === 'fasting' ? 'active' : ''}`}></div>
          </div>
          
          <div className="timeline-phase recovery">
            <div className="phase-label">回復期間</div>
            <div className="phase-dates">
              {formatDate(recPeriod.start)} - {formatDate(recPeriod.end)}
            </div>
            <div className={`phase-indicator ${currentPhase === 'recovery' ? 'active' : ''}`}></div>
          </div>
        </div>
      </div>
      
      <div className="course-details-grid">
        <div className="course-detail-card">
          <div className="card-icon">
            <FaCalendarAlt />
          </div>
          <div className="card-content">
            <h4>開始日</h4>
            <div className="card-value">
              {new Date(activeCourse.start_date).toLocaleDateString('ja-JP')}
            </div>
          </div>
        </div>
        
        <div className="course-detail-card">
          <div className="card-icon">
            <FaCalendarAlt />
          </div>
          <div className="card-content">
            <h4>終了予定日</h4>
            <div className="card-value">
              {new Date(activeCourse.end_date).toLocaleDateString('ja-JP')}
            </div>
          </div>
        </div>
        
        <div className="course-detail-card">
          <div className="card-icon">
            <FaChartLine />
          </div>
          <div className="card-content">
            <h4>現在のフェーズ</h4>
            <div className="card-value">
              {currentPhase === 'preparation' ? '準備期間' :
               currentPhase === 'fasting' ? 'ファスティング' :
               currentPhase === 'recovery' ? '回復期間' :
               currentPhase === 'before' ? '開始前' : '完了'}
            </div>
          </div>
        </div>
        
        <div className="course-detail-card">
          <div className="card-icon">
            <FaClipboardCheck />
          </div>
          <div className="card-content">
            <h4>記録数</h4>
            <div className="card-value">
              {activeCourse.DailyLogs ? activeCourse.DailyLogs.length : 0} 日分
            </div>
          </div>
        </div>
      </div>
      
      <div className="daily-logs-section">
        <div className="daily-log-input">
          <DailyLogForm 
            userCourseId={activeCourse.id} 
            onLogSaved={handleLogSaved}
            existingLog={selectedLog}
          />
        </div>
        
        <div className="daily-log-history">
          <DailyLogHistory 
            userCourseId={activeCourse.id}
            onLogSelect={handleLogSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDashboard; 