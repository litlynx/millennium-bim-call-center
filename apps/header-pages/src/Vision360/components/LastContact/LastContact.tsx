import { compareDesc, parse } from 'date-fns';
import React from 'react';
import { useNavigate } from 'react-router';
import { CardTabs, Icon } from 'shared/components';
import type { CardTabItem } from 'shared/components/Card/CardTabs';
import type { CardAccordionItemContactsProps } from '../LastContact/components/CardAccordionItemContacts';
import { CardAccordionItemContacts } from '../LastContact/components/CardAccordionItemContacts';
import { CardItemMessages } from '../LastContact/components/CardItemMessages';
import {
  CardAccordionItemContactsMapData,
  CardItemMessagesMapData
} from '../LastContact/mockData/mockData';

const sortByDateTimeDesc = (
  a: CardAccordionItemContactsProps,
  b: CardAccordionItemContactsProps
): number => {
  const dateTimeA = parse(
    `${a.header.date} ${a.header.time.replace('h', ':')}`,
    'dd-MM-yyyy HH:mm',
    new Date()
  );
  const dateTimeB = parse(
    `${b.header.date} ${b.header.time.replace('h', ':')}`,
    'dd-MM-yyyy HH:mm',
    new Date()
  );
  return compareDesc(dateTimeA, dateTimeB);
};

const LastContact: React.FC = () => {
  const navigate = useNavigate();

  const sortedContacts = React.useMemo(() => {
    return CardAccordionItemContactsMapData.sort(sortByDateTimeDesc).slice(0, 3);
  }, []);

  const tabs: CardTabItem[] = [
    {
      value: 'calls',
      label: 'Chamadas',
      dataTestId: 'last-contact-tab-calls',
      content: (
        <>
          {sortedContacts.map((props, index) => (
            <React.Fragment key={`${props.header.date}-${props.header.time}`}>
              <CardAccordionItemContacts
                {...props}
                dataTestId={`last-contact-call-item-${index}`}
              />
              {index < sortedContacts.length - 1 && <hr className="text-gray-100" />}
            </React.Fragment>
          ))}
        </>
      )
    },
    {
      value: 'messages',
      label: 'Mensagens',
      dataTestId: 'last-contact-tab-messages',
      content: (
        <>
          {CardItemMessagesMapData.map((props, index) => (
            <React.Fragment key={`${props.date}-${props.time}`}>
              <CardItemMessages {...props} dataTestId={`last-contact-message-item-${index}`} />
              {index < CardItemMessagesMapData.length - 1 && <hr className="text-gray-100" />}
            </React.Fragment>
          ))}
        </>
      )
    }
  ];

  return (
    <CardTabs
      title="Últimos contactos"
      icon={<Icon type="history" className="bg-purple" />}
      tabs={tabs}
      defaultValue="calls"
      className="w-full"
      tabsListClassName="pt-[1.125rem]"
      tabsTriggerClassName="text-lg"
      onTitleClick={() => navigate('/history-interactions?details=true&component=calls')}
      data-testid="last-contact-card"
      headerTestId="last-contact-header"
      titleTestId="last-contact-title"
      contentTestId="last-contact-content"
    />
  );
};

export default LastContact;
