export default function ComplainsAndIncidents() {
  const isParamsTrue = new URLSearchParams(window.location.search).get('details') === 'true';

  return (
    <div className="p-4">
      {isParamsTrue ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Detalhe de reclamações e incidentes</h1>
          <p>Aqui estão os detalhes do reclamações e incidentes...</p>
        </>
      ) : (
        <p>Sem detalhes disponíveis.</p>
      )}
    </div>
  );
}
