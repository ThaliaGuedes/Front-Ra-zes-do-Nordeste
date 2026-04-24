import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Panel } from '../components/Panel'
import { ResponseBox } from '../components/ResponseBox'
import { useApiCall } from '../hooks/useApiCall'

export default function PedidosPage() {
  const { tokens } = useAuth()
  const listApi = useApiCall()
  const createApi = useApiCall()

  const [filters, setFilters] = useState({
    status: '',
    canalPedido: '',
    unidadeId: '',
  })

  const [createForm, setCreateForm] = useState({
    unidadeId: '1',
    canalPedido: 'BALCAO',
    itens: JSON.stringify([{ produtoId: 1, quantidade: 2, observacao: '' }], null, 2),
    observacao: '',
    usarPontos: false,
  })

  const handleList = () => {
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.canalPedido) params.set('canalPedido', filters.canalPedido)
    if (filters.unidadeId) params.set('unidadeId', filters.unidadeId)

    listApi.call(`/pedidos/${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const handleCreate = () => {
    let itens

    try {
      itens = JSON.parse(createForm.itens)
    } catch {
      alert('JSON de itens invalido')
      return
    }

    const unidadeId = parseInt(createForm.unidadeId, 10)
    if (Number.isNaN(unidadeId)) {
      alert('Unidade invalida')
      return
    }

    createApi.call('/pedidos/', 'POST', {
      unidadeId,
      canalPedido: createForm.canalPedido,
      itens,
      observacao: createForm.observacao,
      usarPontos: createForm.usarPontos,
    })
  }

  return (
    <div className="page-stack">
      <section className="hero">
        <div>
          <span className="hero-kicker">Fluxo de pedidos</span>
          <h2>Receba, filtre e crie pedidos com uma experiencia mais proxima da operacao real.</h2>
          <p>A area de pedidos continua funcional para clientes e equipe, mas com leitura mais amigavel.</p>
        </div>
      </section>

      {!tokens.access && <div className="notice notice-warn">Autenticacao necessaria para consultar ou criar pedidos.</div>}

      <Panel method="GET" title="Filtrar pedidos" tag="auth">
        <div className="grid-3">
          <div className="field">
            <label>Status</label>
            <select value={filters.status} onChange={event => setFilters(data => ({ ...data, status: event.target.value }))}>
              <option value="">Todos</option>
              <option>AGUARDANDO</option>
              <option>CONFIRMADO</option>
              <option>EM_PREPARO</option>
              <option>PRONTO</option>
              <option>ENTREGUE</option>
              <option>CANCELADO</option>
            </select>
          </div>

          <div className="field">
            <label>Canal</label>
            <select value={filters.canalPedido} onChange={event => setFilters(data => ({ ...data, canalPedido: event.target.value }))}>
              <option value="">Todos</option>
              <option>BALCAO</option>
              <option>APP</option>
              <option>DELIVERY</option>
              <option>TOTEM</option>
            </select>
          </div>

          <div className="field">
            <label>Unidade</label>
            <input value={filters.unidadeId} onChange={event => setFilters(data => ({ ...data, unidadeId: event.target.value }))} placeholder="Opcional" />
          </div>
        </div>

        <button onClick={handleList} disabled={listApi.loading || !tokens.access}>
          Buscar pedidos
        </button>

        <ResponseBox result={listApi.result} loading={listApi.loading} />
      </Panel>

      <Panel method="POST" title="Criar pedido" tag="auth">
        <div className="grid-2">
          <div className="field">
            <label>Unidade</label>
            <input value={createForm.unidadeId} onChange={event => setCreateForm(data => ({ ...data, unidadeId: event.target.value }))} />
          </div>

          <div className="field">
            <label>Canal</label>
            <select value={createForm.canalPedido} onChange={event => setCreateForm(data => ({ ...data, canalPedido: event.target.value }))}>
              <option>BALCAO</option>
              <option>APP</option>
              <option>DELIVERY</option>
              <option>TOTEM</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label>Itens em JSON</label>
          <textarea
            value={createForm.itens}
            onChange={event => setCreateForm(data => ({ ...data, itens: event.target.value }))}
            style={{ minHeight: 110 }}
          />
        </div>

        <div className="grid-2">
          <div className="field">
            <label>Observacao</label>
            <input value={createForm.observacao} onChange={event => setCreateForm(data => ({ ...data, observacao: event.target.value }))} />
          </div>

          <div className="field">
            <label>Usar pontos</label>
            <select value={createForm.usarPontos ? 'true' : 'false'} onChange={event => setCreateForm(data => ({ ...data, usarPontos: event.target.value === 'true' }))}>
              <option value="false">Nao</option>
              <option value="true">Sim</option>
            </select>
          </div>
        </div>

        <button className="primary" onClick={handleCreate} disabled={createApi.loading || !tokens.access}>
          Criar pedido
        </button>

        <ResponseBox result={createApi.result} loading={createApi.loading} />
      </Panel>
    </div>
  )
}
