import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Settings, Sparkles, Check, ChevronDown, ChevronRight, CircleAlert, CircleCheck, ShieldCheck, Flame, GitBranch, GitPullRequest, Layers, ListFilter, RefreshCw, Info, X } from 'lucide-react'
import { TopNav } from './components/TopNav'
import { Sidebar } from './components/Sidebar'
import { IssueCard } from './components/IssueCard'
import { IssueDetails } from './components/IssueDetails'
import { SeverityIcon } from './components/SeverityIcon'
import { issues } from './data/mockIssues'
import './App.css'

const branches = [
  { name: 'main', icon: GitBranch, pass: false },
  { name: '1 – Update index.html', icon: GitPullRequest, pass: true },
]

const sortOptions = ['Severity', 'Filename', 'Creation date']
const topIssuesFilters = { quality: ['Security', 'Reliability'], severity: ['Blocker', 'High', 'Medium'] }

const versionGroups = [
  { id: 'facet', label: 'With filter facet', versions: [{ id: 'facet-v1', label: 'V1' }] },
  {
    id: 'exploration',
    label: 'Exploration without filter facet',
    versions: [
      { id: 'exploration-v1', label: 'V1 - Top Right' },
      { id: 'exploration-v2', label: 'V2 - Bulk action' },
    ],
  },
  { id: 'triaging', label: 'Triaging and grouping', versions: [{ id: 'triaging-v1', label: 'V1' }] },
  { id: 'moonshot', label: 'Moonshot', versions: [{ id: 'moonshot-v1', label: 'V1' }] },
]

