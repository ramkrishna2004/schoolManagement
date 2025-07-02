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
    if (target === 'all') return <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-200 to-blue-400 text-blue-900 rounded-full px-2 py-0.5 font-semibold text-xs"><Public fontSize="inherit" /> All Users</span>;
    if (target === 'students') return <span className="inline-flex items-center gap-1 bg-gradient-to-r from-sky-200 to-sky-400 text-sky-900 rounded-full px-2 py-0.5 font-semibold text-xs"><School fontSize="inherit" /> Students</span>;
    if (target === 'teachers') return <span className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-200 to-indigo-400 text-indigo-900 rounded-full px-2 py-0.5 font-semibold text-xs"><Group fontSize="inherit" /> Teachers</span>;
    return <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 font-semibold text-xs">Specific</span>;
  };

  // Helper for status badge
  const statusBadge = (announcement) => {
    const now = new Date();
    const visibleFrom = announcement.visibleFrom ? new Date(announcement.visibleFrom) : null;
    const visibleTo = announcement.visibleTo ? new Date(announcement.visibleTo) : null;

    if (!announcement.isActive) {
      return <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-600 rounded-full px-2 py-0.5 text-xs font-medium"><Cancel fontSize="inherit" /> Inactive</span>;
    }

    if (visibleFrom && now < visibleFrom) {
      return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium">Scheduled</span>;
    }

    if (visibleTo && now > visibleTo) {
      return <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-600 rounded-full px-2 py-0.5 text-xs font-medium">Expired</span>;
    }

    return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 text-xs font-medium"><CheckCircle fontSize="inherit" /> Active</span>;
  };

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {announcements.map((a, idx) => (
          <motion.div
            key={a._id}
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.98 }}
            transition={{ duration: 0.5, delay: idx * 0.09, type: 'spring' }}
            className="relative flex flex-col sm:flex-row items-stretch bg-white/80 backdrop-blur-lg border border-blue-100 shadow-lg rounded-2xl p-6 gap-4 sm:gap-6 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
            style={{ minHeight: 120 }}
          >
            {/* Animated floating background shape */}
            <motion.div
              className="absolute -top-8 -left-8 w-32 h-32 z-0"
              animate={{ y: [0, 12, 0], scale: [1, 1.08, 1], rotate: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 10 + idx * 2, ease: 'easeInOut' }}
              style={{ filter: 'blur(18px)' }}
            >
              <svg width="100%" height="100%" viewBox="0 0 128 128" fill="none">
                <circle cx="64" cy="64" r="64" fill="url(#grad-ann-bg)" fillOpacity="0.18" />
                <defs>
                  <linearGradient id="grad-ann-bg" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#38bdf8" />
                    <stop offset="1" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            {/* Icon in glassy circle with bell ringing animation */}
            <motion.div
              className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100/80 to-indigo-100/80 shadow-md border border-blue-200 mr-0 sm:mr-6 mb-4 sm:mb-0 mx-auto sm:mx-0 z-10"
              whileHover={{ scale: 1.08, boxShadow: '0 0 0 8px #6366f122' }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -18, 18, -10, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: idx * 0.1 }}
                style={{ display: 'inline-block' }}
              >
                <NotificationsActiveRounded className="text-indigo-500" style={{ fontSize: 38 }} />
              </motion.span>
            </motion.div>
            {/* Content */}
            <div className="flex-1 flex flex-col justify-center min-w-0 z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <span className="font-extrabold text-xl text-indigo-800 truncate block">
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
              <div className="text-slate-800 whitespace-pre-line text-base sm:text-lg mb-3 font-medium leading-relaxed">
                {a.message}
              </div>
              <div className="flex flex-wrap gap-2 items-center mt-auto w-full">
                {targetBadge(a.target)}
                {statusBadge(a)}
                {a.visibleFrom && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs font-medium">
                    <span className="font-bold">From:</span> {new Date(a.visibleFrom).toLocaleDateString()}
                  </span>
                )}
                {a.visibleTo && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs font-medium">
                    <span className="font-bold">To:</span> {new Date(a.visibleTo).toLocaleDateString()}
                  </span>
                )}
                {a.createdBy && a.createdBy.name && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium">
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