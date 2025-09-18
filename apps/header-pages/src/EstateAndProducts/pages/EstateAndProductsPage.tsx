export default function EstateAndProductsPage() {
  const isParamsTrue = new URLSearchParams(window.location.search).get('details') === 'true';

  return (
    <div className="p-4">
      {isParamsTrue ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Detalhe de património e produtos</h1>
          <p>Aqui estão os detalhes do património e produtos...</p>
        </>
      ) : (
        <p>Sem detalhes disponíveis.</p>
      )}
    </div>
  );
}
