import { Injectable, signal } from '@angular/core';
import { Project, Task, TeamMember, Status } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // Statuses
  private readonly projectStatuses: Status[] = [
    { id: '1', label: 'Planificación', value: 'planning', color: '#6366f1', type: 'project', order: 1 },
    { id: '2', label: 'En Progreso', value: 'in-progress', color: '#3b82f6', type: 'project', order: 2 },
    { id: '3', label: 'En Espera', value: 'on-hold', color: '#f59e0b', type: 'project', order: 3 },
    { id: '4', label: 'Completado', value: 'completed', color: '#10b981', type: 'project', order: 4 }
  ];

  private readonly taskStatuses: Status[] = [
    { id: '5', label: 'Pendiente', value: 'todo', color: '#6366f1', type: 'task', order: 1 },
    { id: '6', label: 'En Progreso', value: 'in-progress', color: '#3b82f6', type: 'task', order: 2 },
    { id: '7', label: 'Revisión', value: 'review', color: '#f59e0b', type: 'task', order: 3 },
    { id: '8', label: 'Completado', value: 'completed', color: '#10b981', type: 'task', order: 4 }
  ];

  // Team Members
  private readonly mockTeamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@projectops.com',
      role: 'Frontend Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      projects: ['1', '2'],
      availability: 'available',
      skills: ['Angular', 'TypeScript', 'RxJS'],
      joinedAt: new Date('2023-01-15')
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@projectops.com',
      role: 'Backend Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      projects: ['1', '3'],
      availability: 'busy',
      skills: ['Node.js', 'PostgreSQL', 'Docker'],
      joinedAt: new Date('2023-02-20')
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@projectops.com',
      role: 'UI/UX Designer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      projects: ['2'],
      availability: 'available',
      skills: ['Figma', 'Adobe XD', 'Prototyping'],
      joinedAt: new Date('2023-03-10')
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah.williams@projectops.com',
      role: 'Project Manager',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      projects: ['1', '2', '3'],
      availability: 'available',
      skills: ['Agile', 'Scrum', 'Leadership'],
      joinedAt: new Date('2023-01-05')
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@projectops.com',
      role: 'DevOps Engineer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      projects: ['3'],
      availability: 'away',
      skills: ['AWS', 'Kubernetes', 'CI/CD'],
      joinedAt: new Date('2023-04-01')
    }
  ];

  // Projects
  private readonly mockProjects: Project[] = [
    {
      id: '1',
      name: 'E-Commerce Platform Redesign',
      description: 'Complete overhaul of the e-commerce platform with modern UI/UX and improved performance',
      status: this.projectStatuses[1], // In Progress
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      teamMembers: [this.mockTeamMembers[0], this.mockTeamMembers[1], this.mockTeamMembers[3]],
      progress: 65,
      budget: 150000,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-15')
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Native mobile application for iOS and Android platforms',
      status: this.projectStatuses[1], // In Progress
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-31'),
      teamMembers: [this.mockTeamMembers[0], this.mockTeamMembers[2], this.mockTeamMembers[3]],
      progress: 40,
      budget: 200000,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-03-10')
    },
    {
      id: '3',
      name: 'Cloud Infrastructure Migration',
      description: 'Migrate all services to AWS cloud infrastructure with improved scalability',
      status: this.projectStatuses[0], // Planning
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-12-31'),
      teamMembers: [this.mockTeamMembers[1], this.mockTeamMembers[3], this.mockTeamMembers[4]],
      progress: 15,
      budget: 300000,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-20')
    },
    {
      id: '4',
      name: 'Customer Portal Enhancement',
      description: 'Add new features and improve user experience of customer self-service portal',
      status: this.projectStatuses[3], // Completed
      startDate: new Date('2023-10-01'),
      endDate: new Date('2024-02-28'),
      teamMembers: [this.mockTeamMembers[0], this.mockTeamMembers[2]],
      progress: 100,
      budget: 80000,
      createdAt: new Date('2023-09-15'),
      updatedAt: new Date('2024-02-28')
    },
    {
      id: '5',
      name: 'API Gateway Implementation',
      description: 'Implement centralized API gateway for microservices architecture',
      status: this.projectStatuses[2], // On Hold
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-05-31'),
      teamMembers: [this.mockTeamMembers[1], this.mockTeamMembers[4]],
      progress: 30,
      budget: 120000,
      createdAt: new Date('2023-12-15'),
      updatedAt: new Date('2024-02-01')
    }
  ];

  // Tasks
  private readonly mockTasks: Task[] = [
    {
      id: '1',
      projectId: '1',
      title: 'Design new homepage layout',
      description: 'Create mockups and prototypes for the new homepage design',
      status: this.taskStatuses[3], // Completed
      assignedTo: [this.mockTeamMembers[2]],
      priority: 'high',
      dueDate: new Date('2024-03-15'),
      estimatedHours: 16,
      actualHours: 14,
      tags: ['design', 'ui', 'homepage'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-14')
    },
    {
      id: '2',
      projectId: '1',
      title: 'Implement product listing component',
      description: 'Build reusable product listing component with filtering and sorting',
      status: this.taskStatuses[1], // In Progress
      assignedTo: [this.mockTeamMembers[0], this.mockTeamMembers[1]],
      priority: 'high',
      dueDate: new Date('2024-04-05'),
      estimatedHours: 24,
      actualHours: 18,
      tags: ['frontend', 'angular', 'component'],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-03-20')
    },
    {
      id: '3',
      projectId: '1',
      title: 'Set up payment gateway integration',
      description: 'Integrate Stripe payment gateway with backend APIs',
      status: this.taskStatuses[0], // Todo
      assignedTo: [this.mockTeamMembers[1]],
      priority: 'critical',
      dueDate: new Date('2024-04-20'),
      estimatedHours: 32,
      actualHours: 0,
      tags: ['backend', 'payment', 'integration'],
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15')
    },
    {
      id: '4',
      projectId: '2',
      title: 'Design mobile app wireframes',
      description: 'Create wireframes for all major screens of the mobile app',
      status: this.taskStatuses[3], // Completed
      assignedTo: [this.mockTeamMembers[2]],
      priority: 'high',
      dueDate: new Date('2024-02-28'),
      estimatedHours: 20,
      actualHours: 22,
      tags: ['design', 'mobile', 'wireframes'],
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-02-27')
    },
    {
      id: '5',
      projectId: '2',
      title: 'Implement user authentication',
      description: 'Build authentication flow with biometric support',
      status: this.taskStatuses[1], // In Progress
      assignedTo: [this.mockTeamMembers[0], this.mockTeamMembers[4]],
      priority: 'critical',
      dueDate: new Date('2024-04-10'),
      estimatedHours: 28,
      actualHours: 15,
      tags: ['mobile', 'auth', 'security'],
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-03-18')
    },
    {
      id: '6',
      projectId: '3',
      title: 'AWS infrastructure audit',
      description: 'Conduct comprehensive audit of current infrastructure',
      status: this.taskStatuses[2], // Review
      assignedTo: [this.mockTeamMembers[4]],
      priority: 'medium',
      dueDate: new Date('2024-04-15'),
      estimatedHours: 16,
      actualHours: 16,
      tags: ['devops', 'aws', 'audit'],
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-22')
    },
    {
      id: '7',
      projectId: '1',
      title: 'Performance optimization',
      description: 'Optimize frontend performance and reduce bundle size',
      status: this.taskStatuses[0], // Todo
      assignedTo: [this.mockTeamMembers[0]],
      priority: 'medium',
      dueDate: new Date('2024-05-01'),
      estimatedHours: 20,
      actualHours: 0,
      tags: ['frontend', 'performance', 'optimization'],
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-10')
    },
    {
      id: '8',
      projectId: '2',
      title: 'Push notifications setup',
      description: 'Configure push notifications for iOS and Android',
      status: this.taskStatuses[0], // Todo
      assignedTo: [this.mockTeamMembers[0]],
      priority: 'low',
      dueDate: new Date('2024-05-15'),
      estimatedHours: 12,
      actualHours: 0,
      tags: ['mobile', 'notifications'],
      createdAt: new Date('2024-03-12'),
      updatedAt: new Date('2024-03-12')
    }
  ];

  // Signals for reactive data
  projects = signal<Project[]>(this.mockProjects);
  tasks = signal<Task[]>(this.mockTasks);
  teamMembers = signal<TeamMember[]>(this.mockTeamMembers);

  getProjects(): Project[] {
    return this.mockProjects;
  }

  getTasks(): Task[] {
    return this.mockTasks;
  }

  getTeamMembers(): TeamMember[] {
    return this.mockTeamMembers;
  }

  getProjectById(id: string): Project | undefined {
    return this.mockProjects.find(p => p.id === id);
  }

  getTaskById(id: string): Task | undefined {
    return this.mockTasks.find(t => t.id === id);
  }

  getTeamMemberById(id: string): TeamMember | undefined {
    return this.mockTeamMembers.find(m => m.id === id);
  }

  getProjectStatuses(): Status[] {
    return this.projectStatuses;
  }

  getTaskStatuses(): Status[] {
    return this.taskStatuses;
  }

  getMetrics() {
    return {
      totalProjects: this.mockProjects.length,
      activeProjects: this.mockProjects.filter(p => p.status.label === 'En Progreso').length,
      completedProjects: this.mockProjects.filter(p => p.status.label === 'Completado').length,
      totalTasks: this.mockTasks.length,
      completedTasks: this.mockTasks.filter(t => t.status.label === 'Completado').length,
      teamSize: this.mockTeamMembers.length,
      averageProjectDuration: 180,
      budgetUtilization: 75
    };
  }
}
