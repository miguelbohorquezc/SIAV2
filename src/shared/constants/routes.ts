export const PublicRoutes = {
  LOGIN: "login",
  ASPIRANTES: "aspirantes",
  MATRICULA: "matricula"
} as const;

export const PrivateRoutes = {
  ASPIRANTES: "aspirantes",
  USER: 'user',
  PRIVATE: 'private',
  DASHBOARD: 'dashboard',
  HOME: 'home',
  STUDENT: 'student',
  CREATESTUDENT: 'createstudent',
  HISTORY: 'history',
  ACADEMY: 'academy',
  NOTES: 'notes',
  REPORT: 'report',
  NOTESPRESCHOOL: 'notespreschool',
  INDICADORES: 'indicadores',
  EVALUADORPREESCOLAR: 'evaluadorpreescolar',
  PRINT: 'print',
  CLASSROOMS: 'classrooms',
  AREA: 'area',
  ADMIN_USERS: 'admin/users',
  ADMIN_ASPIRANTES: 'admin/apirantes'
} as const;
