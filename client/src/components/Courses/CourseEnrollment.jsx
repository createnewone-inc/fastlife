import React, { useState, useEffect } from 'react';
import { enrollCourse } from '../../services/api';
import CourseList from './CourseList';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import ja from 'date-fns/locale/ja';
import { FaCalendarAlt, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import './CourseEnrollment.css';

// 日本語ロケールの登録
registerLocale('ja', ja);

const CourseEnrollment = ({ onEnrollmentComplete }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setError(null);
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    setError(null);
  };

  const handleTermsChange = () => {
    setAgreeTerms(!agreeTerms);
    setError(null);
  };

  const calculateEndDate = () => {
    if (!selectedCourse) return null;
    
    const endDate = new Date(startDate);
    const totalDays = selectedCourse.total_days + 
                      selectedCourse.preparation_days + 
                      selectedCourse.recovery_days;
    
    endDate.setDate(endDate.getDate() + totalDays);
    return endDate;
  };

  const handleEnroll = async () => {
    if (!selectedCourse) {
      setError('コースを選択してください');
      return;
    }

    if (!agreeTerms) {
      setError('注意事項に同意してください');
      return;
    }

    try {
      setEnrolling(true);
      setError(null);

      await enrollCourse({
        course_id: selectedCourse.id,
        start_date: startDate.toISOString()
      });

      setSuccess(true);
      
      // 親コンポーネントに登録完了を通知
      if (onEnrollmentComplete) {
        onEnrollmentComplete();
      }
    } catch (err) {
      setError('コースの登録に失敗しました。時間をおいて再度お試しください。');
      console.error(err);
    } finally {
      setEnrolling(false);
    }
  };

  if (success) {
    return (
      <div className="enrollment-success">
        <div className="success-icon">
          <FaCheck />
        </div>
        <h2>コース登録完了</h2>
        <p>
          <strong>{selectedCourse.name}</strong> の登録が完了しました。
          開始日: {startDate.toLocaleDateString('ja-JP')}
        </p>
        <button 
          className="success-button"
          onClick={() => window.location.href = '/dashboard'}
        >
          ダッシュボードへ
        </button>
      </div>
    );
  }

  return (
    <div className="course-enrollment-container">
      <h2 className="enrollment-title">ファスティングコースに登録</h2>
      <p className="enrollment-subtitle">
        あなたの目標に合ったコースを選択し、ファスティングの旅を始めましょう
      </p>

      <div className="enrollment-steps">
        <div className="enrollment-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>コースを選択</h3>
            <CourseList onCourseSelect={handleCourseSelect} />
          </div>
        </div>

        {selectedCourse && (
          <div className="enrollment-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>開始日を選択</h3>
              <div className="date-selection">
                <div className="datepicker-container">
                  <div className="date-icon">
                    <FaCalendarAlt />
                  </div>
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    locale="ja"
                    dateFormat="yyyy年MM月dd日"
                    className="datepicker-input"
                  />
                </div>
                
                {selectedCourse && (
                  <div className="date-summary">
                    <div className="date-item">
                      <span className="date-label">準備期間:</span>
                      <span className="date-value">{selectedCourse.preparation_days}日</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">ファスティング期間:</span>
                      <span className="date-value">{selectedCourse.total_days}日</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">回復期間:</span>
                      <span className="date-value">{selectedCourse.recovery_days}日</span>
                    </div>
                    <div className="date-item total">
                      <span className="date-label">終了予定日:</span>
                      <span className="date-value">
                        {calculateEndDate()?.toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedCourse && (
          <div className="enrollment-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>確認と同意</h3>
              
              <div className="terms-container">
                <div className="terms-warning">
                  <FaExclamationTriangle />
                  <p>ファスティングを始める前に</p>
                </div>
                
                <div className="terms-content">
                  <ul>
                    <li>健康状態に不安がある場合は、必ず医師に相談してください。</li>
                    <li>妊娠中、授乳中、または重大な疾患をお持ちの方はファスティングを避けてください。</li>
                    <li>ファスティング中は十分な水分摂取を心がけてください。</li>
                    <li>体調が悪くなった場合は、すぐにファスティングを中止してください。</li>
                    <li>このアプリケーションは医療アドバイスを提供するものではありません。</li>
                  </ul>
                </div>
                
                <label className="terms-agreement">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={handleTermsChange}
                  />
                  上記の注意事項を読み、理解し、同意します。
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && <div className="enrollment-error">{error}</div>}

      {selectedCourse && (
        <div className="enrollment-actions">
          <button
            className="enroll-button"
            onClick={handleEnroll}
            disabled={!selectedCourse || !agreeTerms || enrolling}
          >
            {enrolling ? 'コースを登録中...' : 'コースを開始する'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseEnrollment; 