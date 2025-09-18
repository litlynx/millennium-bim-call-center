export default function PersonalDataPage() {
  const isParamsTrue = new URLSearchParams(window.location.search).get('details') === 'true';

  return (
    <div className="p-4">
      {isParamsTrue ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Detalhe de dados pessoais</h1>
          <p>Aqui estão os detalhes do dados pessoais...</p>
        </>
      ) : (
        <p>Sem detalhes disponíveis.</p>
      )}
    </div>
  );
}
