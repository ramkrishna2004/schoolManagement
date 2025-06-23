const Score = require('../models/Score');
const Class = require('../models/Class');
const Test = require('../models/Test');
const Student = require('../models/Student');
const mongoose = require('mongoose');

// Helper to get adminId match object
function getAdminIdMatch(req) {
  if (req.user.role === 'admin') {
    return { adminId: req.user.roleId };
  } else if (req.user.adminId) {
    return { adminId: req.user.adminId };
  }
  return {};
}

// @desc    Get test analytics for the logged-in student
// @route   GET /api/analytics/student
// @access  Private/Student
exports.getStudentAnalytics = async (req, res) => {
    try {
        const studentId = req.user.roleId;
        const adminMatch = getAdminIdMatch(req);
        const scores = await Score.find({ studentId, ...adminMatch })
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
        const adminMatch = getAdminIdMatch(req);

        if (!mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({ success: false, error: 'Invalid Class ID' });
        }

        // Verify teacher is assigned to this class
        const teacherClass = await Class.findOne({ _id: classId, teacherId: req.user.roleId, ...adminMatch });
        if (!teacherClass) {
            return res.status(403).json({ success: false, error: 'You are not authorized to view analytics for this class' });
        }

        const classScores = await Score.find({ classId, ...adminMatch }).populate('studentId', 'name');

        const classAverage = await Score.aggregate([
            { $match: { classId: new mongoose.Types.ObjectId(classId), ...adminMatch } },
            { $group: { _id: '$classId', averageScore: { $avg: '$score' } } }
        ]);

        const studentAverages = await Score.aggregate([
            { $match: { classId: new mongoose.Types.ObjectId(classId), ...adminMatch } },
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
        const adminMatch = getAdminIdMatch(req);
        const classAverages = await Score.aggregate([
            { $match: { ...adminMatch } },
            { $group: { _id: '$classId', averageScore: { $avg: '$score' } } },
            { $lookup: { from: 'classes', localField: '_id', foreignField: '_id', as: 'classDetails' } },
            { $unwind: '$classDetails' },
            { $project: { className: '$classDetails.className', averageScore: 1 } }
        ]);

        const scoreDistribution = await Score.aggregate([
            { $match: { ...adminMatch } },
            { $group: { _id: { $switch: {
                branches: [
                    { case: { $gte: ['$score', 90] }, then: 'A Grade' },
                    { case: { $gte: ['$score', 80] }, then: 'B Grade' },
                    { case: { $gte: ['$score', 70] }, then: 'C Grade' },
                    { case: { $gte: ['$score', 60] }, then: 'D Grade' },
                ],
                default: 'F Grade'
            }}, count: { $sum: 1 } } }
        ]);

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
        const adminMatch = getAdminIdMatch(req);

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
        
        const scores = await Score.find({ studentId, ...adminMatch })
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