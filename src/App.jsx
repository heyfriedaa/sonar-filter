import { useEffect, useMemo, useState } from 'react'
import { Bot, Check, ChevronDown, ChevronRight, CircleAlert, Flame, GitBranch, GitPullRequest, Layers, ListFilter, X } from 'lucide-react'
import { TopNav } from './components/TopNav'
import { Sidebar } from './components/Sidebar'
import { IssueCard } from './components/IssueCard'
import { issues } from './data/mockIssues'
import './App.css'

const branches = [
  { name: 'main', icon: GitBranch, pass: false },
  { name: '1 – Update index.html', icon: GitPullRequest, pass: true },
]

const sortOptions = ['Priority', 'Filename', 'Creation date']

const severityRank = { Blocker: 0, High: 1, Medium: 2, Low: 3, Info: 4 }

const filterCategories = [
  { key: 'quality', label: 'Software quality', field: 'quality', options: ['Security', 'Reliability', 'Maintainability'] },
  { key: 'severity', label: 'Severity', field: 'severity', options: ['Blocker', 'High', 'Medium', 'Low', 'Info'] },
  { key: 'codeAttribute', label: 'Code attribute', field: null, options: ['New code', 'Overall code'] },
  { key: 'type', label: 'Type', field: 'type', options: ['Vulnerability', 'Bug', 'Code Smell', 'Security Hotspot'] },
  { key: 'typeSeverity', label: 'Type Severity', field: null, options: ['Blocker', 'High', 'Medium', 'Low', 'Info'] },
  { key: 'status', label: 'Status', field: 'status', options: ['Open', 'Confirmed', 'Accepted', 'Resolved'] },
  { key: 'securityCategory', label: 'Security Category', field: null, options: ['SQL Injection', 'XSS', 'Weak Cryptography'] },
  { key: 'creationDate', label: 'Creation Date', field: null, options: ['Today', 'Last 7 days', 'Last 30 days', 'Older'] },
  { key: 'language', label: 'Language', field: null, options: ['TypeScript', 'JavaScript'] },
  { key: 'rule', label: 'Rule', field: null, options: ['typescript:S3649', 'javascript:S2077', 'javascript:S1440'] },
  { key: 'tag', label: 'Tag', field: 'tags', options: ['cwe', 'owasp'] },
]

const countsFor = (options, field) =>
  Object.fromEntries(
    options.map((o) => [
      o,
      field ? issues.filter((i) => (Array.isArray(i[field]) ? i[field].includes(o) : i[field] === o)).length : 0,
    ])
  )

const matchesFilters = (issue, filters) =>
  filterCategories.every(({ key, field }) => {
    const selected = filters[key] ?? []
    if (selected.length === 0 || !field) return true
    const value = issue[field]
    return Array.isArray(value) ? selected.some((s) => value.includes(s)) : selected.includes(value)
  })

