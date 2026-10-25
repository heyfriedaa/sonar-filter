import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, X } from 'lucide-react'
import { SeverityIcon } from './SeverityIcon'

const tabs = ['Where is the issue?', 'Why is this an issue?', 'Activity', 'More info']

export function IssueDetails({ issue, onClose }) {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const closeRef = useRef(null)
  const tabRefs = useRef([])
  const lineNumber = Number.parseInt(issue.line.slice(1), 10)
  const source = [
    'export function handleRequest(input) {',
    '  const value = input.value',
    '  return processValue(value)',
    '}',
  ]

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  return (
    <aside className="issue-details" aria-labelledby="issue-details-title" onKeyDown={(event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }}>
      <header className="issue-details-header">
        <button ref={closeRef} className="icon-btn" aria-label="Back to issue list" onClick={onClose}><ArrowLeft size={18} /></button>
        <h2 id="issue-details-title">{issue.title}</h2>
        <button className="icon-btn" aria-label="Close issue details" onClick={onClose}><X size={18} /></button>
      </header>
      <div className="issue-details-status"><span>{issue.type}</span><span className="responsibility-tag">{issue.status}</span></div>
      <div className="issue-details-tabs" role="tablist" aria-label="Issue details">
        {tabs.map((tab, index) => <button
          key={tab}
          ref={(element) => { tabRefs.current[index] = element }}
          id={`detail-tab-${index}`}
          role="tab"
          aria-selected={activeTab === tab}
          aria-controls="issue-detail-panel"
          tabIndex={activeTab === tab ? 0 : -1}
          onClick={() => setActiveTab(tab)}
          onKeyDown={(event) => {
            if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
            event.preventDefault()
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
            setActiveTab(tabs[next])
            tabRefs.current[next]?.focus()
          }}
        >{tab}</button>)}
      </div>
      <div className="issue-details-body">
        <section id="issue-detail-panel" className="issue-detail-panel" role="tabpanel" aria-labelledby={`detail-tab-${tabs.indexOf(activeTab)}`} tabIndex={0}>
          {activeTab === tabs[0] && <>
            <div className="source-preview-header"><span className="issue-file">{issue.file}</span><span>{issue.line}</span></div>
            <p className="source-preview-note">Illustrative source preview · prototype data</p>
            <pre className="source-preview"><code>{source.map((line, index) => <span key={index} className={index === 1 ? 'source-line affected' : 'source-line'}><span className="source-line-number">{Math.max(1, lineNumber - 1) + index}</span><span>{line}</span></span>)}</code></pre>
            <div className="issue-location-message"><strong>{issue.line}</strong><p>{issue.title}</p></div>
          </>}
          {activeTab === tabs[1] && <><h3>About this issue</h3><p>{issue.title}</p><p>This issue affects {issue.quality.toLowerCase()} and has {issue.severity.toLowerCase()} severity. Review the affected code and its inputs before deciding whether to fix, confirm, or accept it.</p><p>Detailed rule guidance is not included in this prototype.</p></>}
          {activeTab === tabs[2] && <><h3>Activity</h3><dl className="detail-facts"><dt>Detected</dt><dd>{issue.timeAgo}</dd><dt>Current status</dt><dd>{issue.status}</dd><dt>Comments</dt><dd>{issue.comments}</dd></dl></>}
          {activeTab === tabs[3] && <><h3>Issue information</h3><dl className="detail-facts"><dt>Issue ID</dt><dd>{issue.id}</dd><dt>File</dt><dd>{issue.file}</dd><dt>Type</dt><dd>{issue.type}</dd><dt>Created</dt><dd>{issue.timeAgo}</dd></dl></>}
        </section>
        <div className="issue-detail-metadata">
          <section><h3>Assignee</h3><p>{issue.assignee}</p></section>
          <section><h3>Software quality impacts</h3><span className={`severity-pill severity-pill-${issue.severity.toLowerCase()}`}><span className="severity-category">{issue.quality}</span><span className="severity-value"><SeverityIcon severity={issue.severity} size={13} />{issue.severity}</span></span></section>
          <section><h3>Code attribute</h3><span className="responsibility-tag">{issue.responsibility}</span></section>
          <section><h3>Tags</h3><p>{issue.tags.length ? issue.tags.join(', ') : 'No tags'}</p></section>
          <section><h3>Line affected</h3><p>{issue.line}</p></section>
          <section><h3>Effort</h3><p>{issue.effort}</p></section>
        </div>
      </div>
    </aside>
  )
}
