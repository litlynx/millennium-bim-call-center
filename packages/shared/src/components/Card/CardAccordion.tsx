import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export interface CardAccordionProps {
  header: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'compact';
}

export const CardAccordion = ({ header, children, variant = 'default' }: CardAccordionProps) => {
  const triggerClass = variant === 'compact' ? 'min-h-12 !p-0' : 'min-h-12';

  return (
    <Accordion type="single" collapsible defaultValue="single">
      <AccordionItem value="single" className=" rounded-[20px]">
        <AccordionTrigger className={triggerClass}>{header}</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance rounded-[20px]">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CardAccordion;
