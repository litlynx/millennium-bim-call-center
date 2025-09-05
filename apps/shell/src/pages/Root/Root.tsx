import type * as React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import { Button } from 'shared/components';

const Root: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Root title</title>
      </Helmet>
      <div>Just a root page</div>
      <Button onClick={() => navigate('/vision360')}>Go to Vision360</Button>
    </>
  );
};

export default Root;
