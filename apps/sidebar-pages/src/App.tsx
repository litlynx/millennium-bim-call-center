import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Spinner from './components';

const HomePage = lazy(() => import('./Home/pages/HomePage'));

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route index element={<HomePage />} />
      </Routes>
    </Suspense>
  );
}
