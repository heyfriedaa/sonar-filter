import { useState } from 'react'
import { Check, ChevronDown, CircleAlert, GitBranch, Search, X } from 'lucide-react'
import { TopNav } from './components/TopNav'
import { Sidebar } from './components/Sidebar'
import { IssueCard } from './components/IssueCard'
import { issues } from './data/mockIssues'
import './App.css'

const filterGroups = [
  { key: 'severity', label: 'Severity', options: ['Blocker', 'High', 'Medium', 'Low', 'Info'] },
  { key: 'type', label: 'Type', options: ['Vulnerability', 'Bug', 'Code smell', 'Security hotspot'] },
  { key: 'status', label: 'Status', options: ['Open', 'Confirmed', 'Resolved', 'Accepted'] },
  { key: 'assignee', label: 'Assignee', options: ['Me', 'Not assigned', 'Team'] },
]

function App() {
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState({})
  const [openMenu, setOpenMenu] = useState(null)

  const toggleFilter = (group, option) => {
    setActiveFilters((prev) => {
      const current = prev[group] ?? []
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option]
      return { ...prev, [group]: next }
    })
  }

  const activeCount = Object.values(activeFilters).flat().length

  const clearFilters = () => setActiveFilters({})

  const filtered = issues.filter((issue) => {
    const matchesQuery =
      !query ||
      issue.title.toLowerCase().includes(query.toLowerCase()) ||
      issue.file.toLowerCase().includes(query.toLowerCase())
    const matchesFilters = filterGroups.every(({ key }) => {
      const selected = activeFilters[key] ?? []
      return selected.length === 0 || selected.includes(issue[key])
    })
    return matchesQuery && matchesFilters
  })

  return (
    <div className="app-shell">
      <TopNav />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <div className="page-hero">
            <nav className="breadcrumbs">
              <a href="#">SonarApp</a>
              <span className="breadcrumb-sep">/</span>
              <a href="#">onboarding-cli</a>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">Issues</span>
            </nav>
            <div className="page-header">
              <div className="page-title-row">
                <h1 className="page-title">Issues</h1>
                <button className="branch-selector">
                  <GitBranch size={14} />
                  main
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="filter-bar">
            <div className="filter-search">
              <Search size={14} className="filter-search-icon" />
              <input
                type="text"
                placeholder="Search issues..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="filter-groups">
              {filterGroups.map((group) => {
                const selected = activeFilters[group.key] ?? []
                return (
                  <div key={group.key} className="filter-dropdown">
                    <button
                      className={`filter-chip ${selected.length ? 'has-selection' : ''} ${openMenu === group.key ? 'open' : ''}`}
                      onClick={() => setOpenMenu(openMenu === group.key ? null : group.key)}
                    >
                      {group.label}
                      {selected.length > 0 && <span className="chip-count">{selected.length}</span>}
                      <ChevronDown size={14} />
                    </button>
                    {openMenu === group.key && (
                      <div className="filter-menu">
                        {group.options.map((option) => (
                          <button
                            key={option}
                            className="filter-option"
                            onClick={() => toggleFilter(group.key, option)}
                          >
                            <span className="option-check">
                              {selected.includes(option) && <Check size={12} />}
                            </span>
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {activeCount > 0 && (
              <button className="clear-filters" onClick={clearFilters}>
                <X size={12} />
                Clear filters ({activeCount})
              </button>
            )}
          </div>

          <div className="issue-list">
            {filtered.length > 0 ? (
              filtered.map((issue) => <IssueCard key={issue.id} issue={issue} />)
            ) : (
              <div className="empty-state">
                <CircleAlert size={32} />
                <p>No issues match the current filters.</p>
                <button className="clear-filters" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
