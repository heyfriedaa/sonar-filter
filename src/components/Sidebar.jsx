import {
  Activity,
  BookOpen,
  Box,
  GitBranch,
  ChevronDown,
  Code,
  GitPullRequest,
  LayoutDashboard,
  List,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Target,
} from 'lucide-react';

const sections = [
  {
    title: null,
    items: [
      { icon: LayoutDashboard, label: 'Overview' },
      { icon: List, label: 'Dashboards' },
    ],
  },
  {
    title: 'Analysis',
    items: [
      { icon: BookOpen, label: 'Summary' },
      { icon: Siren, label: 'Issues', active: true },
      { icon: Box, label: 'Architecture' },
      { icon: ShieldAlert, label: 'Security hotspots' },
      { icon: ShieldCheck, label: 'Dependency risks' },
    ],
  },
  {
    title: 'Reporting',
    items: [
      { icon: ShieldCheck, label: 'Security reports' },
      { icon: Target, label: 'Measures' },
      { icon: Activity, label: 'Activity' },
    ],
  },
  {
    title: 'Policies',
    items: [
      { icon: Box, label: 'Intended architecture' },
      { icon: Target, label: 'Quality profiles' },
      { icon: ShieldCheck, label: 'Quality gate' },
    ],
  },
  {
    title: 'Project',
    items: [
      { icon: GitPullRequest, label: 'Pull requests', count: 9 },
      { icon: GitBranch, label: 'Branches', count: 1 },
      { icon: Code, label: 'Code' },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-project">
        <div className="project-icon">O</div>
        <div className="project-info">
          <div className="project-name">onboarding-cli</div>
          <div className="project-type">Project</div>
        </div>
        <ChevronDown size={14} className="project-chevron" />
      </div>
      <nav className="sidebar-nav">
        {sections.map((section, idx) => (
          <div key={idx} className="sidebar-section">
            {section.title && (
              <div className="sidebar-section-title">{section.title}</div>
            )}
            <ul className="sidebar-list">
              {section.items.map((item) => (
                <li key={item.label}>
                  <a
                    href="#"
                    className={`sidebar-link ${item.active ? 'active' : ''}`}
                  >
                    <item.icon size={16} className="sidebar-icon" />
                    <span>{item.label}</span>
                    {item.count !== undefined && (
                      <span className="sidebar-count">{item.count}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
