import { CardAccordion } from 'shared/components';
import type { ClaimsProps } from 'src/Vision360/components/ComplainsAndIncidents/types';

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between gap-5">
    <p className="font-medium">{label}</p>
    <span className="text-gray-600 text-right">{value}</span>
  </div>
);

export const ClaimItem: React.FC<ClaimsProps> = ({
  number,
  registerDate,
  deadlineDate,
  status,
  amount,
  type,
  dataTestId
}) => {
  const infoItems: { label: string; value: string }[] = [
    { label: 'Data Registro | Prazo', value: `${registerDate} | ${deadlineDate}` },
    { label: 'Estado', value: status },
    { label: 'Montante', value: amount },
    { label: 'Tipo', value: type }
  ];

  return (
    <CardAccordion
      header={
        <div className="flex gap-2">
          <div className="flex flex-col">
            <p className="text-base flex font-semibold text-gray-800 gap-1">
              Nº Reclamação - <span className="font-normal">{number}</span>
            </p>
          </div>
        </div>
      }
      data-testid={dataTestId}
    >
      <div className="flex flex-col gap-1">
        {infoItems.map(({ label, value }) => (
          <InfoRow key={label} label={label} value={value} />
        ))}
      </div>
    </CardAccordion>
  );
};
