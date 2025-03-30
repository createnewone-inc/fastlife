// src/context/CourseContext.tsx

import React, { createContext, useState, ReactNode, useContext } from 'react';

export interface Course {
  id: string;
  name: string;
  duration: number; // コースの日数
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  startDate?: string; // コース開始日 (YYYY-MM-DD)
}

interface CourseContextProps {
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
}

// ★ createContext の型を "CourseContextProps | undefined" とし、初期値は undefined
export const CourseContext = createContext<CourseContextProps | undefined>(undefined);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <CourseContext.Provider value={{ selectedCourse, setSelectedCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

// カスタムフック: context が undefined の場合にエラーを投げる
export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
