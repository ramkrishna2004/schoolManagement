// Helper to inject adminId into Mongoose queries for multi-tenant (organization) data isolation
// Usage: adminScopedQuery(Model, req, query = {})

module.exports.adminScopedQuery = function(Model, req, query = {}) {
  // If the user is an admin, use their roleId (which is the Admin._id)
  // If the user is a teacher or student, use their adminId
  let adminId;
  if (req.user.role === 'admin') {
    adminId = req.user.roleId;
  } else if (req.user.adminId) {
    adminId = req.user.adminId;
  } else {
    throw new Error('User does not have an adminId for organization scoping');
  }
  return Model.find({ ...query, adminId });
};

// Helper for create: inject adminId into the data object
module.exports.attachAdminId = function(req, data = {}) {
  console.log('DEBUG attachAdminId: req.user =', req.user);
  let adminId;
  if (req.user.role === 'admin') {
    adminId = req.user.roleId;
  } else if (req.user.adminId) {
    adminId = req.user.adminId;
  } else {
    throw new Error('User does not have an adminId for organization scoping');
  }
  return { ...data, adminId };
}; 