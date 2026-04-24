import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Panel } from '../components/Panel'
import { ResponseBox, TokenDisplay } from '../components/ResponseBox'
import { useApiCall } from '../hooks/useApiCall'

export default function AuthPage() {
  const { tokens, saveTokens, setUser, user, baseUrl } = useAuth()
  const [mode, setMode] = useState('login')
  const [registerDone, setRegisterDone] = useState('')

  const [loginForm, setLoginForm] = useState({
    username: 'admin',
    password: 'admin123',
  })
  const loginApi = useApiCall()

  const handleLogin = async () => {
    const result = await loginApi.call('/auth/token/', 'POST', loginForm)

    if (result.ok && result.data?.access) {
      saveTokens(result.data.access, result.data.refresh)

      try {
        const meResponse = await fetch(`${baseUrl}/usuarios/me/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${result.data.access}`,
          },
        })

        if (meResponse.ok) {
          const meData = await meResponse.json()
          setUser(meData)
        }
      } catch {
        // The app-level bootstrapping effect will try again if needed.
      }
    }
  }

  const [regForm, setRegForm] = useState({
    username: 'testuser',
    password: 'Test@1234',
    email: 'test@test.com',
    role: 'CLIENTE',
    first_name: 'Teste',
    last_name: 'User',
  })
  const regApi = useApiCall()

  const handleRegister = async () => {
    const result = await regApi.call('/auth/register/', 'POST', regForm)

    if (result.ok) {
      setRegisterDone(`Conta criada para ${regForm.username}. Agora e so entrar.`)
      setLoginForm(form => ({ ...form, username: regForm.username, password: '' }))
      setMode('login')
    }
  }

  const [refreshToken, setRefreshToken] = useState('')
  const refreshApi = useApiCall()

  const handleRefresh = async () => {
    const tokenToUse = refreshToken || tokens.refresh
    if (!tokenToUse) return

    const result = await refreshApi.call('/auth/token/refresh/', 'POST', { refresh: tokenToUse })
    if (result.ok && result.data?.access) {
      saveTokens(result.data.access, result.data.refresh || tokens.refresh)
    }
  }

  const meApi = useApiCall()

  const handleMe = async () => {
    const result = await meApi.call('/usuarios/me/')
    if (result.ok) setUser(result.data)
  }

  return (
    <div className="page-stack">
      <section className="hero hero-auth">
        <div>
          <span className="hero-kicker">Conta e acesso</span>
          <h2>Entre para operar a lanchonete com o perfil certo.</h2>
          <p>
            O cadastro agora fica separado do login e, depois de criar a conta,
            a pessoa volta direto para a tela de entrada.
          </p>
        </div>
        <div className="hero-card">
          <strong>{tokens.access ? 'Sessao ativa' : 'Acesso rapido'}</strong>
          <span>{tokens.access ? 'Sua conta ja esta conectada.' : 'Escolha entre entrar ou criar uma conta.'}</span>
        </div>
      </section>

      <div className="auth-switch">
        <button
          type="button"
          className={mode === 'login' ? 'primary' : ''}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'primary' : ''}
          onClick={() => setMode('register')}
        >
          Registro
        </button>
      </div>

      {registerDone && <div className="notice notice-ok">{registerDone}</div>}

      <TokenDisplay tokens={tokens} />

      {mode === 'login' ? (
        <Panel method="POST" title="Entrar na plataforma" tag="public">
          <div className="grid-2">
            <div className="field">
              <label>Usuario</label>
              <input
                value={loginForm.username}
                onChange={event => setLoginForm(form => ({ ...form, username: event.target.value }))}
              />
            </div>

            <div className="field">
              <label>Senha</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={event => setLoginForm(form => ({ ...form, password: event.target.value }))}
              />
            </div>
          </div>

          <button className="primary" onClick={handleLogin} disabled={loginApi.loading}>
            {loginApi.loading ? 'Entrando...' : 'Entrar'}
          </button>

          <ResponseBox result={loginApi.result} loading={loginApi.loading} />
        </Panel>
      ) : (
        <Panel method="POST" title="Criar nova conta" tag="public">
          <div className="grid-2">
            <div className="field">
              <label>Usuario</label>
              <input
                value={regForm.username}
                onChange={event => setRegForm(form => ({ ...form, username: event.target.value }))}
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                value={regForm.email}
                onChange={event => setRegForm(form => ({ ...form, email: event.target.value }))}
              />
            </div>

            <div className="field">
              <label>Senha</label>
              <input
                type="password"
                value={regForm.password}
                onChange={event => setRegForm(form => ({ ...form, password: event.target.value }))}
              />
            </div>

            <div className="field">
              <label>Nome</label>
              <input
                value={regForm.first_name}
                onChange={event => setRegForm(form => ({ ...form, first_name: event.target.value }))}
              />
            </div>

            <div className="field">
              <label>Sobrenome</label>
              <input
                value={regForm.last_name}
                onChange={event => setRegForm(form => ({ ...form, last_name: event.target.value }))}
              />
            </div>

            <div className="field">
              <label>Perfil</label>
              <select
                value={regForm.role}
                onChange={event => setRegForm(form => ({ ...form, role: event.target.value }))}
              >
                <option>CLIENTE</option>
                <option>ATENDENTE</option>
                <option>COZINHA</option>
                <option>GERENTE</option>
                <option>ADMIN</option>
              </select>
            </div>
          </div>

          <button className="primary" onClick={handleRegister} disabled={regApi.loading}>
            Criar conta
          </button>

          <ResponseBox result={regApi.result} loading={regApi.loading} />
        </Panel>
      )}

      <Panel method="POST" title="Atualizar token da sessao" tag="auth">
        <div className="field">
          <label>Refresh token</label>
          <input
            value={refreshToken}
            onChange={event => setRefreshToken(event.target.value)}
            placeholder="Se ficar vazio, usamos o token salvo."
          />
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshApi.loading || (!tokens.refresh && !refreshToken)}
        >
          Renovar sessao
        </button>

        <ResponseBox result={refreshApi.result} loading={refreshApi.loading} />
      </Panel>

      <Panel method="GET" title="Dados da conta atual" tag="auth">
        {!tokens.access && <div className="notice notice-warn">Faca login para carregar o perfil.</div>}

        <button onClick={handleMe} disabled={!tokens.access || meApi.loading}>
          Carregar perfil
        </button>

        {user && (
          <div className="profile-summary">
            <span>{user.username}</span>
            <span>{user.perfil || user.role}</span>
            <span>{user.email}</span>
          </div>
        )}

        <ResponseBox result={meApi.result} loading={meApi.loading} />
      </Panel>
    </div>
  )
}
