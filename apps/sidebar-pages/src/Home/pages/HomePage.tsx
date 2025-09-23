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
      <div>Just a root page</div>
      <Button onClick={() => navigate('/vision-360')}>Go to Vision360</Button>
    </>
  );
};

export default HomePage;
