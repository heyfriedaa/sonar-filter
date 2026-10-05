import { ChevronDown, CircleAlert, Clock, MessageSquare, Shield } from 'lucide-react';

export function IssueCard({ issue }) {
  return (
    <div className="issue-card">
      <div className="issue-row issue-row-top">
        <input type="checkbox" className="issue-checkbox" aria-label={`Select issue ${issue.id}`} />
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
            <CircleAlert size={12} fill="currentColor" />
            {issue.severity}
          </span>
        </span>
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
          <span className={`issue-severity severity-${issue.severity.toLowerCase()}`}>
            <CircleAlert size={12} fill="currentColor" />
            {issue.severity}
          </span>
        </div>
      </div>
    </div>
  );
}
