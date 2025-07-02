import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const timeline = [
  {
    type: 'Education',
    items: [
      { title: 'B.Tech in Computer Science Engineering', org: 'DVR & Dr. HS MIC College of Technology, JNTUK', period: '2021 - 2025', details: 'CGPA: 7.65' },
      { title: 'Intermediate', org: 'Narayana Junior College, Gollapudi', period: '2019 - 2021', details: 'Percentage: 93.6%' },
      { title: 'SSC', org: 'Narayana Best Foundation School, Madhira', period: '2019', details: 'GPA: 9.5' },
    ],
  },
  {
    type: 'Experience',
    items: [
      { title: 'Web Developer', org: 'Science and Technology Research Foundation (STRF)', period: 'June 2023 – August 2023', details: 'Designed and launched a dynamic portfolio website, increasing user engagement by 50%.' },
      { title: 'Data Security Intern', org: 'CryptoPIX Pvt.Ltd', period: 'Feb 2025 – April 2025', details: 'Worked on image encryption models, security audits, and color QR code research.' },
      { title: 'Cyber Security Trainee', org: 'ERSegment', period: 'April 2024 - July 2024', details: 'Completed CEH v12, web app pentesting, and networking security modules.' },
    ],
  },
  {
    type: 'Projects',
    items: [
      { title: 'FarmBharath: Secure Farmer-Buyer Platform', period: 'Dec 2023 – June 2024', details: 'Java, JSP, MySQL. Secure direct transactions, encryption, and authentication.', link: 'https://github.com/ramkrishna2004/FarmBharath' },
      { title: 'WeLearn: E-Learning Mobile App', period: 'March 2023 – June 2023', details: 'React Native. Programming tutorials, interactive exercises, multimedia resources.', link: 'https://github.com/ramkrishna2004/ReactNativeElearningApp' },
    ],
  },
];

const skills = [
  { name: 'Java', level: 90 },{ name: 'Cyber Security', level: 80 },
  { name: 'JavaScript (Node.js)', level: 70 }, { name: 'MySQL', level: 70 }, { name: 'MongoDB', level: 90 },
   { name: 'Tailwind CSS', level: 85 }, { name: 'Python', level: 70 }, { name: 'React Native', level: 60 },
];

const securityTools = ['Burp Suite', 'Metasploit', 'Nmap', 'Wireshark', 'Hydra', 'Nikto', 'Kali Linux', 'ZAP'];

const certifications = ['Certified Ethical Hacker, ERSegment', 'MongoDB with Node.js, MongoDB University', 'React Native, Brainovision'];

const achievements = [
  'Winner of 36-hour Mobile App Development Hackathon using React Native.',
  'Top scorer in Mathematics Aptitude Test (MAT) conducted by Lead India.',
  'Secured first position in Mobile Application Development Workshop using React Native.',
  'Contributed as Backend Developer in Smart India Hackathon, focusing on secure coding.',
  'Participated in AWS Cloud Computing Workshop.',
];

const socialLinks = [
  { icon: 'github', url: 'https://github.com/ramkrishna2004', label: 'GitHub' },
  { icon: 'linkedin', url: 'https://www.linkedin.com/in/mulugu-naga-rama-krishna-chari-ab85541b5/', label: 'LinkedIn' },
  { icon: 'mail', url: 'mailto:mnrkchari@gmail.com', label: 'Email' },
];

const iconMap = {
  github: (
    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.02c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.1 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 2.92-.39c.99.01 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.8 1.09.8 2.2v3.26c0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/>
    </svg>
  ),
  linkedin: (
    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76c.97 0 1.75.79 1.75 1.76s-.78 1.76-1.75 1.76zm15.25 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/>
    </svg>
  ),
  mail: (
    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z"/>
    </svg>
  ),
};

