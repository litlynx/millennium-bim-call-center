import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Spinner from './components';

const Accesses = lazy(() => import('./DigitalChannels/MobileBanking/pages/Accesses'));

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="mobile-banking/accesses" element={<Accesses />} />
      </Routes>
    </Suspense>
  );
}
