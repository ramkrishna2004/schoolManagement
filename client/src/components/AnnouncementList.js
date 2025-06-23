import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  NotificationsActiveRounded, 
  Group, 
  School, 
  Public, 
  Edit, 
  Delete, 
  CheckCircle,
  Cancel
} from '@mui/icons-material';

function AnnouncementList({ announcements, onEdit, onDelete, isAdmin = false }) {
  if (!announcements || announcements.length === 0) {
    return (
      <div className="text-center py-12">
        <NotificationsActiveRounded className="text-gray-300 mx-auto mb-4" style={{ fontSize: 64 }} />
        <div className="text-gray-400 italic text-lg">No announcements at this time.</div>
        <div className="text-gray-300 text-sm mt-2">Check back later for updates</div>
      </div>
    );
  }

  // Helper for meta badges
  const targetBadge = (target) => {
    if (target === 'all') return <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-900 rounded-full px-2 py-0.5 font-semibold text-xs"><Public fontSize="inherit" /> All Users</span>;
    if (target === 'students') return <span className="inline-flex items-center gap-1 bg-gradient-to-r from-sky-200 to-sky-400 text-sky-900 rounded-full px-2 py-0.5 font-semibold text-xs"><School fontSize="inherit" /> Students</span>;
    if (target === 'teachers') return <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-200 to-blue-400 text-blue-900 rounded-full px-2 py-0.5 font-semibold text-xs"><Group fontSize="inherit" /> Teachers</span>;
    return <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 font-semibold text-xs">Specific</span>;
  };

  // Helper for status badge
  const statusBadge = (announcement) => {
    const now = new Date();
    const visibleFrom = announcement.visibleFrom ? new Date(announcement.visibleFrom) : null;
    const visibleTo = announcement.visibleTo ? new Date(announcement.visibleTo) : null;

    if (!announcement.isActive) {
      return <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 rounded-full px-2 py-0.5 text-xs font-medium"><Cancel fontSize="inherit" /> Inactive</span>;
    }

    if (visibleFrom && now < visibleFrom) {
      return <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 rounded-full px-2 py-0.5 text-xs font-medium">Scheduled</span>;
    }

    if (visibleTo && now > visibleTo) {
      return <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 rounded-full px-2 py-0.5 text-xs font-medium">Expired</span>;
    }

    return <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs font-medium"><CheckCircle fontSize="inherit" /> Active</span>;
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {announcements.map((a, idx) => (
          <motion.div
            key={a._id}
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.98 }}
            transition={{ duration: 0.5, delay: idx * 0.09, type: 'spring' }}
            className="relative flex items-start bg-white/70 backdrop-blur-md border-0 shadow-2xl rounded-2xl p-5 pr-8 overflow-hidden hover:shadow-yellow-200 transition-all duration-300 group"
            style={{ borderLeft: '8px solid', borderImage: 'linear-gradient(180deg, #facc15 0%, #fbbf24 100%) 1' }}
          >
            {/* Animated bell */}
            <motion.span
              className="absolute left-3 top-3"
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -18, 18, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: idx * 0.1 }}
            >
              <NotificationsActiveRounded className="text-yellow-400 drop-shadow-lg" fontSize="large" />
            </motion.span>
            
            <div className="pl-14 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-extrabold text-lg sm:text-xl text-yellow-800 truncate block drop-shadow-sm">
                  {a.title}
                </span>
                
                {/* Admin Actions */}
                {isAdmin && (
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => onEdit(a)}
                      className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
                      title="Edit announcement"
                    >
                      <Edit fontSize="small" />
                    </button>
                    <button
                      onClick={() => onDelete(a._id)}
                      className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
                      title="Delete announcement"
                    >
                      <Delete fontSize="small" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="text-gray-800 whitespace-pre-line text-base sm:text-lg mb-3 font-medium leading-relaxed">
                {a.message}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {targetBadge(a.target)}
                {statusBadge(a)}
                {a.visibleFrom && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs font-medium">
                    <span className="font-bold">From:</span> {new Date(a.visibleFrom).toLocaleDateString()}
                  </span>
                )}
                {a.visibleTo && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs font-medium">
                    <span className="font-bold">To:</span> {new Date(a.visibleTo).toLocaleDateString()}
                  </span>
                )}
                {a.createdBy && a.createdBy.name && (
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full px-2 py-0.5 text-xs font-medium">
                    By: {a.createdBy.name}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default AnnouncementList; 