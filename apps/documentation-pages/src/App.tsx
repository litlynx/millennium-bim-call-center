import { Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import { Button } from 'shared/components';
import Spinner from './components';
import DocumentationPages from './pages/Root/Root';

export default function App() {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route index element={<DocumentationPages />} />
        <Route
          path="/*"
          element={
            <div>
              <h1>404</h1>
              <p>Page not found</p>
              <Button onClick={() => navigate('/')}>Go to Homepage</Button>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}
