import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Panel } from '../components/Panel'
import { ResponseBox } from '../components/ResponseBox'
import { getUserRole, ROLE_LABELS } from '../config/navigation'
import { useApiCall } from '../hooks/useApiCall'

const ROLES_CREATE = ['GERENTE', 'ADMIN']

export default function ProdutosPage() {
  const { tokens, user } = useAuth()
  const listApi = useApiCall()
  const createApi = useApiCall()

  const role = getUserRole(user)
  const canCreate = !role || ROLES_CREATE.includes(role)

  const [form, setForm] = useState({
    nome: 'X-Burguer',
    descricao: 'Hamburguer com queijo',
    preco: '18.90',
    categoria: 'LANCHE',
    ativo: true,
  })

  const handleCreate = () =>
    createApi.call('/produtos/', 'POST', {
      ...form,
      preco: parseFloat(form.preco),
    })

  return (
    <div className="page-stack">
      <section className="hero">
        <div>
          <span className="hero-kicker">Gestao de cardapio</span>
          <h2>Monte um cardapio com mais cara de vitrine e menos cara de API.</h2>
          <p>Cadastre lanches, bebidas e combos com uma organizacao mais clara para o dia a dia.</p>
        </div>
      </section>

      {!tokens.access && <div className="notice notice-warn">Autenticacao necessaria para a maioria das acoes.</div>}

      <Panel method="GET" title="Listar produtos do cardapio" tag="auth">
        <button onClick={() => listApi.call('/produtos/')} disabled={listApi.loading || !tokens.access}>
          Listar produtos
        </button>
        <ResponseBox result={listApi.result} loading={listApi.loading} />
      </Panel>

      <Panel method="POST" title="Cadastrar novo produto" tag="restricted">
        {!canCreate && (
          <div className="notice notice-warn">
            Seu perfil ({ROLE_LABELS[role] || role}) nao pode criar produtos.
          </div>
        )}

        <div className="grid-2">
          <div className="field">
            <label>Nome</label>
            <input value={form.nome} onChange={event => setForm(data => ({ ...data, nome: event.target.value }))} />
          </div>

          <div className="field">
            <label>Preco</label>
            <input value={form.preco} onChange={event => setForm(data => ({ ...data, preco: event.target.value }))} />
          </div>

          <div className="field">
            <label>Categoria</label>
            <select value={form.categoria} onChange={event => setForm(data => ({ ...data, categoria: event.target.value }))}>
              <option>LANCHE</option>
              <option>BEBIDA</option>
              <option>SOBREMESA</option>
              <option>ACOMPANHAMENTO</option>
              <option>COMBO</option>
            </select>
          </div>

          <div className="field">
            <label>Ativo</label>
            <select value={form.ativo ? 'true' : 'false'} onChange={event => setForm(data => ({ ...data, ativo: event.target.value === 'true' }))}>
              <option value="true">Sim</option>
              <option value="false">Nao</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label>Descricao</label>
          <textarea value={form.descricao} onChange={event => setForm(data => ({ ...data, descricao: event.target.value }))} style={{ minHeight: 60 }} />
        </div>

        <button className="primary" onClick={handleCreate} disabled={createApi.loading || !tokens.access || !canCreate}>
          Criar produto
        </button>

        <ResponseBox result={createApi.result} loading={createApi.loading} />
      </Panel>
    </div>
  )
}
