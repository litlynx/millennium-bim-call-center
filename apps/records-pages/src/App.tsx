import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Spinner from './components';

const Accesses = lazy(() => import('./DigitalChannels/MobileBanking/pages/Accesses'));
const CancelsBlocked = lazy(() => import('./DigitalChannels/MobileBanking/pages/CancelsBlocked'));

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="mobile-banking/accesses" element={<Accesses />} />
        <Route path="mobile-banking/cancels-blocked" element={<CancelsBlocked />} />
      </Routes>
    </Suspense>
  );
}
