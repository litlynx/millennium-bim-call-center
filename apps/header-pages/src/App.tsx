import * as React from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import { Button } from 'shared/components';
import Spinner from './components';
import Vision360Page from './Vision360/pages/Vision360Page';

export default function App() {
  const navigate = useNavigate();

  return (
    <React.Suspense fallback={<Spinner />}>
      <Routes>
        {/* Index route for /vision360 */}
        <Route index element={<Vision360Page />} />
        {/* Sub-route under /vision360 */}
        <Route
          path="another-level"
          element={
            <div>
              <h1>Another Level</h1>
              <p>This is another level page.</p>
              <Button onClick={() => navigate('/vision360')}>Go to Vision 360 Page</Button>
            </div>
          }
        />
        <Route
          path="*"
          element={
            <div>
              <h1>Header Pages App</h1>
              <p>Welcome to the Header Pages application!</p>
            </div>
          }
        />
      </Routes>
    </React.Suspense>
  );
}
