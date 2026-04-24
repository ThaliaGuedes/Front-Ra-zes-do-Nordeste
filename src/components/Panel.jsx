import React, { useState } from 'react'

export function Panel({ method, title, tag, children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <section className="panel">
      <button
        className="panel-header"
        type="button"
        onClick={() => setCollapsed(value => !value)}
      >
        <div className="panel-header-main">
          {method && <span className={`method method-${method}`}>{method}</span>}
          <span>{title}</span>
          {tag && <span className={`tag tag-${tag}`}>{tag}</span>}
        </div>
        <span className="panel-toggle">{collapsed ? '+' : '-'}</span>
      </button>

      {!collapsed && <div className="panel-body">{children}</div>}
    </section>
  )
}
