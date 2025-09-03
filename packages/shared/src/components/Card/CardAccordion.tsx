import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

interface CardAccordionProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export const CardAccordion = ({ header, children }: CardAccordionProps) => {
  return (
    <Accordion type="single" collapsible defaultValue="single">
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
