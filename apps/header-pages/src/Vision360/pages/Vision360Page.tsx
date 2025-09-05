import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import { Button } from 'shared/components';

const LazyEstateAndProducts = React.lazy(() =>
  import('../../components/Cards/EstateAndProducts/EstateAndProducts').catch(() => ({
    default: () => (
      <div className="bg-white rounded-lg p-4 text-center text-red-500">
        Failed to load Estate and Products component
      </div>
    )
  }))
);

export default function Vision360Page() {
  const navigate = useNavigate();

  return (
    <div>
      <Helmet>
        <title>Call Center - Visao 360</title>
      </Helmet>
      <h1>Vision360 Page</h1>
      <LazyEstateAndProducts />
      <Button onClick={() => navigate('/')}>Go back to dashboard root</Button>
      <Button onClick={() => navigate('another-level')}>Go to sub-level route</Button>
    </div>
  );
}
