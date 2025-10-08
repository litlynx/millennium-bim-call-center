import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Spinner from './components';

const Accesses = lazy(() => import('./DigitalChannels/MobileBanking/pages/Accesses'));
const CancelsBlocked = lazy(() => import('./DigitalChannels/MobileBanking/pages/CancelsBlocked'));
const TransactionalLimits = lazy(
  () => import('./DigitalChannels/MobileBanking/pages/TransactionalLimits')
);
const ApplicationErrors = lazy(
  () => import('./DigitalChannels/MobileBanking/pages/ApplicationErrors')
);

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="digital-channels/mobile-banking/accesses" element={<Accesses />} />
        <Route
          path="digital-channels/mobile-banking/cancels-blocked"
          element={<CancelsBlocked />}
        />
        <Route
          path="digital-channels/mobile-banking/transactional-limits"
          element={<TransactionalLimits />}
        />
        <Route
          path="digital-channels/mobile-banking/application-errors"
          element={<ApplicationErrors />}
        />
      </Routes>
    </Suspense>
  );
}