function App() {
  const [view, setView] = useState('top10')
  const [sortBy, setSortBy] = useState('Priority')
  const [openMenu, setOpenMenu] = useState(null)
  const [branch, setBranch] = useState(branches[0])
  const [activeCategory, setActiveCategory] = useState(filterCategories[0].key)
  const [pendingFilters, setPendingFilters] = useState({})
  const [appliedFilters, setAppliedFilters] = useState({})
  const [selected, setSelected] = useState(new Set())

  useEffect(() => {
    if (!openMenu) return
    const onMouseDown = (e) => {
      if (!e.target.closest('.filter-dropdown, .branch-picker, .filters-panel')) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [openMenu])

  const togglePending = (key, option) => {
    setPendingFilters((prev) => {
      const current = prev[key] ?? []
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option]
      return { ...prev, [key]: next }
    })
  }

  const pendingCount = Object.values(pendingFilters).flat().length
  const appliedCount = Object.values(appliedFilters).flat().length

  const filtered = useMemo(() => {
    const base = issues.filter((issue) => matchesFilters(issue, appliedFilters))
    const sorted = [...base].sort((a, b) => {
      if (sortBy === 'Filename') return a.file.localeCompare(b.file)
      if (sortBy === 'Creation date') return b.createdRank - a.createdRank
      return severityRank[a.severity] - severityRank[b.severity]
    })
    return view === 'top10'
      ? sorted.filter((i) => i.severity === 'Blocker').slice(0, 10)
      : sorted
  }, [view, sortBy, appliedFilters])

  const openFilters = () => {
    setPendingFilters(appliedFilters)
    setOpenMenu(openMenu === 'filters' ? null : 'filters')
  }

  const category = filterCategories.find((c) => c.key === activeCategory)

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
                <div className="branch-picker">
                  <button
                    className={`branch-selector ${openMenu === 'branch' ? 'open' : ''}`}
                    onClick={() => setOpenMenu(openMenu === 'branch' ? null : 'branch')}
                  >
                    <branch.icon size={16} />
                    {branch.name}
                    <ChevronDown size={14} />
                  </button>
                  <span className={`branch-status ${branch.pass ? 'pass' : 'fail'}`}>
                    {branch.pass ? <Check size={14} /> : <X size={14} />}
                  </span>
                  {openMenu === 'branch' && (
                    <div className="filter-menu branch-menu">
                      {branches.map((b) => (
                        <button
                          key={b.name}
                          className="filter-option"
                          onClick={() => {
                            setBranch(b)
                            setOpenMenu(null)
                          }}
                        >
                          <span className="option-check">
                            {b.name === branch.name && <Check size={12} />}
                          </span>
                          <b.icon size={14} />
                          {b.name}
                          <span className={`branch-status ${b.pass ? 'pass' : 'fail'}`}>
                            {b.pass ? <Check size={12} /> : <X size={12} />}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="toolbar">
            <div className="quick-filters">
              <button
                className={`quick-chip ${view === 'top10' ? 'active' : ''}`}
                onClick={() => setView('top10')}
              >
                <Flame size={14} color="#FF5200" fill="#FF5200" />
                Top 10 issues
              </button>
              <button
                className={`quick-chip ${view === 'all' ? 'active' : ''}`}
                onClick={() => setView('all')}
              >
                <Layers size={14} />
                All <span className="quick-count">{issues.length}</span>
              </button>
            </div>

            <div className="toolbar-right">
              <span className="sort-label">Sort by</span>
              <div className="filter-dropdown">
                <button
                  className={`filter-chip ${openMenu === 'sort' ? 'open' : ''}`}
                  onClick={() => setOpenMenu(openMenu === 'sort' ? null : 'sort')}
                >
                  {sortBy}
                  <ChevronDown size={14} />
                </button>
                {openMenu === 'sort' && (
                  <div className="filter-menu">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        className="filter-option"
                        onClick={() => {
                          setSortBy(option)
                          setOpenMenu(null)
                        }}
                      >
                        <span className="option-check">
                          {option === sortBy && <Check size={12} />}
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                className={`filter-chip ${appliedCount ? 'has-selection' : ''} ${openMenu === 'filters' ? 'open' : ''}`}
                onClick={openFilters}
              >
                <ListFilter size={14} />
                Filters
                {appliedCount > 0 && <span className="chip-count">{appliedCount}</span>}
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {openMenu === 'filters' && (
            <div className="filters-panel">
              <div className="filters-categories">
                {filterCategories.map((c) => {
                  const count = (pendingFilters[c.key] ?? []).length
                  return (
                    <button
                      key={c.key}
                      className={`filters-category ${activeCategory === c.key ? 'active' : ''}`}
                      onClick={() => setActiveCategory(c.key)}
                    >
                      <span>{c.label}</span>
                      {count > 0 && <span className="category-count">{count}</span>}
                      <ChevronRight size={14} />
                    </button>
                  )
                })}
              </div>
              <div className="filters-options">
                {category.options.map((option) => {
                  const checked = (pendingFilters[category.key] ?? []).includes(option)
                  const count = countsFor([option], category.field)[option]
                  return (
                    <label key={option} className="filters-option">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePending(category.key, option)}
                      />
                      <span className="filters-option-label">{option}</span>
                      <span className="filters-option-count">{count}</span>
                    </label>
                  )
                })}
              </div>
              <div className="filters-footer">
                <button className="clear-filters" onClick={() => setPendingFilters({})}>
                  Clear filters{pendingCount > 0 && ` (${pendingCount})`}
                </button>
                <button
                  className="apply-filters"
                  onClick={() => {
                    setAppliedFilters(pendingFilters)
                    setOpenMenu(null)
                  }}
                >
                  Apply filters
                </button>
              </div>
            </div>
          )}

          <div className="issues-section">
            <h2 className="section-title">
              {view === 'top10' ? 'Top 10 issues' : 'All issues'}
            </h2>
            <div className="section-subtitle-row">
              <label className="section-subtitle">
                <input
                  type="checkbox"
                  className="issue-checkbox"
                  checked={
                    filtered.length > 0 &&
                    filtered.every((i) => selected.has(i.id))
                  }
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? new Set(filtered.map((i) => i.id))
                        : new Set()
                    )
                  }
                />
                {view === 'top10'
                  ? 'Showing the highest severity issues in this project.'
                  : 'Showing all open issues in this project.'}
              </label>
            </div>

            <div className="issue-list">
              {filtered.length > 0 ? (
                filtered.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    checked={selected.has(issue.id)}
                    onToggle={(checked) =>
                      setSelected((prev) => {
                        const next = new Set(prev)
                        if (checked) next.add(issue.id)
                        else next.delete(issue.id)
                        return next
                      })
                    }
                  />
                ))
              ) : (
                <div className="empty-state">
                  <CircleAlert size={32} />
                  <p>No issues match the current filters.</p>
                  <button
                    className="clear-filters"
                    onClick={() => {
                      setAppliedFilters({})
                      setPendingFilters({})
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {selected.size > 0 && (
        <div className="bulk-bar">
          <span className="bulk-count">{selected.size} selected</span>
          <button className="bulk-cancel" onClick={() => setSelected(new Set())}>
            Cancel all
          </button>
          <button className="bulk-change">Change</button>
          <button className="bulk-assign">
            <Bot size={14} />
            Assign to Agent
          </button>
        </div>
      )}
    </div>
  )
}

export default App
