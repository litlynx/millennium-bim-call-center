import { Card, Icon } from 'shared/components';

export default function EstateAndProductsSkeleton() {
  return (
    <Card
      icon={<Icon type="pieChart" className="bg-teal" />}
      title="Património e produtos"
      className="h-full"
    >
      <div className="grid grid-cols-2 divide-x divide-gray-200 animate-pulse">
        {[0, 1].map((col) => (
          <div key={col} className={col === 0 ? 'pr-4' : 'pl-4'}>
            <div className="flex justify-between items-center flex-wrap pb-[45px]">
              <div className="h-6 w-40 bg-gray-200 rounded" />
              <div className="flex items-baseline space-x-2">
                <div className="h-7 w-24 bg-gray-200 rounded" />
                <div className="h-5 w-10 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: just a skeleton component
                  key={i}
                  className={`flex justify-between items-center flex-wrap ${
                    i !== 3 ? 'border-b border-gray-200 pb-1' : ''
                  }`}
                >
                  <div className="h-5 w-56 bg-gray-200 rounded" />
                  <div className="h-5 w-12 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
