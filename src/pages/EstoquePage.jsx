import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Panel } from '../components/Panel'
import { ResponseBox } from '../components/ResponseBox'
import { useApiCall } from '../hooks/useApiCall'

export default function EstoquePage() {
  const { tokens } = useAuth()

  const listApi = useApiCall()
  const movApi = useApiCall()
  const unidadeApi = useApiCall()

  const [unidades, setUnidades] = useState([])

  const [movForm, setMovForm] = useState({
    produtoId: '1',
    unidadeId: '',
    tipo: 'ENTRADA',
    quantidade: '10',
    motivo: 'Reposicao de estoque',
  })

  // 🔥 CARREGA UNIDADES AUTOMATICAMENTE
  useEffect(() => {
    const loadUnidades = async () => {
      const res = await unidadeApi.call('/unidades/')

      let data = []
      if (Array.isArray(res?.data)) data = res.data
      else if (Array.isArray(res?.data?.results)) data = res.data.results

      setUnidades(data)

      if (data.length > 0) {
        setMovForm(f => ({
          ...f,
          unidadeId: String(data[0].id),
        }))
      }
    }

    loadUnidades()
  }, [])

  // 🔄 MOVIMENTAÇÃO
  const handleMov = () => {
    const produtoId = parseInt(movForm.produtoId)
    const unidadeId = parseInt(movForm.unidadeId)
    const quantidade = parseInt(movForm.quantidade)

    if (!unidadeId) {
      alert('Selecione a unidade')
      return
    }

    movApi.call('/estoques/movimentacoes/', 'POST', {
      produto_id: produtoId,
      unidade_id: unidadeId,
      tipo: movForm.tipo,
      quantidade,
      motivo: movForm.motivo,
    })
  }

  return (
    <div>
      <div className="page-title">
        ESTOQUE <span>controle de estoque</span>
      </div>

      {/* MOVIMENTAÇÃO */}
      <Panel title="Registrar movimentacao" method="POST">

        <div className="grid-3">

          {/* PRODUTO */}
          <div className="field">
            <label>Produto ID</label>
            <input
              value={movForm.produtoId}
              onChange={e =>
                setMovForm(f => ({ ...f, produtoId: e.target.value }))
              }
            />
          </div>

          {/* UNIDADE */}
          <div className="field">
            <label>Unidade</label>
            <select
              value={movForm.unidadeId}
              onChange={e =>
                setMovForm(f => ({ ...f, unidadeId: e.target.value }))
              }
            >
              <option value="">Selecione</option>

              {unidades.map(u => (
                <option key={u.id} value={u.id}>
                  #{u.id} - {u.nome}
                </option>
              ))}
            </select>
          </div>

          {/* QUANTIDADE */}
          <div className="field">
            <label>Quantidade</label>
            <input
              type="number"
              value={movForm.quantidade}
              onChange={e =>
                setMovForm(f => ({ ...f, quantidade: e.target.value }))
              }
            />
          </div>

        </div>

        {/* TIPO */}
        <div className="field">
          <label>Tipo</label>
          <select
            value={movForm.tipo}
            onChange={e =>
              setMovForm(f => ({ ...f, tipo: e.target.value }))
            }
          >
            <option>ENTRADA</option>
            <option>SAIDA</option>
            <option>AJUSTE</option>
            <option>PERDA</option>
          </select>
        </div>

        {/* MOTIVO */}
        <div className="field">
          <label>Motivo</label>
          <input
            value={movForm.motivo}
            onChange={e =>
              setMovForm(f => ({ ...f, motivo: e.target.value }))
            }
          />
        </div>

        <button onClick={handleMov}>
          Registrar movimentacao
        </button>

        <ResponseBox result={movApi.result} loading={movApi.loading} />
      </Panel>
    </div>
  )
}