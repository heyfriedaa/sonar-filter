import { ChevronDown, Clock, MessageSquare, Shield } from 'lucide-react';
import { SeverityIcon } from './SeverityIcon';

export function IssueCard({ issue, checked, onToggle }) {
  return (
    <div className={`issue-card ${checked ? 'selected' : ''}`}>
      <div className="issue-row issue-row-top">
        <input
          type="checkbox"
          className="issue-checkbox"
          aria-label={`Select issue ${issue.id}`}
          checked={checked ?? false}
          onChange={(e) => onToggle?.(e.target.checked)}
        />
        <div className="issue-meta">
          <span className="issue-file">&lt;&gt; {issue.file}</span>
        </div>
        <span className="responsibility-tag">{issue.responsibility}</span>
      </div>

      <h3 className="issue-title">{issue.title}</h3>

      <div className="issue-row issue-row-badges">
        <span className={`severity-pill severity-pill-${issue.severity.toLowerCase()}`}>
          {issue.security && <span className="severity-category">Security</span>}
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
          <button className="action-dropdown">
            {issue.status}
            <ChevronDown size={14} />
          </button>
          <button className="action-dropdown">
            {issue.assignee}
            <ChevronDown size={14} />
          </button>
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
          <span className="issue-type">
            <Shield size={14} />
            {issue.type}
          </span>
          <span className="issue-severity">
            <SeverityIcon severity={issue.severity} size={13} />
            {issue.severity}
          </span>
        </div>
      </div>
    </div>
  );
}
