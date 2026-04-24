import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Panel } from '../components/Panel'
import { ResponseBox } from '../components/ResponseBox'
import { useApiCall } from '../hooks/useApiCall'

export default function FidelidadePage() {
  const { tokens } = useAuth()
  const saldoApi = useApiCall()
  const historicoApi = useApiCall()
  const resgateApi = useApiCall()
  const consentApi = useApiCall()

  const [resgateForm, setResgateForm] = useState({ pontos: '100', descricao: 'Resgate de pontos' })
  const [consentForm, setConsentForm] = useState({ aceita_programa: true })

  return (
    <div className="page-stack">
      <section className="hero">
        <div>
          <span className="hero-kicker">Relacionamento com cliente</span>
          <h2>Consulte saldo, historico e resgates em uma area mais acolhedora.</h2>
          <p>O modulo de fidelidade agora conversa melhor com a proposta de um app de comida.</p>
        </div>
      </section>

      {!tokens.access && <div className="notice notice-warn">Autenticacao necessaria para acessar a fidelidade.</div>}

      <Panel method="GET" title="Consultar saldo" tag="auth">
        <button onClick={() => saldoApi.call('/fidelidade/saldo/')} disabled={saldoApi.loading || !tokens.access}>
          Ver saldo
        </button>
        <ResponseBox result={saldoApi.result} loading={saldoApi.loading} />
      </Panel>

      <Panel method="PATCH" title="Atualizar consentimento" tag="auth">
        <div className="field">
          <label>Aceita participar do programa</label>
          <select
            value={consentForm.aceita_programa ? 'true' : 'false'}
            onChange={event => setConsentForm({ aceita_programa: event.target.value === 'true' })}
          >
            <option value="true">Sim</option>
            <option value="false">Nao</option>
          </select>
        </div>

        <button onClick={() => consentApi.call('/fidelidade/saldo/', 'PATCH', consentForm)} disabled={consentApi.loading || !tokens.access}>
          Atualizar
        </button>

        <ResponseBox result={consentApi.result} loading={consentApi.loading} />
      </Panel>

      <Panel method="GET" title="Ver historico de pontos" tag="auth">
        <button onClick={() => historicoApi.call('/fidelidade/historico/')} disabled={historicoApi.loading || !tokens.access}>
          Ver historico
        </button>
        <ResponseBox result={historicoApi.result} loading={historicoApi.loading} />
      </Panel>

      <Panel method="POST" title="Resgatar pontos" tag="auth">
        <div className="grid-2">
          <div className="field">
            <label>Pontos</label>
            <input type="number" value={resgateForm.pontos} onChange={event => setResgateForm(data => ({ ...data, pontos: event.target.value }))} />
          </div>

          <div className="field">
            <label>Descricao</label>
            <input value={resgateForm.descricao} onChange={event => setResgateForm(data => ({ ...data, descricao: event.target.value }))} />
          </div>
        </div>

        <button
          className="primary"
          onClick={() => resgateApi.call('/fidelidade/resgates/', 'POST', {
            pontos: parseInt(resgateForm.pontos, 10),
            descricao: resgateForm.descricao,
          })}
          disabled={resgateApi.loading || !tokens.access}
        >
          Resgatar
        </button>

        <ResponseBox result={resgateApi.result} loading={resgateApi.loading} />
      </Panel>
    </div>
  )
}
