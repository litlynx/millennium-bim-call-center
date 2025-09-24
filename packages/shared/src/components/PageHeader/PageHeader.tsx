import type { FC, ReactNode } from 'react';

interface PageHeaderComponentProps {
  leftBlock: ReactNode;
  rightBlock: ReactNode;
}

const PageHeaderComponent: FC<PageHeaderComponentProps> = ({ leftBlock, rightBlock }) => {
  return (
    <div className="mb-2 sticky top-0 left-0 right-0 z-10">
      <div className="relative bg-gradient-to-r from-primary-500 to-[#A03996] text-white p-1 rounded-t-[20px] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-yellow-400 after:via-yellow-400 after:to-transparent">
        <div className="flex items-start px-[1.375rem] py-[0.5rem]">
          <div className="flex-1 text-left">{leftBlock}</div>
          <div className="flex-1 text-right">{rightBlock}</div>
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
              <p className="font-semibold pb-[0.6875rem] uppercase">{props.channelCategory}</p>
              <h4 className="font-semibold">{props.serviceTitle}</h4>
            </>
          }
          rightBlock={
            <>
              <p className="font-medium">{props.customerName}</p>
              <p className="font-medium">CIF: {props.cif}</p>
              <p className="font-medium">Nº Conta: {props.accountNumber}</p>
            </>
          }
        />
      );
  }
}

// Export types for use in other components
export type { ChannelAndServiceProps, PageHeaderProps };
