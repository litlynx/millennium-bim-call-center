import type * as React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from 'shared/components';

const Root: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Root title</title>
      </Helmet>
      <div>Just a root page</div>
      <Button onClick={() => alert('Button clicked!')}>Click me</Button>
    </>
  );
};

export default Root;
