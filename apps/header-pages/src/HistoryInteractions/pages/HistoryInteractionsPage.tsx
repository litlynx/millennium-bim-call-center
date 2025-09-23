export default function HistoryInteractionsPage() {
  const isParamsTrue = new URLSearchParams(window.location.search).get('details') === 'true';

  return (
    <div className="p-4">
      {isParamsTrue ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Detalhe de Histórico de Interacções</h1>
          <p>Aqui estão os detalhes do histórico de interacções...</p>
        </>
      ) : (
        <p>Sem detalhes disponíveis.</p>
      )}
    </div>
  );
}
