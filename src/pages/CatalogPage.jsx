import React, { useState } from 'react'
import { Panel } from '../components/Panel'
import { ResponseBox } from '../components/ResponseBox'
import { useApiCall } from '../hooks/useApiCall'

export default function CatalogPage() {
  const unidadesApi = useApiCall()
  const cardapioApi = useApiCall()
  const promoApi = useApiCall()
  const [unidadeId, setUnidadeId] = useState('1')

  return (
    <div className="page-stack">
      <section className="hero">
        <div>
          <span className="hero-kicker">Explorar menu e lojas</span>
          <h2>Uma entrada mais calorosa para consultar unidades, cardapio e promocoes.</h2>
          <p>Essa area continua publica, mas agora com cara de produto de restaurante.</p>
        </div>
      </section>

      <Panel method="GET" title="Listar unidades" tag="public">
        <button onClick={() => unidadesApi.call('/unidades/')} disabled={unidadesApi.loading}>
          Buscar unidades
        </button>
        <ResponseBox result={unidadesApi.result} loading={unidadesApi.loading} />
      </Panel>

      <Panel method="GET" title="Consultar cardapio da unidade" tag="public">
        <div className="flex-row">
          <div className="field">
            <label>ID da unidade</label>
            <input value={unidadeId} onChange={event => setUnidadeId(event.target.value)} />
          </div>

          <button onClick={() => cardapioApi.call(`/unidades/${unidadeId}/cardapio/`)} disabled={cardapioApi.loading || !unidadeId}>
            Ver cardapio
          </button>
        </div>

        <ResponseBox result={cardapioApi.result} loading={cardapioApi.loading} />
      </Panel>

      <Panel method="GET" title="Listar promocoes" tag="public">
        <button onClick={() => promoApi.call('/promocoes/')} disabled={promoApi.loading}>
          Ver promocoes
        </button>
        <ResponseBox result={promoApi.result} loading={promoApi.loading} />
      </Panel>
    </div>
  )
}
