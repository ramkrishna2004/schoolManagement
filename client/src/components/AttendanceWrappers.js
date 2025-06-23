import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentAttendance from './StudentAttendance';
import TeacherMarkAttendance from './TeacherMarkAttendance';

export function StudentAttendanceWrapper() {
  const { user } = useAuth();
  console.log('DEBUG StudentAttendanceWrapper user:', user);
  if (!user) return null;
  return <StudentAttendance studentId={user.roleDetails?._id} />;
}

export function TeacherMarkAttendanceWrapper() {
  const { user } = useAuth();
  if (!user) return null;
  return <TeacherMarkAttendance teacherId={user._id} />;
} 