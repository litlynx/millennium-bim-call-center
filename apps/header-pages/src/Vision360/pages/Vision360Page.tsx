import React from 'react';
import { Helmet } from 'react-helmet';
import ChannelsAndServices from 'src/Vision360/components/ChannelsAndServices/ChannelsAndServices';

const LazyEstateAndProducts = React.lazy(() =>
  import('../../components/Cards/EstateAndProducts/EstateAndProducts').catch(() => ({
    default: () => (
      <div className="bg-white rounded-lg p-4 text-center text-red-500">
        Failed to load Estate and Products component
      </div>
    )
  }))
);

export default function Vision360Page() {
  return (
    <>
      <Helmet>
        <title>Visão 360</title>
      </Helmet>
      <div className="grid grid-cols-24 grid-rows-10 gap-4 px-4 py-5 rounded-lg bg-gray-100 w-full h-full overflow-y-auto">
        {/* Personal Data */}
        <div className="row-span-10 col-span-5"></div>

        {/* Estate and Products */}
        <div className="col-start-6 col-span-12 row-span-5">
          <LazyEstateAndProducts />
        </div>

        {/* Last Contact */}
        <div className="col-start-16 col-span-7 row-span-5"></div>

        {/* Channels and Services */}
        <div className="col-start-6 col-span-12 row-span-5 row-start-6">
          <ChannelsAndServices />
        </div>

        {/* Incidents */}
        <div className="col-start-16 col-span-7 row-start-6 row-span-5"></div>
      </div>
    </>
  );
}
