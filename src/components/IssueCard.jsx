import { useEffect, useState } from 'react';
import { ChevronDown, Clock, MessageSquare, Search } from 'lucide-react';
import { SeverityIcon } from './SeverityIcon';

const statusOptions = [
  {
    label: 'Accept',
    desc: "Won't fix immediately, but will no longer affect the quality gate",
  },
  { label: 'False positive', desc: 'Analysis is incorrect' },
  {
    label: 'Confirm',
    desc: 'Confirmation that the issue is valid. Issue impacts the quality gate',
  },
];

export function IssueCard({ issue, checked, onToggle }) {
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    if (!openMenu) return;
    const onMouseDown = (e) => {
      if (!e.target.closest('.issue-actions-dropdown')) setOpenMenu(null);
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [openMenu]);

  const assigned = issue.assignee !== 'Not assigned';

  return (
    <div className={`issue-card ${checked ? 'selected' : ''}`}>
      <input
        type="checkbox"
        className="issue-checkbox issue-checkbox-col"
        aria-label={`Select issue ${issue.id}`}
        checked={checked ?? false}
        onChange={(e) => onToggle?.(e.target.checked)}
      />
      <div className="issue-card-body">
      <div className="issue-row issue-row-top">
        <div className="issue-meta">
          <span className="issue-file">&lt;&gt; {issue.file}</span>
        </div>
        <span className="responsibility-tag">{issue.responsibility}</span>
      </div>

      <h3 className="issue-title">{issue.title}</h3>

      <div className="issue-row issue-row-badges">
        <span className={`severity-pill severity-pill-${issue.severity.toLowerCase()}`}>
          <span className="severity-category">{issue.quality}</span>
          <span className="severity-value">
            <SeverityIcon severity={issue.severity} size={13} />
            {issue.severity}
          </span>
        </span>
        {issue.tags.length > 0 && (
          <span className="issue-tags">{issue.tags.join(', ')} +</span>
        )}
      </div>

      <div className="issue-row issue-row-actions">
        <div className="issue-left-actions">
          <div className="issue-actions-dropdown">
            <button
              className="action-dropdown"
              onClick={() => setOpenMenu(openMenu === 'status' ? null : 'status')}
            >
              {issue.status}
              <ChevronDown size={14} />
            </button>
            {openMenu === 'status' && (
              <div className="card-menu">
                <div className="card-menu-title">Change issue status</div>
                {statusOptions.map((o) => (
                  <button
                    key={o.label}
                    className="card-menu-option"
                    onClick={() => setOpenMenu(null)}
                  >
                    <span className="card-menu-option-label">{o.label}</span>
                    <span className="card-menu-option-desc">{o.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="issue-actions-dropdown">
            <button
              className="action-dropdown"
              onClick={() =>
                setOpenMenu(openMenu === 'assignee' ? null : 'assignee')
              }
            >
              {assigned && (
                <span className="avatar-sm">{issue.assignee[0]}</span>
              )}
              {issue.assignee}
              <ChevronDown size={14} />
            </button>
            {openMenu === 'assignee' && (
              <div className="card-menu">
                <div className="card-menu-search">
                  <Search size={14} />
                  <input type="text" aria-label="Search assignee" />
                </div>
                <button
                  className="card-menu-option single"
                  onClick={() => setOpenMenu(null)}
                >
                  Not assigned
                </button>
                <button
                  className="card-menu-option single"
                  onClick={() => setOpenMenu(null)}
                >
                  <span className="avatar-sm">M</span>
                  Assign to me
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="issue-right-actions">
          <span className="issue-line">{issue.line}</span>
          <span className="issue-stat">
            <MessageSquare size={14} />
            {issue.comments} comments
          </span>
          <span className="issue-stat">
            <Clock size={14} />
            {issue.effort}
          </span>
          <span className="issue-time">{issue.timeAgo}</span>
        </div>
      </div>
      </div>
    </div>
  );
}
