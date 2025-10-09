import type { FC, ReactNode } from 'react';
import AuthenticationBadge from '../AuthenticationBadge/AuthenticationBadge';

interface PageHeaderComponentProps {
  leftBlock: ReactNode;
  rightBlock: ReactNode;
}

const PageHeaderComponent: FC<PageHeaderComponentProps> = ({ leftBlock, rightBlock }) => {
  return (
    <div className="mb-2 z-10" data-testid="page-header-component">
      <div className="relative bg-gradient-to-r from-primary-500 to-[#A03996] text-white p-1 rounded-t-[20px] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-yellow-400 after:via-yellow-400 after:to-transparent">
        <div className="flex items-start px-[1.375rem] py-[0.5rem]">
          <div className="flex-1 text-left" data-testid="page-header-left">
            {leftBlock}
          </div>
          <div className="flex-1 text-right" data-testid="page-header-right">
            {rightBlock}
          </div>
        </div>
      </div>
    </div>
  );
};

type TemplateType = 'channelAndService';

interface BasePageHeaderTemplateProps {
  type: TemplateType;
}

interface ChannelAndServiceProps extends BasePageHeaderTemplateProps {
  type: 'channelAndService';
  channelCategory: string;
  serviceTitle: string;
  isUserAuthenticated?: boolean;
  badgeVariant?: 'default' | 'filled';
  user: {
    customerName: string;
    cif: string;
    accountNumber: string;
  };
}

type PageHeaderProps = ChannelAndServiceProps;

export default function PageHeader(props: PageHeaderProps) {
  switch (props.type) {
    case 'channelAndService':
      return (
        <PageHeaderComponent
          leftBlock={
            <>
              <p className="font-semibold uppercase">{props.channelCategory}</p>
              <h4 className="font-semibold leading-[0.95]">{props.serviceTitle}</h4>
            </>
          }
          rightBlock={
            <>
              <p>
                <AuthenticationBadge isAuthenticated={props.isUserAuthenticated ?? false} />
              </p>
              <p className="font-medium">{props.user.customerName}</p>
              <p className="font-medium">
                <span>CIF: {props.user.cif}</span>|<span>Nº Conta: {props.user.accountNumber}</span>
              </p>
            </>
          }
        />
      );
  }
}
export type { ChannelAndServiceProps, PageHeaderProps };