const About = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.3,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${p.opacity})`;
        ctx.fill();
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      });
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative min-h-screen text-gray-200 overflow-hidden bg-gradient-to-br from-indigo-900 to-gray-300 font-sans">
      <canvas ref={canvasRef} className="fixed top-0 left-0 z-0 opacity-50 w-full h-full" />
      <div className="relative z-10 flex flex-col items-center py-10 px-2 sm:py-14 sm:px-4 md:py-16 md:px-6">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 150 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="w-full max-w-lg sm:max-w-2xl md:max-w-3xl p-4 sm:p-8 md:p-10 mb-10 sm:mb-16 md:mb-20 rounded-2xl bg-gray-800/40 backdrop-blur-xl border border-blue-300/30 shadow-2xl transform perspective-1000"
          style={{ boxShadow: '0 0 20px rgba(147, 197, 253, 0.3)' }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 150, delay: 0.6 }}
              className="inline-block mb-4 sm:mb-6"
            >
              <svg width="80" height="80" fill="none" viewBox="0 0 60 60" className="sm:w-[100px] sm:h-[100px]">
                <circle cx="30" cy="30" r="30" fill="#93c5fd" />
                <text x="30" y="38" textAnchor="middle" fontSize="28" fill="#1e3a8a" fontWeight="bold">RK</text>
              </svg>
            </motion.div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-blue-200 mb-2 sm:mb-3 tracking-tight">MULUGU NAGA RAMA KRISHNA CHARI</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 font-medium mb-2 sm:mb-3">Full Stack Developer & Cybersecurity Enthusiast</p>
            <p className="text-xs sm:text-base text-gray-400 mb-6 sm:mb-8 leading-relaxed">Proficient in Java, Python, React Native, and database technologies. Strong foundation in secure coding and penetration testing, dedicated to crafting secure, impactful digital solutions.</p>
            <div className="flex justify-center gap-6 sm:gap-8">
              {socialLinks.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.4, duration: 0.8 }}
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  className="text-blue-300 hover:text-blue-100 transition-colors"
                >
                  {iconMap[link.icon]}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="w-full max-w-lg sm:max-w-2xl md:max-w-5xl mb-10 sm:mb-16 md:mb-20">
          {timeline.map((section, idx) => (
            <motion.div
              key={section.type}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -200 : 200 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: idx * 0.2 }}
              className="mb-8 sm:mb-12 md:mb-16 p-4 sm:p-8 md:p-10 rounded-3xl bg-gray-800/30 backdrop-blur-lg border border-blue-300/20 shadow-xl transform perspective-1000 hover:-translate-y-2"
              style={{ boxShadow: '0 0 15px rgba(147, 197, 253, 0.2)' }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-200 mb-4 sm:mb-6 md:mb-8 flex items-center gap-3 sm:gap-4">
                <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-400 animate-pulse"></span>
                {section.type}
              </h2>
              <div className="relative pl-6 sm:pl-10">
                <svg className="absolute left-1 sm:left-2 top-0 h-full w-3 sm:w-4" viewBox="0 0 4 100" preserveAspectRatio="none">
                  <path d="M2 0v100" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4,4" className="animate-[dash_2s_linear_infinite]" />
                </svg>
                {section.items.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.3 }}
                    className="mb-6 sm:mb-8 md:mb-10 relative group"
                  >
                    <div className="absolute -left-4 sm:-left-5 top-2 sm:top-3 w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full border-4 border-gray-800 group-hover:animate-ping" style={{ boxShadow: '0 0 10px rgba(147, 197, 253, 0.5)' }}></div>
                    <div className="ml-7 sm:ml-10 p-4 sm:p-6 rounded-xl bg-gray-900/20 group-hover:bg-gray-900/40 transition-colors">
                      <div className="text-lg sm:text-2xl font-semibold text-blue-200 flex items-center gap-2 sm:gap-4">
                        {item.title}
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline hover:text-blue-300">View</a>
                        )}
                      </div>
                      <div className="text-gray-300 text-sm sm:text-base font-medium">{item.org || item.period}</div>
                      <div className="text-blue-300 text-xs sm:text-sm mb-1 sm:mb-2">{item.period && item.org ? item.period : item.details}</div>
                      <div className="text-gray-400 text-xs sm:text-base">{item.details}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skills */}
        <div className="w-full max-w-lg sm:max-w-2xl md:max-w-5xl mb-10 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="p-4 sm:p-8 md:p-10 rounded-3xl bg-gray-800/30 backdrop-blur-lg border border-blue-300/20 shadow-xl transform perspective-1000 hover:-translate-y-2"
            style={{ boxShadow: '0 0 15px rgba(147, 197, 253, 0.2)' }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-200 mb-4 sm:mb-6 md:mb-8 flex items-center gap-3 sm:gap-4">
              <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-400 animate-pulse"></span>
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 mb-6 sm:mb-10">
              {skills.map((skill, idx) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  whileHover={{ rotateX: 5, rotateY: 5 }}
                  className="p-4 sm:p-6 rounded-xl bg-gray-900/30 hover:bg-gray-900/50 transition-colors border border-blue-400/10"
                >
                  <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <span className="text-blue-200 font-semibold text-base sm:text-lg">{skill.name}</span>
                    <span className="text-blue-400 font-bold">{skill.level}%</span>
                  </div>
                  <div className="h-2 sm:h-3 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                      style={{ boxShadow: '0 0 8px rgba(147, 197, 253, 0.6)' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-blue-200 mb-4 sm:mb-6">Security Tools</h3>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {securityTools.map((tool, idx) => (
                <motion.span
                  key={tool}
                  initial={{ scale: 0, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 400, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="px-3 py-1 sm:px-5 sm:py-2 bg-blue-900/50 text-blue-200 rounded-full font-semibold border border-blue-300/30 hover:bg-blue-900/70"
                  style={{ boxShadow: '0 0 8px rgba(147, 197, 253, 0.3)' }}
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Certifications & Achievements */}
        <div className="w-full max-w-lg sm:max-w-2xl md:max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-10 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -150 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="p-4 sm:p-8 md:p-10 rounded-3xl bg-gray-800/30 backdrop-blur-lg border border-blue-300/20 shadow-xl transform perspective-1000 hover:-translate-y-2"
            style={{ boxShadow: '0 0 15px rgba(147, 197, 253, 0.2)' }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-200 mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
              <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-400 animate-pulse"></span>
              Certifications
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 sm:space-y-3 text-sm sm:text-base">
              {certifications.map(cert => (
                <motion.li
                  key={cert}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {cert}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 150 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="p-4 sm:p-8 md:p-10 rounded-3xl bg-gray-800/30 backdrop-blur-lg border border-blue-300/20 shadow-xl transform perspective-1000 hover:-translate-y-2"
            style={{ boxShadow: '0 0 15px rgba(147, 197, 253, 0.2)' }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-200 mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
              <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-400 animate-pulse"></span>
              Achievements
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 sm:space-y-3 text-sm sm:text-base">
              {achievements.map(ach => (
                <motion.li
                  key={ach}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {ach}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -8;
          }
        }
        .animate-[dash_2s_linear_infinite] {
          animation: dash 2s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default About;