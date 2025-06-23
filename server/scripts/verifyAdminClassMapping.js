const mongoose = require('mongoose');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Class = require('../models/Class');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sms';

async function verifyAdminClassMapping() {
  await mongoose.connect(MONGO_URI);

  const adminUsers = await User.find({ role: 'admin' });
  const admins = await Admin.find();
  const classes = await Class.find();

  console.log('--- Admin Users ---');
  adminUsers.forEach(user => {
    const admin = admins.find(a => String(a._id) === String(user.roleId));
    console.log(`User _id: ${user._id}, email: ${user.email}, roleId: ${user.roleId}, Admin: ${admin ? admin.email : 'NOT FOUND'}`);
  });

  console.log('\n--- Classes ---');
  classes.forEach(cls => {
    const adminUser = adminUsers.find(u => String(u.roleId) === String(cls.adminId));
    console.log(`Class _id: ${cls._id}, className: ${cls.className}, adminId: ${cls.adminId}, Admin User: ${adminUser ? adminUser.email : 'NOT FOUND'}`);
  });

  await mongoose.disconnect();
}

verifyAdminClassMapping().then(() => {
  console.log('\nDone.');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 