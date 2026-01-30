# Coding Standards & Guidelines

## 🎯 Overview

This document outlines the coding standards and best practices for the ONA Portfolio Website project. Following these guidelines ensures code consistency, maintainability, and quality across the entire codebase.

## 🏗️ General Principles

### Code Quality
- **Readability**: Code should be self-documenting and easy to understand
- **Maintainability**: Code should be easy to modify and extend
- **Performance**: Code should be optimized for performance
- **Security**: Code should follow security best practices
- **Testing**: Code should be thoroughly tested

### Development Approach
- **Component-Based**: Build reusable, modular components
- **Type Safety**: Use TypeScript for all new code
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimize for Core Web Vitals

## 📁 Project Structure

### Directory Organization
```
src/
├── app/                          # Next.js App Router pages
├── components/                   # Reusable React components
│   ├── ui/                      # Base UI components
│   ├── forms/                   # Form components
│   └── layout/                  # Layout components
├── lib/                         # Utility functions and configurations
│   ├── supabase/                # Database utilities
│   ├── utils/                   # General utilities
│   └── validations/             # Data validation schemas
├── hooks/                       # Custom React hooks
├── styles/                      # Global styles and themes
├── types/                       # TypeScript type definitions
└── constants/                   # Application constants
```

### File Naming Conventions
- **Components**: `PascalCase` (e.g., `ProjectCard.tsx`)
- **Utilities**: `camelCase` (e.g., `formatDate.ts`)
- **Types**: `PascalCase` with `Type` suffix (e.g., `ProjectType.ts`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `API_ENDPOINTS.ts`)
- **Hooks**: `camelCase` with `use` prefix (e.g., `useProjects.ts`)

## 🔧 TypeScript Standards

### Type Definitions
```typescript
// ✅ Good: Explicit type definitions
interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Good: Generic types for reusability
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// ❌ Bad: Using 'any' type
const data: any = fetchData();
```

### Type Imports
```typescript
// ✅ Good: Type-only imports
import type { Project, ApiResponse } from '@/types/project';

// ❌ Bad: Mixing value and type imports
import { Project, createProject } from '@/types/project';
```

### Optional Properties
```typescript
// ✅ Good: Explicit optional properties
interface User {
  id: string;
  name: string;
  email?: string;  // Optional property
  avatarUrl?: string;
}

// ❌ Bad: Implicit any for optional properties
interface User {
  id: string;
  name: string;
  email;  // Implicit any
}
```

## ⚛️ React Component Standards

### Component Structure
```tsx
// ✅ Good: Clean component structure
interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      {onEdit && (
        <button onClick={() => onEdit(project)}>
          Edit
        </button>
      )}
    </div>
  );
}
```

### Hooks Usage
```tsx
// ✅ Good: Custom hooks for logic separation
function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, refetch: fetchProjects };
}

// ❌ Bad: Logic mixed in components
function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Complex logic directly in component
    setLoading(true);
    api.getProjects().then(setProjects).finally(() => setLoading(false));
  }, []);

  // ... rest of component
}
```

### Event Handlers
```tsx
// ✅ Good: Stable event handlers with useCallback
const handleSubmit = useCallback((data: FormData) => {
  // Handle form submission
}, []);

// ✅ Good: Inline handlers for simple cases
<button onClick={() => setCount(count + 1)}>
  Increment
</button>

// ❌ Bad: Unstable event handlers
const handleClick = () => {
  // This creates a new function on every render
  setCount(count + 1);
};
```

## 🎨 Styling Standards

### Tailwind CSS Usage
```tsx
// ✅ Good: Semantic class names
<div className="card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h3 className="text-xl font-semibold text-gray-900 mb-2">
    Project Title
  </h3>
  <p className="text-gray-600">
    Project description
  </p>
</div>

// ✅ Good: Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>

// ❌ Bad: Overly complex class strings
<div className="bg-white p-4 rounded shadow hover:shadow-md transition-all duration-200 border border-gray-200">
  {/* Too many classes, hard to read */}
</div>
```

### CSS Custom Properties
```css
/* ✅ Good: CSS custom properties for theming */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
}

.card {
  background: var(--color-primary);
  padding: var(--spacing-sm);
}
```

## 📡 API Integration Standards

### Supabase Client Usage
```typescript
// ✅ Good: Centralized Supabase client
import { supabase } from '@/lib/supabase';

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_published', true)
    .order('sort_order');

  if (error) throw error;
  return data;
}

// ❌ Bad: Direct Supabase usage in components
function ProjectsList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    supabase.from('projects').select('*').then(({ data }) => {
      setProjects(data);
    });
  }, []);

  // Component logic mixed with data fetching
}
```

### Error Handling
```typescript
// ✅ Good: Comprehensive error handling
export async function createProject(projectData: ProjectInput) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();

    if (error) {
      // Log error for debugging
      console.error('Failed to create project:', error);

      // Throw user-friendly error
      throw new Error('Failed to create project. Please try again.');
    }

    return data;
  } catch (error) {
    // Handle network errors, etc.
    throw error;
  }
}
```

## 🧪 Testing Standards

### Unit Tests
```typescript
// ✅ Good: Comprehensive unit tests
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';

describe('ProjectCard', () => {
  const mockProject = {
    id: '1',
    title: 'Test Project',
    description: 'A test project',
  };

  it('renders project information', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<ProjectCard project={mockProject} onEdit={mockOnEdit} />);

    fireEvent.click(screen.getByText('Edit'));

    expect(mockOnEdit).toHaveBeenCalledWith(mockProject);
  });
});
```

### Component Testing
- Test user interactions
- Test accessibility features
- Test error states
- Test loading states
- Use descriptive test names

## ♿ Accessibility Standards

