/**
 * EventSphere Initial Demo Users
 * Includes standard student/attendee, verified college organizer, and administrator.
 */

export const INITIAL_USERS = [
  {
    id: 'user-admin-1',
    email: 'admin@eventsphere.edu',
    name: 'Dr. Evelyn Vance',
    role: 'Administrator',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    title: 'Dean of Student Affairs & Verification Chair',
    institution: 'Apex Institute of Technology',
    institutionVerified: true,
    isVerifiedOrganizer: true,
    bio: 'Oversees campus event compliance, safety guidelines, and event verification integrity.',
    joinedAt: '2026-01-10T08:00:00Z',
    demoPassword: 'admin',
  },
  {
    id: 'user-organizer-1',
    email: 'organizer@eventsphere.edu',
    name: 'Kavya Sharma',
    role: 'Event Organizer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    title: 'President, IEEE Computer Society Student Chapter',
    institution: 'Apex Institute of Technology',
    institutionVerified: true,
    isVerifiedOrganizer: true,
    completedEventsCount: 6,
    flaggedCount: 0,
    contactPhone: '+91 98765 43210',
    bio: 'Tech enthusiast & student leader organizing national hackathons, code sprints, and AI workshops.',
    joinedAt: '2026-02-15T10:30:00Z',
    demoPassword: 'org',
  },
  {
    id: 'user-organizer-2',
    email: 'sports.club@eventsphere.edu',
    name: 'Marcus Chen',
    role: 'Event Organizer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    title: 'Campus Athletics Council Head',
    institution: 'Apex Institute of Technology',
    institutionVerified: true,
    isVerifiedOrganizer: true,
    completedEventsCount: 4,
    flaggedCount: 0,
    contactPhone: '+91 98765 11223',
    bio: 'Promoting inter-collegiate sports, esports tournaments, and fitness marathons across regional colleges.',
    joinedAt: '2026-03-01T09:15:00Z',
    demoPassword: 'org',
  },
  {
    id: 'user-student-1',
    email: 'student@eventsphere.edu',
    name: 'Aarav Patel',
    role: 'Normal User',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    title: '3rd Year Computer Science Student',
    institution: 'Apex Institute of Technology',
    institutionVerified: true,
    isVerifiedOrganizer: false,
    bio: 'Passionate about open source, college cultural fests, and community volunteering.',
    joinedAt: '2026-04-12T14:20:00Z',
    demoPassword: 'user',
  },
  {
    id: 'user-student-2',
    email: 'priya.nair@eventsphere.edu',
    name: 'Priya Nair',
    role: 'Normal User',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    title: '2nd Year Biotechnology Major',
    institution: 'Apex Institute of Technology',
    institutionVerified: true,
    isVerifiedOrganizer: false,
    bio: 'Active member of the EcoClub and cultural dance society.',
    joinedAt: '2026-05-02T11:00:00Z',
    demoPassword: 'user',
  }
];

export const DEMO_CREDENTIALS = [
  { role: 'Administrator', email: 'admin@eventsphere.edu', password: 'admin', description: 'Access verification queue, manage reports, review duplicates, toggle organizer badges' },
  { role: 'Event Organizer', email: 'organizer@eventsphere.edu', password: 'org', description: 'Submit events, upload evidence, view check-in stats & attendee scans' },
  { role: 'Normal User', email: 'student@eventsphere.edu', password: 'user', description: 'Explore events, confirm accuracy, submit reports, QR check-in & bookmark' }
];
