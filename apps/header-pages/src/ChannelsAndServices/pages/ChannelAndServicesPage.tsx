export default function ChannelAndServicesPage() {
  const isParamsTrue = new URLSearchParams(window.location.search).get('details') === 'true';

  return (
    <div className="p-4">
      {isParamsTrue ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Channel and Services Details</h1>
          <p>Here are the details of the channels and services...</p>
        </>
      ) : (
        <p>No details available.</p>
      )}
    </div>
  );
}