const severityRank = { Blocker: 0, High: 1, Medium: 2, Low: 3, Info: 4 }
const qualityRank = { Security: 0, Reliability: 1, Maintainability: 2 }

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
  const [sortBy, setSortBy] = useState('Severity')
  const [openMenu, setOpenMenu] = useState(null)
  const [branch, setBranch] = useState(branches[0])
  const [activeCategory, setActiveCategory] = useState(filterCategories[0].key)
  const [pendingFilters, setPendingFilters] = useState(topIssuesFilters)
  const [appliedFilters, setAppliedFilters] = useState(topIssuesFilters)
  const [selected, setSelected] = useState(new Set())
  const [triageStatusesByVersion, setTriageStatusesByVersion] = useState({})
  const [openedIssueId, setOpenedIssueId] = useState(null)
  const [triageGroup, setTriageGroup] = useState(null)
  const moveButtonRef = useRef(null)
  const [versionsVisible, setVersionsVisible] = useState(false)
  const [versionsOpen, setVersionsOpen] = useState(false)
  const [themeSettingsOpen, setThemeSettingsOpen] = useState(false)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  const [selectedVersion, setSelectedVersion] = useState('facet-v1')
  const [expandedFacets, setExpandedFacets] = useState(['quality', 'severity'])
  const isFacet = selectedVersion === 'facet-v1'
  const isMoonshot = selectedVersion === 'moonshot-v1'
  const isTriage = selectedVersion === 'triaging-v1' || isMoonshot
  const triageStatuses = useMemo(() => triageStatusesByVersion[selectedVersion] ?? {}, [triageStatusesByVersion, selectedVersion])
  const isTopTenVersion = selectedVersion === 'exploration-v2' || isTriage
  const usesInlineBulk = isFacet || selectedVersion === 'exploration-v1'
  const versionSwitcherRef = useRef(null)
  const versionButtonRef = useRef(null)
  const versionPickerRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (event.repeat) return
        setVersionsVisible((visible) => !visible)
        setVersionsOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!versionsOpen) return
    const picker = versionPickerRef.current
    const option = picker.querySelector('[aria-pressed="true"]') ?? picker.querySelector('button')
    option?.focus()
    const onMouseDown = (event) => {
      if (!versionSwitcherRef.current?.contains(event.target)) setVersionsOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setVersionsOpen(false)
      versionButtonRef.current?.focus()
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [versionsOpen])

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

  useEffect(() => {
    if (openMenu !== 'move') return
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setOpenMenu(null)
      moveButtonRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openMenu])

  const moveSelected = (status) => {
    setTriageStatusesByVersion((previous) => ({ ...previous, [selectedVersion]: { ...previous[selectedVersion], ...Object.fromEntries([...selected].map((id) => [id, status])) } }))
    setOpenedIssueId(null)
    setSelected(new Set())
    setOpenMenu(null)
  }

  const togglePending = (key, option) => {
    setPendingFilters((prev) => {
      const current = prev[key] ?? []
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option]
      return { ...prev, [key]: next }
    })
  }

  const isTopIssues = filterCategories.every(({ key }) => {
    const expected = topIssuesFilters[key] ?? []
    const actual = appliedFilters[key] ?? []
    return actual.length === expected.length && expected.every((value) => actual.includes(value))
  })
  const view = isTriage && triageGroup ? triageGroup : isTopIssues ? 'top' : Object.values(appliedFilters).every((values) => values.length === 0) ? 'all' : 'custom'
  const setView = (next) => {
    setOpenedIssueId(null)
    setTriageGroup(isTriage && ['Confirmed', 'Accepted'].includes(next) ? next : null)
    setOpenMenu(null)
    const filters = next === 'top' ? topIssuesFilters : ['Confirmed', 'Accepted'].includes(next) ? { status: [next] } : {}
    setAppliedFilters(filters)
    setPendingFilters(filters)
    setSelected(new Set())
  }

  const pendingCount = Object.values(pendingFilters).flat().length
  const appliedCount = Object.values(appliedFilters).flat().length

  const filtered = useMemo(() => {
    const source = isTriage ? issues.map((issue) => triageStatuses[issue.id] ? { ...issue, status: triageStatuses[issue.id] } : issue) : issues
    const base = source.filter((issue) =>
      matchesFilters(issue, appliedFilters) &&
      (!isTriage || (triageGroup ? triageStatuses[issue.id] === triageGroup : !isTopIssues || !triageStatuses[issue.id]))
    )
    const sorted = [...base].sort((a, b) => {
      if (sortBy === 'Filename') return a.file.localeCompare(b.file)
      if (sortBy === 'Creation date') return b.createdRank - a.createdRank
      return (
        severityRank[a.severity] - severityRank[b.severity] ||
        qualityRank[a.quality] - qualityRank[b.quality]
      )
    })
    return isTopTenVersion && isTopIssues ? sorted.slice(0, 10) : sorted
  }, [sortBy, appliedFilters, isTopTenVersion, isTopIssues, isTriage, triageGroup, triageStatuses])

  const openFilters = () => {
    setPendingFilters(appliedFilters)
    setOpenMenu(openMenu === 'filters' ? null : 'filters')
  }

  const openedIssue = isMoonshot ? filtered.find((issue) => issue.id === openedIssueId) : null
  const category = filterCategories.find((c) => c.key === activeCategory)
  const topIssues = issues.filter((issue) => matchesFilters(issue, topIssuesFilters))
  const effortMinutes = filtered.reduce((total, issue) => {
    const amount = Number.parseInt(issue.effort, 10)
    return total + amount * (issue.effort.includes('h') ? 60 : 1)
  }, 0)
  const effortLabel = effortMinutes === 0 ? '0min effort' : `${Math.floor(effortMinutes / 60) ? `${Math.floor(effortMinutes / 60)}h ` : ''}${effortMinutes % 60 ? `${effortMinutes % 60}min ` : ''}effort`
  const toggleFacet = (key, option) => {
    setAppliedFilters((previous) => {
      const current = previous[key] ?? []
      return { ...previous, [key]: current.includes(option) ? current.filter((value) => value !== option) : [...current, option] }
    })
    setSelected(new Set())
  }

  return (
    <div className="app-shell">
      <TopNav theme={theme} />
      <div className="app-body">
        {!isMoonshot && <Sidebar />}
        <main className={`main-content ${isFacet ? 'facet-version' : ''} ${isMoonshot ? 'moonshot-version' : ''} ${openedIssue ? 'has-issue-details' : ''}`}>
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

          <div className="issue-workspace">
          {isMoonshot && <nav className="moonshot-folders" aria-label="Issue folders">
            {[
              { key: 'top', label: 'Top 10 issues', icon: Flame, count: Math.min(10, issues.filter((issue) => matchesFilters(issue, topIssuesFilters) && !triageStatuses[issue.id]).length) },
              { key: 'Confirmed', label: 'Confirmed', icon: CircleCheck, count: Object.values(triageStatuses).filter((status) => status === 'Confirmed').length },
              { key: 'Accepted', label: 'Accepted', icon: ShieldCheck, count: Object.values(triageStatuses).filter((status) => status === 'Accepted').length },
              { key: 'all', label: 'All issues', icon: Layers, count: issues.length },
            ].map((folder) => <div key={folder.key}>
              {['Confirmed', 'all'].includes(folder.key) && <div className="moonshot-folder-divider" role="separator" />}
              <button className={`moonshot-folder ${view === folder.key ? 'active' : ''}`} aria-current={view === folder.key ? 'page' : undefined} onClick={() => setView(folder.key)}><folder.icon size={18} /><span>{folder.label}</span>{folder.count > 0 && <span className="issue-count-badge">{folder.count}</span>}</button>
            </div>)}
          </nav>}
          {isFacet && (
            <aside className="filter-facets" aria-label="Issue filters">
              <div className="facet-header">
                <strong>Filters</strong>
                <button className="filter-chip" onClick={() => { setAppliedFilters({}); setPendingFilters({}); setSelected(new Set()) }}>Clear all filters</button>
              </div>
              {filterCategories.map((facet) => {
                const values = appliedFilters[facet.key] ?? []
                const expanded = expandedFacets.includes(facet.key)
                const counts = countsFor(facet.options, facet.field)
                return (
                  <section className="facet-section" key={facet.key}>
                    <div className="facet-heading">
                      <button aria-expanded={expanded} onClick={() => setExpandedFacets((previous) => expanded ? previous.filter((key) => key !== facet.key) : [...previous, facet.key])}>
                        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        {facet.label}
                        {values.length > 0 && <span className="category-count">{values.length}</span>}
                      </button>
                      {values.length > 0 && <button className="facet-clear" aria-label={`Clear ${facet.label}`} onClick={() => { setAppliedFilters((previous) => ({ ...previous, [facet.key]: [] })); setSelected(new Set()) }}><X size={12} /></button>}
                    </div>
                    {expanded && <div className="facet-options">
                      {facet.options.map((option) => (
                        <button key={option} className={`facet-option ${values.includes(option) ? 'active' : ''}`} aria-pressed={values.includes(option)} onClick={() => toggleFacet(facet.key, option)}>
                          {option in severityRank && <SeverityIcon severity={option} size={13} />}
                          <span>{option}</span><span className="facet-count">{counts[option]}</span>
                        </button>
                      ))}
                    </div>}
                  </section>
                )
              })}
            </aside>
          )}
          <div className="issue-results">
          {isMoonshot && <h2 className="moonshot-list-heading">{view === 'top' ? 'Top 10 issues' : view === 'all' ? 'All issues' : triageGroup ? `${triageGroup} issues` : 'Filtered issues'}</h2>}
          {isFacet && (
            <div className="facet-top">
              <div className="facet-open-title"><h2>Open Issues</h2><button onClick={() => setView('all')}>View all <ChevronRight size={12} /></button></div>
              <button className={`top-issues-tab ${view === 'top' ? 'active' : ''}`} aria-pressed={view === 'top'} onClick={() => setView('top')}>
                <span className="top-issues-tab-title"><Flame size={14} color="#FF5200" fill="#FF5200" /> Top issues <span className="issue-count-badge">{topIssues.length}</span></span>
                <span className="top-issues-tab-meta">Security {topIssues.filter((issue) => issue.quality === 'Security').length} <span>|</span> Reliability {topIssues.filter((issue) => issue.quality === 'Reliability').length}</span>
              </button>
            </div>
          )}
          {!isFacet && (!isMoonshot || (view === 'all' && filtered.length > 0)) && <div className={`toolbar ${isTriage ? 'triage-toolbar' : ''}`}>
            {!isMoonshot && <div className={`quick-filters ${selectedVersion === 'exploration-v1' || selectedVersion === 'exploration-v2' ? 'exploration-quick-filters' : ''}`}>
              <button
                className={`quick-chip ${view === 'top' ? 'active' : ''}`}
                onClick={() => setView('top')}
              >
                <Flame size={14} color="#FF5200" fill="#FF5200" />
                {isTopTenVersion ? 'Top 10 issues' : <>Top issues <span className="issue-count-badge">{topIssues.length}</span></>}
              </button>
              {isTriage && <div className="triage-status-tabs" role="group" aria-label="Triaged issues">
                {['Confirmed', 'Accepted'].map((status) => <button key={status} className={`quick-chip ${view === status ? 'active' : ''}`} aria-pressed={view === status} onClick={() => setView(status)}>{status}<span className="issue-count-badge">{Object.values(triageStatuses).filter((value) => value === status).length}</span></button>)}
              </div>}
              <button
                className={`quick-chip ${view === 'all' ? 'active' : ''}`}
                onClick={() => setView('all')}
              >
                <Layers size={14} />
                All <span className={isTopTenVersion ? 'quick-count' : 'issue-count-badge'}>{issues.length}</span>
              </button>
            </div>}

            {view === 'all' && <div className="toolbar-right">
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
            </div>}
          </div>}

          {usesInlineBulk && (
            <div className={`facet-bulk-toolbar ${!isFacet ? 'exploration-bulk-toolbar' : ''}`}>
              <div className="facet-bulk-actions">
                <h2 className="bulk-selection-heading">{selected.size > 0 ? `${selected.size} selected` : 'Select issues for bulk actions'}</h2>
                <div className="facet-bulk-buttons">
                  <input type="checkbox" className="issue-checkbox" aria-label="Select all visible issues" checked={filtered.length > 0 && filtered.every((issue) => selected.has(issue.id))} onChange={(event) => setSelected(event.target.checked ? new Set(filtered.map((issue) => issue.id)) : new Set())} />
                  <button className="bulk-change" disabled={selected.size === 0}>Change</button>
                  <button className="bulk-assign" disabled={selected.size === 0}><Sparkles size={14} />Assign to Agent</button>
                  <Info size={13} aria-label="Bulk actions apply to selected issues" />
                </div>
              </div>
              <div className="facet-issue-summary">
                <button className="icon-btn" aria-label="Refresh issues" onClick={() => { setSelected(new Set()); setOpenMenu(null) }}><RefreshCw size={15} /></button>
                <span>{filtered.length} issues <strong>{effortLabel}</strong></span>
              </div>
            </div>
          )}

          {openMenu === 'filters' && !isFacet && (
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
                      {option in severityRank && (
                        <SeverityIcon severity={option} size={14} />
                      )}
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
            {!isMoonshot && <h2 className="section-title">
              {isFacet ? (view === 'top' ? 'Viewing top issues' : view === 'all' ? 'Viewing all issues' : 'Viewing filtered issues') : (view === 'top' ? (isTopTenVersion ? 'Top 10 issues' : 'Top issues') : view === 'all' ? 'All issues' : isTriage && triageGroup ? `${triageGroup} issues` : 'Filtered issues')}
            </h2>}
            {!isFacet && (!isMoonshot || filtered.length > 0) && <div className="section-subtitle-row">
              <label className="section-subtitle">
                {!usesInlineBulk && <input
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
                />}
                {view === 'top'
                  ? (isTopTenVersion ? 'Showing top 10 Security and Reliability issues with Blocker, High, or Medium severity, highest severity first.' : 'Showing Security and Reliability issues with Blocker, High, or Medium severity, highest severity first.')
                  : view === 'all' ? 'Showing all issues in this project.' : 'Showing issues matching the selected filters.'}
              </label>
            </div>}

            <div className="issue-list">
              {filtered.length > 0 ? (
                filtered.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    fileOutside={isFacet}
                    active={isMoonshot && openedIssueId === issue.id}
                    onOpen={isMoonshot ? () => setOpenedIssueId(issue.id) : undefined}
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
                  {!isMoonshot && <CircleAlert size={32} />}
                  <p>{isTriage && triageGroup ? `You haven't ${triageGroup.toLowerCase()} any issues here yet.` : 'No issues match the current filters.'}</p>
                  {isMoonshot ? <button className="apply-filters" onClick={() => setView('top')}>View top issues to fix</button> : isTriage && triageGroup ? <button className="clear-filters" onClick={() => setView('all')}>View all issues</button> : <button
                    className="clear-filters"
                    onClick={() => {
                      setAppliedFilters({})
                      setPendingFilters({})
                    }}
                  >
                    Clear filters
                  </button>}
                </div>
              )}
            </div>
          </div>
          </div>
          {openedIssue && <IssueDetails key={openedIssue.id} issue={openedIssue} onClose={() => {
            setOpenedIssueId(null)
            requestAnimationFrame(() => document.querySelector(`[data-issue-id="${openedIssue.id}"] .issue-open-button`)?.focus())
          }} />}
          </div>
        </main>
      </div>

      {versionsVisible && (
        <div className="version-switcher" ref={versionSwitcherRef}>
          {versionsOpen && (
            <div
              id="version-picker"
              className="version-picker"
              role="region"
              aria-label={themeSettingsOpen ? 'Settings' : 'Prototype versions'}
              ref={versionPickerRef}
            >
              <div className="version-picker-header">
                {themeSettingsOpen ? (
                  <div className="settings-page-title"><button className="icon-btn" aria-label="Back to versions" onClick={() => { setThemeSettingsOpen(false); requestAnimationFrame(() => versionPickerRef.current?.querySelector('[aria-label="Theme settings"]')?.focus()) }}><ArrowLeft size={16} /></button><strong>Settings</strong></div>
                ) : <><strong>Prototype versions</strong><button className="icon-btn" aria-label="Theme settings" onClick={() => { setThemeSettingsOpen(true); requestAnimationFrame(() => versionPickerRef.current?.querySelector('[aria-label="Back to versions"]')?.focus()) }}><Settings size={16} /></button></>}
              </div>
              {themeSettingsOpen && (
                <section className="theme-settings" id="theme-settings" aria-labelledby="theme-settings-title">
                  <h2 className="version-group-title" id="theme-settings-title">Theme</h2>
                  <div className="theme-options" role="group" aria-label="Theme">
                    {['dark', 'light'].map((option) => (
                      <button key={option} className="theme-option" aria-pressed={theme === option} onClick={() => setTheme(option)}>{option === 'dark' ? 'Dark' : 'Light'}{theme === option && <Check size={14} aria-hidden="true" />}</button>
                    ))}
                  </div>
                </section>
              )}
              {!themeSettingsOpen && versionGroups.map((group) => (
                <section className="version-group" key={group.id} aria-labelledby={`version-group-${group.id}`}>
                  <h2 id={`version-group-${group.id}`} className="version-group-title">{group.label}</h2>
                  {group.versions.map((version) => (
                    <button
                      key={version.id}
                      className="version-option"
                      aria-pressed={selectedVersion === version.id}
                      onClick={() => {
                        setSelectedVersion(version.id)
                        setOpenedIssueId(null)
                        if (version.id === 'facet-v1' || version.id === 'triaging-v1' || version.id === 'moonshot-v1') {
                          setView('top')
                          setSortBy('Severity')
                        }
                        setOpenMenu(null)
                        setSelected(new Set())
                        setVersionsOpen(false)
                        versionButtonRef.current?.focus()
                      }}
                    >
                      <span>{version.label}</span>
                      {selectedVersion === version.id && <Check size={14} aria-hidden="true" />}
                    </button>
                  ))}
                </section>
              ))}
            </div>
          )}
          <button
            ref={versionButtonRef}
            className="version-fab"
            aria-label="Prototype versions"
            aria-expanded={versionsOpen}
            aria-controls={versionsOpen ? 'version-picker' : undefined}
            onClick={() => setVersionsOpen((open) => !open)}
          >
            V
          </button>
        </div>
      )}

      {selected.size > 0 && !usesInlineBulk && (!isMoonshot || filtered.length > 0) && (
        <div className="bulk-bar">
          <span className="bulk-count">{selected.size} selected</span>
          <button className="bulk-cancel" onClick={() => setSelected(new Set())}>
            Cancel all
          </button>
          {isTriage ? <div className="filter-dropdown triage-move-picker">
            <button ref={moveButtonRef} className="bulk-change" aria-expanded={openMenu === 'move'} aria-controls={openMenu === 'move' ? 'triage-move-options' : undefined} onClick={() => setOpenMenu(openMenu === 'move' ? null : 'move')}>Move to <ChevronDown size={14} /></button>
            {openMenu === 'move' && <div id="triage-move-options" className="filter-menu triage-move-menu" aria-label="Move selected issues">
              <button className="filter-option" onClick={() => moveSelected('Confirmed')}>Confirmed</button>
              <button className="filter-option" onClick={() => moveSelected('Accepted')}>Accept</button>
            </div>}
          </div> : <button className="bulk-change">Change</button>}
          <button className="bulk-assign">
            <Sparkles size={14} />
            Assign to Agent
          </button>
        </div>
      )}
    </div>
  )
}

export default App
