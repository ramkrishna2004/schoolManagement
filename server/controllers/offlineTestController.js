const Test = require('../models/Test');
const Class = require('../models/Class');
const Score = require('../models/Score');
const StudentTestAttempt = require('../models/StudentTestAttempt');
const Student = require('../models/Student');

// Create Offline Test
exports.createOfflineTest = async (req, res) => {
  try {
    const {
      testTitle,
      subjectName,
      classId,
      type,
      totalMarks,
      passingMarks,
      duration,
      scheduledDate,
      startTime,
      endTime
    } = req.body;
    const teacherId = req.user.roleId;
    // Validate required fields
    if (!testTitle || !subjectName || !classId || !type || totalMarks == null || passingMarks == null || duration == null || !scheduledDate || !startTime || !endTime) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
    // Validate class and teacher/admin
    let classQuery = { _id: classId, adminId: req.user.adminId || req.user.roleId };
    if (req.user.role === 'teacher') {
      classQuery.teacherId = req.user.roleId;
    }
    const classObj = await Class.findOne(classQuery);
    if (!classObj) return res.status(403).json({ success: false, error: 'Not authorized for this class' });

    const test = await Test.create({
      title: testTitle,
      type,
      subject: subjectName,
      classId,
      teacherId,
      totalMarks,
      passingMarks,
      duration,
      scheduledDate,
      startTime,
      endTime,
      createdBy: req.user._id,
      testType: 'offline',
      adminId: classObj.adminId,
      isActive: true
    });
    res.status(201).json({ success: true, data: test });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Manual Score Entry
exports.manualScoreEntry = async (req, res) => {
  try {
    const { testId, scores } = req.body; // scores: [{ studentId, obtainedMarks, totalMarks }]
    console.log('DEBUG manualScoreEntry: req.user =', req.user);
    const test = await Test.findById(testId);
    if (!test || test.testType !== 'offline') return res.status(404).json({ success: false, error: 'Offline test not found' });

    // Validate class and teacher/admin
    let classQuery = { _id: test.classId };
    if (req.user.role === 'teacher') {
      classQuery.teacherId = req.user.roleId;
      classQuery.adminId = req.user.adminId || req.user.roleId;
    } else if (req.user.role === 'admin') {
      classQuery.adminId = req.user.roleId;
    }
    console.log('DEBUG manualScoreEntry: classQuery =', classQuery);
    const classObj = await Class.findOne(classQuery);
    console.log('DEBUG manualScoreEntry: classObj =', classObj);
    if (!classObj) {
      return res.status(403).json({ success: false, error: 'Not authorized for this class (class not found or not in your organization)' });
    }
    // Extra robust admin check
    if (req.user.role === 'admin' && String(classObj.adminId) !== String(req.user.roleId)) {
      return res.status(403).json({ success: false, error: 'Admin not authorized for this class (adminId mismatch)' });
    }
    if (req.user.role === 'teacher' && (String(classObj.adminId) !== String(req.user.adminId || req.user.roleId) || String(classObj.teacherId) !== String(req.user.roleId))) {
      return res.status(403).json({ success: false, error: 'Teacher not authorized for this class (adminId or teacherId mismatch)' });
    }

    // Validate students
    const validStudentIds = classObj.studentIds.map(id => id.toString());
    for (const entry of scores) {
      if (!validStudentIds.includes(entry.studentId)) {
        return res.status(400).json({ success: false, error: `Student ${entry.studentId} not in class` });
      }
    }

    // Save scores and attempts
    const results = [];
    for (const entry of scores) {
      // Prevent duplicate
      const existing = await Score.findOne({ studentId: entry.studentId, testId, isActive: true });
      if (existing) continue;

      const obtained = Number(entry.obtainedMarks);
      const total = Number(entry.totalMarks);
      const score = total > 0 ? Math.round((obtained / total) * 100) : 0;

      const scoreDoc = await Score.create({
        studentId: entry.studentId,
        testId,
        classId: test.classId,
        score,
        obtainedMarks: obtained,
        totalMarks: total,
        submissionDate: new Date(),
        isActive: true,
        adminId: classObj.adminId
      });

      await StudentTestAttempt.create({
        studentId: entry.studentId,
        testId,
        classId: test.classId,
        startTime: new Date(),
        endTime: new Date(),
        score,
        status: 'completed',
        isActive: true,
        adminId: classObj.adminId
      });

      results.push(scoreDoc);
    }
    res.status(201).json({ success: true, data: results });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update Manual Score Entry
exports.updateManualScoreEntry = async (req, res) => {
  try {
    const { testId, studentId, obtainedMarks, totalMarks } = req.body;
    if (!testId || !studentId || obtainedMarks == null || totalMarks == null) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
    const test = await Test.findById(testId);
    if (!test || test.testType !== 'offline') return res.status(404).json({ success: false, error: 'Offline test not found' });

    // Find and update Score
    const scoreDoc = await Score.findOne({ testId, studentId, isActive: true });
    if (!scoreDoc) return res.status(404).json({ success: false, error: 'Score record not found' });
    const score = Number(totalMarks) > 0 ? Math.round((Number(obtainedMarks) / Number(totalMarks)) * 100) : 0;
    scoreDoc.obtainedMarks = Number(obtainedMarks);
    scoreDoc.totalMarks = Number(totalMarks);
    scoreDoc.score = score;
    await scoreDoc.save();

    // Find and update StudentTestAttempt
    const attemptDoc = await StudentTestAttempt.findOne({ testId, studentId, isActive: true });
    if (!attemptDoc) return res.status(404).json({ success: false, error: 'Student test attempt not found' });
    attemptDoc.score = score;
    await attemptDoc.save();

    res.status(200).json({ success: true, data: { score: scoreDoc, attempt: attemptDoc } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}; 