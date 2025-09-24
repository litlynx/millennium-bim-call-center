import type { FC, ReactNode } from 'react';

interface PageHeaderComponentProps {
  leftBlock: ReactNode;
  rightBlock: ReactNode;
}

const PageHeaderComponent: FC<PageHeaderComponentProps> = ({ leftBlock, rightBlock }) => {
  return (
    <div className="mb-2 sticky top-0 left-0 right-0 z-10">
      {/* main gradient bar with rounded top corners */}
      <div className="relative bg-gradient-to-r from-[#D02A7B] to-[#A03996] text-white rounded-t-[20px]">
        {/* thin gold rule at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 rounded-b-[8px]" />

        <div className="flex items-start justify-between px-6 py-4">
          <div className="min-w-0">{leftBlock}</div>

          <div className="text-right flex-shrink-0">{rightBlock}</div>
        </div>
      </div>
    </div>
  );
};

type TemplateType = 'channelAndService';

interface BasePageHeaderTemplateProps {
  type: TemplateType;
}

// Props for 'channelAndService' template
interface ChannelAndServiceProps extends BasePageHeaderTemplateProps {
  type: 'channelAndService';
  channelCategory: string;
  serviceTitle: string;
  customerName: string;
  cif: string;
  accountNumber: string;
}

// Union type for all possible template props
type PageHeaderProps = ChannelAndServiceProps;

export default function PageHeader(props: PageHeaderProps) {
  switch (props.type) {
    case 'channelAndService':
      return (
        <PageHeaderComponent
          leftBlock={
            <>
              <p className="text-sm font-semibold uppercase tracking-wider opacity-90 pb-1">
                {props.channelCategory}
              </p>
              <h3 className="text-[1.375rem] font-extrabold leading-tight">{props.serviceTitle}</h3>
            </>
          }
          rightBlock={
            <>
              <p className="font-medium">{props.customerName}</p>
              <p className="text-sm">CIF: {props.cif}</p>
              <p className="text-sm">Nº Conta: {props.accountNumber}</p>
            </>
          }
        />
      );
  }
}

// Export types for use in other components
export type { ChannelAndServiceProps, PageHeaderProps };
