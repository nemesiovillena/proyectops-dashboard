export const API_ENDPOINTS = {
  projects: {
    base: '/projects',
    byId: (id: string) => `/projects/${id}`,
  },
  tasks: {
    base: '/tasks',
    byId: (id: string) => `/tasks/${id}`,
  },
  team: {
    base: '/team',
    byId: (id: string) => `/team/${id}`,
  },
  metrics: {
    base: '/metrics',
    projects: '/metrics/projects',
    projectById: (id: string) => `/metrics/projects/${id}`,
    team: '/metrics/team',
    teamById: (id: string) => `/metrics/team/${id}`,
  }
} as const;
