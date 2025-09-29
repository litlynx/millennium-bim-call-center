import type * as React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import { Button } from 'shared/components';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <div>
        <div>Just a home page</div>
        <Button onClick={() => navigate('/vision-360')}>Go to Vision360</Button>
        <Button
          onClick={() => navigate('/records/digital-channels/mobile-banking/cancels-blocked')}
        >
          Go to Cancels Page
        </Button>
      </div>
    </>
  );
};

export default HomePage;
