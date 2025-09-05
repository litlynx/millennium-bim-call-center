import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import { Button } from 'shared/components';

export default function Vision360Page() {
  const navigate = useNavigate();

  return (
    <div>
      <Helmet>
        <title>Call Center - Visao 360</title>
      </Helmet>
      <h1>Vision360 Page</h1>
      <Button onClick={() => navigate('/')}>Go back to dashboard root</Button>
      <Button onClick={() => navigate('another-level')}>Go to sub-level route</Button>
    </div>
  );
}
