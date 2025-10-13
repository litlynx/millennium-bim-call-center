import * as React from "react";

import Icon from "@/components/Icon";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  placeholder?: string;
  onClear?: () => void;
}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, placeholder, onChange, onClear, value, ...props }, ref) => {
  const [hasValue, setHasValue] = React.useState(Boolean(value));

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(Boolean(e.target.value));
    onChange?.(e);
  };

  const handleClear = () => {
    setHasValue(false);

    if (ref && typeof ref !== "function" && ref.current) {
      // For controlled components, we need to trigger onChange with empty value
      // Create a synthetic change event with empty value
      const syntheticEvent = {
        target: { ...ref.current, value: "" },
        currentTarget: { ...ref.current, value: "" },
        type: 'change'
      } as React.ChangeEvent<HTMLTextAreaElement>;

      // Call the onChange handler first (this will update the controlled value)
      if (onChange) {
        onChange(syntheticEvent);
      }

      // Call the external clear handler if provided
      if (onClear) {
        onClear();
      }

      // For uncontrolled components, set the DOM value directly
      if (value === undefined) {
        ref.current.value = "";
      }

      // Focus the textarea after clearing
      ref.current.focus();
    } else {
      // If no ref, just call the handlers
      if (onClear) {
        onClear();
      }
    }
  };

  // Update hasValue when value prop changes
  React.useEffect(() => {
    setHasValue(Boolean(value));
  }, [value]);

  return (
    <div className="relative">
    <textarea
      data-testid="text-area"
      className={cn(
        "flex min-h-[60px] w-full rounded-t-xl border-b border-black bg-gray-100 pl-3 pr-6 py-2 text-base shadow-sm placeholder:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      placeholder={placeholder}
      ref={ref}
      onChange={handleChange}
      value={value}
      {...props}
    />
    {hasValue && (
      <Icon
        type="closeBlack"
        className="cursor-pointer absolute h-fit w-fit p-0 right-2 top-1/2 -translate-y-1/2"
        onClick={handleClear}
      />
    )}
    </div>
  )
})
Textarea.displayName = "Textarea"

export { Textarea };