### Semantic HTML
```tsx
// ✅ Good: Semantic HTML elements
<header className="site-header">
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/projects">Projects</a></li>
      <li><a href="/team">Team</a></li>
    </ul>
  </nav>
</header>

<main>
  <h1>Our Projects</h1>
  <section aria-labelledby="projects-heading">
    <h2 id="projects-heading">Featured Work</h2>
    {/* Project content */}
  </section>
</main>
```

### ARIA Attributes
```tsx
// ✅ Good: Proper ARIA usage
<button
  aria-expanded={isOpen}
  aria-controls="menu-panel"
  onClick={toggleMenu}
>
  Menu
</button>

<div
  id="menu-panel"
  role="menu"
  aria-hidden={!isOpen}
>
  {/* Menu items */}
</div>
```

### Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Provide visible focus indicators
- Implement logical tab order
- Support common keyboard shortcuts

## 🚀 Performance Standards

### Code Splitting
```typescript
// ✅ Good: Dynamic imports for code splitting
const AdminDashboard = lazy(() =>
  import('../components/admin/AdminDashboard')
);

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminDashboard />
    </Suspense>
  );
}
```

### Image Optimization
```tsx
// ✅ Good: Next.js Image component usage
import Image from 'next/image';

export function ProjectImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      sizes="(max-width: 768px) 100vw, 50vw"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/..."
    />
  );
}
```

### Bundle Analysis
- Keep initial bundle size under 200KB
- Use dynamic imports for large components
- Optimize dependencies and tree shaking
- Monitor bundle size changes

## 🔒 Security Standards

### Input Validation
```typescript
// ✅ Good: Zod schema validation
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000),
  clientName: z.string().min(1),
  isPublished: z.boolean().default(false),
});

export function validateProject(data: unknown) {
  return projectSchema.parse(data);
}
```

### Authentication Checks
```typescript
// ✅ Good: Proper authentication checks
import { useAuth } from '@/hooks/useAuth';

export function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Redirect to="/login" />;

  // User is authenticated, render admin content
  return <AdminDashboard />;
}
```

### Data Sanitization
- Sanitize user inputs before database storage
- Use parameterized queries to prevent SQL injection
- Validate file uploads for type and size
- Escape HTML content to prevent XSS

## 📝 Documentation Standards

### Code Comments
```typescript
// ✅ Good: Meaningful comments
/**
 * Calculates the total project budget including contingency
 * @param baseBudget - The base project cost
 * @param contingencyPercentage - Percentage for contingency (0-1)
 * @returns Total budget with contingency
 */
export function calculateTotalBudget(
  baseBudget: number,
  contingencyPercentage: number
): number {
  if (contingencyPercentage < 0 || contingencyPercentage > 1) {
    throw new Error('Contingency percentage must be between 0 and 1');
  }

  return baseBudget * (1 + contingencyPercentage);
}

// ❌ Bad: Obvious comments
// This function adds two numbers
function add(a, b) {
  return a + b; // Returns the sum
}
```

### Component Documentation
```tsx
/**
 * ProjectCard displays a project preview with image, title, and description.
 * Supports optional edit functionality for admin users.
 *
 * @param project - The project data to display
 * @param onEdit - Optional callback when edit button is clicked
 * @param showDescription - Whether to show the full description (default: true)
 */
interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  showDescription?: boolean;
}
```

## 🔄 Version Control Standards

### Commit Messages
```bash
# ✅ Good: Descriptive commit messages
git commit -m "feat: add project filtering by category

- Add category filter dropdown to projects page
- Update API to support category filtering
- Add tests for filter functionality

Closes #123"

# ❌ Bad: Vague commit messages
git commit -m "fix bug"
git commit -m "update stuff"
```

### Branch Naming
```bash
# ✅ Good: Descriptive branch names
feature/add-project-filtering
bugfix/fix-image-upload-error
hotfix/security-patch
refactor/cleanup-unused-code

# ❌ Bad: Non-descriptive branch names
fix
update
new-feature
```

## 🛠️ Development Workflow

### Pre-commit Hooks
- Run ESLint before commits
- Run TypeScript type checking
- Run tests before pushing
- Format code with Prettier

### Code Review Process
- Self-review code before requesting review
- Provide context in pull request descriptions
- Address review feedback promptly
- Test changes thoroughly before merging

### Continuous Integration
- Automated testing on pull requests
- Code quality checks (ESLint, TypeScript)
- Security vulnerability scanning
- Performance regression testing

## 📊 Performance Monitoring

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **FID (First Input Delay)**: < 100 milliseconds
- **CLS (Cumulative Layout Shift)**: < 0.1

### Monitoring Tools
- **Lighthouse**: Regular performance audits
- **Web Vitals**: Real user monitoring
- **Bundle Analyzer**: Bundle size monitoring
- **Error Tracking**: Sentry for error monitoring

## 🎯 Best Practices Summary

### Do's
- ✅ Use TypeScript for type safety
- ✅ Write comprehensive tests
- ✅ Follow component composition patterns
- ✅ Implement proper error handling
- ✅ Use semantic HTML and ARIA
- ✅ Optimize for performance
- ✅ Document complex logic
- ✅ Follow consistent naming conventions

### Don'ts
- ❌ Don't use `any` type in TypeScript
- ❌ Don't mix data fetching with UI logic
- ❌ Don't create unstable event handlers
- ❌ Don't ignore accessibility concerns
- ❌ Don't skip input validation
- ❌ Don't commit untested code
- ❌ Don't use inline styles excessively
- ❌ Don't ignore performance warnings

## 📚 Resources

### Recommended Reading
- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tools & Libraries
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Testing Library**: Component testing
- **Zod**: Schema validation

---

**Coding Standards Version**: v1.0
**Last Updated**: January 2026