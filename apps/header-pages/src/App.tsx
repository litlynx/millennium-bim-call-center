import { lazy, Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import { Button } from 'shared/components';
import Spinner from './components';

const ChannelAndServicesPages = lazy(
  () => import('./ChannelsAndServices/pages/ChannelAndServicesPage')
);
const Vision360Page = lazy(() => import('./Vision360/pages/Vision360Page'));
const LastContactsPage = lazy(() => import('./LastContacts/pages/LastContactsPage'));

export default function App() {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<Spinner />}>
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
        <Route path="/last-contacts" element={<LastContactsPage />} />
        <Route path="/channels-and-services" element={<ChannelAndServicesPages />} />
        <Route path="/vision-360" element={<Vision360Page />} />
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
