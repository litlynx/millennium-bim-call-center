import React from 'react';

import { CardTabs, Icon } from 'shared/components';
import type { CardTabItem } from 'shared/components/Card/CardTabs';

import { CardAccordionItemContacts } from '../LastContact/components/CardAccordionItemContacts';
import { CardItemMessages } from '../LastContact/components/CardItemMessages';
import {
  CardAccordionItemContactsMapData,
  CardItemMessagesMapData
} from '../LastContact/mockData/mockData';

const tabs: CardTabItem[] = [
  {
    value: 'calls',
    label: 'Chamadas',
    content: (
      <>
        {CardAccordionItemContactsMapData.map((props) => (
          <React.Fragment key={`${props.header.date}-${props.header.time}`}>
            <CardAccordionItemContacts {...props} />
          </React.Fragment>
        ))}
      </>
    )
  },
  {
    value: 'messages',
    label: 'Mensagens',
    content: (
      <>
        {CardItemMessagesMapData.map((props) => (
          <React.Fragment key={`${props.date}-${props.time}`}>
            <CardItemMessages {...props} />
          </React.Fragment>
        ))}
      </>
    )
  }
];

const LastContact: React.FC = () => {
  return (
    <CardTabs
      title="Últimos contactos"
      icon={<Icon type="history" className="bg-purple" />}
      tabs={tabs}
      defaultValue="calls"
      className="w-full"
    />
  );
};

export default LastContact;
