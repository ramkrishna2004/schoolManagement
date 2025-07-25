const Material = require('../models/Material');
const MaterialAccess = require('../models/MaterialAccess');
const Class = require('../models/Class');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { adminScopedQuery, attachAdminId } = require('../utils/adminQueryHelper');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/materials';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/avi',
      'video/mov'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
}).single('file');

// Helper to convert file path to public URL
const makePublicUrl = (filePath) => {
  if (!filePath) return '';
  // If it's already an external URL, return as is
  if (/^https?:\/\//i.test(filePath)) return filePath;
  // Otherwise, treat as local file
  const relativePath = filePath.replace(/\\/g, '/').replace(/^uploads\//, '');
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/materials/${relativePath.replace(/^materials\//, '')}`;
};

// @desc    Get all materials (with role-based filtering)
// @route   GET /api/materials
// @access  Private
exports.getMaterials = async (req, res) => {
  try {
    let query = {};
    let populateOptions = [
      { path: 'classId', select: 'className subjectName' },
      { path: 'uploadedBy', select: 'name email' }
    ];

    // Role-based filtering
    if (req.user.role === 'teacher') {
      const teacherClasses = await Class.find({ teacherId: req.user.roleId }).select('_id');
      const classIds = teacherClasses.map(cls => cls._id);
      query.classId = { $in: classIds };
    } else if (req.user.role === 'student') {
      const studentClasses = await Class.find({ studentIds: req.user.roleId }).select('_id');
      const classIds = studentClasses.map(cls => cls._id);
      query.classId = { $in: classIds };
      query.isVisible = true;
    }
    // Admin can see all materials (no additional filtering)

    const { page = 1, limit = 10, category, search, classId } = req.query;
    if (category) query.category = category;
    if (classId) query.classId = classId;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    let materialsQuery;
    let totalQuery;

    if (req.user.role === 'student') {
        materialsQuery = Material.find(query);
        totalQuery = Material.countDocuments(query);
    } else {
        materialsQuery = adminScopedQuery(Material, req, query);
        totalQuery = adminScopedQuery(Material, req, query).countDocuments();
    }
    
    const materials = await materialsQuery
      .populate(populateOptions)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip)
      .exec();

    const total = await totalQuery;

    // For admin/teacher, add view/download counts
    let materialsWithCounts = materials;
    if (req.user.role === 'admin' || req.user.role === 'teacher') {
      const MaterialAccess = require('../models/MaterialAccess');
      materialsWithCounts = await Promise.all(materials.map(async (mat) => {
        const obj = mat.toObject();
        obj.fileUrl = makePublicUrl(obj.fileUrl);
        obj.totalViews = await MaterialAccess.countDocuments({ materialId: mat._id, accessType: 'view' });
        obj.totalDownloads = await MaterialAccess.countDocuments({ materialId: mat._id, accessType: 'download' });
        return obj;
      }));
    } else {
      materialsWithCounts = materials.map(mat => {
        const obj = mat.toObject();
        obj.fileUrl = makePublicUrl(obj.fileUrl);
        return obj;
      });
    }

    res.json({
      success: true,
      data: materialsWithCounts,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single material
// @route   GET /api/materials/:id
// @access  Private
exports.getMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('classId', 'className subjectName')
      .populate('uploadedBy', 'name email');

    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'teacher') {
      const teacherClass = await Class.findOne({ 
        _id: material.classId._id, 
        teacherId: req.user.roleId 
      });
      if (!teacherClass) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    } else if (req.user.role === 'student') {
      const studentClass = await Class.findOne({ 
        _id: material.classId._id, 
        studentIds: req.user.roleId 
      });
      if (!studentClass || !material.isVisible) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
      // Track view in MaterialAccess
      await MaterialAccess.create({
        materialId: material._id,
        studentId: req.user.roleId,
        classId: material.classId._id,
        adminId: material.adminId,
        accessType: 'view',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    }

    // Map fileUrl to public URL
    const obj = material.toObject();
    obj.fileUrl = makePublicUrl(obj.fileUrl);

    res.json({
      success: true,
      data: obj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new material
// @route   POST /api/materials
// @access  Private (Admin, Teacher)
exports.createMaterial = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({
          success: false,
          error: err.message
        });
      }
      // Attach adminId to the material data
      const materialData = attachAdminId(req, {
        ...req.body,
        fileUrl: req.file ? req.file.path : req.body.fileUrl,
        fileName: req.file ? req.file.originalname : undefined,
        fileSize: req.file ? req.file.size : undefined,
        fileType: req.file ? req.file.mimetype : undefined,
        uploadedBy: req.user.roleId || req.user._id,
        uploadedByModel: req.user.role === 'admin' ? 'Admin' : 'Teacher'
      });
      // Ensure tags is always an array
      if (materialData.tags && typeof materialData.tags === 'string') {
        materialData.tags = materialData.tags.split(',').map(t => t.trim());
      }
      const material = await Material.create(materialData);
      res.status(201).json({
        success: true,
        data: material
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update material
// @route   PUT /api/materials/:id
// @access  Private (Admin, Teacher - owner only)
exports.updateMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }

    // Check permissions
    if (req.user.role === 'teacher') {
      if (material.uploadedBy.toString() !== req.user.roleId.toString()) {
        return res.status(403).json({
          success: false,
          error: 'You can only update materials you uploaded'
        });
      }
    }

    const { title, description, subjectName, category, topic, tags, isVisible } = req.body;

    const updatedMaterial = await Material.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        subjectName,
        category,
        topic,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : material.tags,
        isVisible: isVisible === 'true'
      },
      { new: true, runValidators: true }
    ).populate('classId', 'className subjectName')
     .populate('uploadedBy', 'name email');

    res.json({
      success: true,
      data: updatedMaterial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private (Admin, Teacher - owner only)
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }

    // Check permissions
    if (req.user.role === 'teacher') {
      if (material.uploadedBy.toString() !== req.user.roleId.toString()) {
        return res.status(403).json({
          success: false,
          error: 'You can only delete materials you uploaded'
        });
      }
    }

    // Delete material access records
    await MaterialAccess.deleteMany({ materialId: req.params.id });

    await material.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Download material
// @route   GET /api/materials/:id/download
// @access  Private
exports.downloadMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }
    // Just return the fileUrl for external links
    res.json({
      success: true,
      fileUrl: material.fileUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get material analytics
// @route   GET /api/materials/:id/analytics
// @access  Private (Admin, Teacher - owner only)
exports.getMaterialAnalytics = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }

    // Check permissions
    if (req.user.role === 'teacher') {
      if (material.uploadedBy.toString() !== req.user.roleId.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    }

    const accessData = await MaterialAccess.find({ materialId: req.params.id })
      .populate('studentId', 'name email')
      .sort({ accessedAt: -1 });

    const totalViews = accessData.filter(access => access.accessType === 'view').length;
    const totalDownloads = accessData.filter(access => access.accessType === 'download').length;

    res.json({
      success: true,
      data: {
        material,
        analytics: {
          totalViews,
          totalDownloads,
          accessHistory: accessData
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Log material access (view/download) for analytics
// @route   POST /api/materials/:id/access
// @access  Private (Student only tracked)
exports.logMaterialAccess = async (req, res) => {
  try {
    const { accessType } = req.body;
    if (!['view', 'download'].includes(accessType)) {
      return res.status(400).json({ success: false, error: 'Invalid access type' });
    }
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, error: 'Material not found' });
    }
    // Only students are tracked
    if (req.user.role !== 'student') {
      return res.status(200).json({ success: true, message: 'Not tracked for this role' });
    }
    // Find the classId for this student and material
    const classId = material.classId;
    await MaterialAccess.create({
      materialId: material._id,
      studentId: req.user.roleId,
      classId,
      adminId: material.adminId,
      accessType,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}; 