import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export interface CardAccordionProps {
  header: React.ReactNode;
  children: React.ReactNode;
  dataTestId?: string;
}

export const CardAccordion = ({ header, children, dataTestId }: CardAccordionProps) => {
  return (
    <Accordion type="single" collapsible defaultValue="single" data-testid={dataTestId}>
      <AccordionItem value="single" className=" rounded-[20px]">
        <AccordionTrigger className="min-h-12">{header}</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance rounded-[20px]">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
export default CardAccordion;
