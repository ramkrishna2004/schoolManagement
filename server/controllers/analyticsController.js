const Score = require('../models/Score');
const Class = require('../models/Class');
const Test = require('../models/Test');
const Student = require('../models/Student');
const mongoose = require('mongoose');
const User = require('../models/User');

// Helper to get adminId match object
function getAdminIdMatch(req) {
  if (req.user.role === 'admin') {
    return { adminId: req.user.roleId };
  } else if (req.user.adminId) {
    return { adminId: req.user.adminId };
  }
  return {};
}

// Helper to get academic year date range
function getAcademicYearRange(startDate, endDate) {
    if (startDate && endDate) {
        return { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    // Default: current academic year (June 1 to May 31 next year)
    const now = new Date();
    const year = now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1;
    const start = new Date(`${year}-06-01T00:00:00.000Z`);
    const end = new Date(`${year + 1}-05-31T23:59:59.999Z`);
    return { $gte: start, $lte: end };
}

// @desc    Get test analytics for the logged-in student
// @route   GET /api/analytics/student
// @access  Private/Student
exports.getStudentAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        console.log('Backend received startDate:', startDate, 'endDate:', endDate); // Debug: check backend params
        const studentId = req.user.roleId;
        const adminMatch = getAdminIdMatch(req);
        const dateRange = getAcademicYearRange(startDate, endDate);
        const scores = await Score.find({ studentId, ...adminMatch, submissionDate: dateRange })
            .populate('testId', 'title')
            .sort({ submissionDate: 1 });

        const labels = scores.map(s => new Date(s.submissionDate).toLocaleDateString());
        const data = scores.map(s => s.score);

        res.json({
            success: true,
            data: {
                labels,
                datasets: [{
                    label: 'Score Trend',
                    data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                }]
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get test analytics for a specific class
// @route   GET /api/analytics/class/:classId
// @access  Private/Teacher
exports.getClassAnalytics = async (req, res) => {
    try {
        const { classId } = req.params;
        const { startDate, endDate } = req.query;
        console.log('Backend received startDate:', startDate, 'endDate:', endDate); // Debug: check backend params
        const adminMatch = getAdminIdMatch(req);
        const dateRange = getAcademicYearRange(startDate, endDate);

        if (!mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({ success: false, error: 'Invalid Class ID' });
        }

        let classQuery = { _id: classId, ...adminMatch };
        if (req.user.role === 'teacher') {
            classQuery.teacherId = req.user.roleId;
        }
        const classDoc = await Class.findOne(classQuery);
        if (!classDoc) {
            return res.status(403).json({ success: false, error: 'You are not authorized to view analytics for this class' });
        }

        const classScores = await Score.find({ classId, ...adminMatch, submissionDate: dateRange }).populate('studentId', 'name');

        const classAverage = await Score.aggregate([
            { $match: { classId: new mongoose.Types.ObjectId(classId), ...adminMatch, submissionDate: dateRange } },
            { $group: { _id: '$classId', averageScore: { $avg: '$score' } } }
        ]);

        const studentAverages = await Score.aggregate([
            { $match: { classId: new mongoose.Types.ObjectId(classId), ...adminMatch, submissionDate: dateRange } },
            { $group: { _id: '$studentId', averageScore: { $avg: '$score' } } }
        ]);
        
        const studentIds = studentAverages.map(s => s._id);
        const students = await Student.find({_id: {$in: studentIds}}).select('name');

        const studentData = studentAverages.map(avg => {
            const student = students.find(s => s._id.equals(avg._id));
            return {
                studentId: avg._id,
                studentName: student ? student.name : 'Unknown',
                averageScore: avg.averageScore
            }
        });

        res.json({
            success: true,
            data: {
                classAverage: classAverage.length > 0 ? classAverage[0].averageScore : 0,
                studentAverages: studentData,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get analytics for all classes
// @route   GET /api/analytics/all
// @access  Private/Admin
exports.getAllAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        console.log('Backend received startDate:', startDate, 'endDate:', endDate); // Debug: check backend params
        const adminMatch = getAdminIdMatch(req);
        const dateRange = getAcademicYearRange(startDate, endDate);
        const classAverages = await Score.aggregate([
            { $match: { ...adminMatch, submissionDate: dateRange } },
            { $group: { _id: '$classId', averageScore: { $avg: '$score' } } },
            { $lookup: { from: 'classes', localField: '_id', foreignField: '_id', as: 'classDetails' } },
            { $unwind: '$classDetails' },
            { $project: { className: '$classDetails.className', averageScore: 1 } }
        ]);

        // Get all scores with student, class, and user info
        const scores = await Score.find({ ...adminMatch, submissionDate: dateRange })
            .populate({ path: 'studentId', select: 'name email' })
            .populate({ path: 'classId', select: 'className' });
        // Get all users for rollno
        const studentRoleIds = scores.map(s => s.studentId?._id).filter(Boolean);
        const users = await User.find({ role: 'student', roleId: { $in: studentRoleIds } }).select('rollno roleId');
        const rollnoMap = {};
        users.forEach(u => { rollnoMap[u.roleId.toString()] = u.rollno; });

        // Helper to get grade from score
        function getGrade(score) {
            if (score >= 90) return 'A Grade';
            if (score >= 80) return 'B Grade';
            if (score >= 70) return 'C Grade';
            if (score >= 60) return 'D Grade';
            return 'F Grade';
        }

        // Build grade -> students map
        const gradeMap = {};
        scores.forEach(s => {
            const grade = getGrade(s.score);
            if (!gradeMap[grade]) gradeMap[grade] = [];
            gradeMap[grade].push({
                name: s.studentId?.name || 'Unknown',
                rollno: rollnoMap[s.studentId?._id?.toString()] || '',
                class: s.classId?.className || 'Unknown',
            });
        });

        // Build scoreDistribution with students
        const grades = ['A Grade', 'B Grade', 'C Grade', 'D Grade', 'F Grade'];
        const scoreDistribution = grades.map(grade => ({
            _id: grade,
            count: gradeMap[grade]?.length || 0,
            students: gradeMap[grade] || []
        }));

        res.json({
            success: true,
            data: {
                classAverages,
                scoreDistribution,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get test analytics for a specific student (for admins/teachers)
// @route   GET /api/analytics/student/:studentId
// @access  Private/Admin,Teacher
exports.getStudentAnalyticsById = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { startDate, endDate } = req.query;
        console.log('Backend received startDate:', startDate, 'endDate:', endDate); // Debug: check backend params
        const adminMatch = getAdminIdMatch(req);
        const dateRange = getAcademicYearRange(startDate, endDate);
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ success: false, error: 'Invalid Student ID' });
        }

        // If teacher, verify student is in one of their classes
        if (req.user.role === 'teacher') {
            const teacherClasses = await Class.find({ teacherId: req.user.roleId, studentIds: studentId, ...adminMatch });

            if (teacherClasses.length === 0) {
                return res.status(403).json({ success: false, error: 'You are not authorized to view this student\'s analytics.' });
            }
        }
        
        const scores = await Score.find({ studentId, ...adminMatch, submissionDate: dateRange })
            .populate('testId', 'title')
            .sort({ submissionDate: 1 });

        const labels = scores.map(s => new Date(s.submissionDate).toLocaleDateString());
        const data = scores.map(s => s.score);

        res.json({
            success: true,
            data: {
                labels,
                datasets: [{
                    label: 'Score Trend',
                    data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                }]
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}; 