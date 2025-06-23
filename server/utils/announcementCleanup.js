const Announcement = require('../models/Announcement');

// Function to clean up expired announcements
const cleanupExpiredAnnouncements = async () => {
  try {
    const now = new Date();
    const result = await Announcement.deleteMany({
      visibleTo: { $lt: now }
    });
    
    if (result.deletedCount > 0) {
      console.log(`Cleaned up ${result.deletedCount} expired announcements`);
    }
  } catch (error) {
    console.error('Error cleaning up expired announcements:', error);
  }
};

// Run cleanup every hour
const startCleanupScheduler = () => {
  // Run immediately on startup
  cleanupExpiredAnnouncements();
  
  // Then run every hour
  setInterval(cleanupExpiredAnnouncements, 60 * 60 * 1000);
};

module.exports = {
  cleanupExpiredAnnouncements,
  startCleanupScheduler
}; 