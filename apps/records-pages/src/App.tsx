import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Spinner from './components';

const Accesses = lazy(() => import('./DigitalChannels/MobileBanking/pages/Accesses'));

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="mobile-banking/accesses" element={<Accesses />} />
        <Route path="*" element={<div>Records Pages - No route matched</div>} />
      </Routes>
    </Suspense>
  );
}
