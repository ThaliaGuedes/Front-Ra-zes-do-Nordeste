import React, { useState } from 'react'

export function ResponseBox({ result, loading }) {
  const [showPayload, setShowPayload] = useState(false)

  if (!result && !loading) return null

  const isOk = result?.ok
  const statusClass = loading ? 'status-loading' : isOk ? 'status-ok' : 'status-err'
  const statusText = loading ? 'Carregando...' : `${result.status} ${isOk ? 'Sucesso' : 'Erro'}`

  return (
    <div className="response-box">
      <div className="response-header">
        <span className={statusClass}>{statusText}</span>

        {result?.payload && (
          <button
            type="button"
            className="response-toggle"
            onClick={() => setShowPayload(value => !value)}
          >
            {showPayload ? 'Ocultar envio' : 'Ver envio'}
          </button>
        )}
      </div>

      {showPayload && result?.payload && (
        <pre className="response-pre response-pre-muted">
          {typeof result.payload === 'string'
            ? result.payload
            : JSON.stringify(result.payload, null, 2)}
        </pre>
      )}

      <pre className={`response-pre ${loading ? 'response-pre-loading' : isOk ? 'response-pre-ok' : 'response-pre-err'}`}>
        {loading
          ? '...'
          : typeof result?.data === 'string'
            ? result.data
            : JSON.stringify(result?.data, null, 2)}
      </pre>
    </div>
  )
}

export function TokenDisplay({ tokens }) {
  const [open, setOpen] = useState(false)

  if (!tokens?.access) return null

  return (
    <div className="token-box">
      <button className="token-toggle" type="button" onClick={() => setOpen(value => !value)}>
        {open ? 'Ocultar tokens' : 'Mostrar tokens'}
      </button>

      {open && (
        <div className="token-content">
          <div>
            <span className="token-label">Access:</span>
            <span>{tokens.access}</span>
          </div>
          <div>
            <span className="token-label">Refresh:</span>
            <span>{tokens.refresh || '-'}</span>
          </div>
        </div>
      )}
    </div>
  )
}
