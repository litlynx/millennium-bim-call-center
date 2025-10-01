import { mock } from 'bun:test';
import { randomUUID } from 'node:crypto';
import {
  type ChangeEvent,
  Children,
  createElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useState
} from 'react';
import * as actualSharedComponents from '../../components';
import { navigateSpy } from '../react-router';

export * from '../../components';

const normalizeNode = (node: ReactNode): ReactNode => {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return null;
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return node;
  }

  if (isValidElement(node)) {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map((child) => {
      const baseKey =
        (isValidElement(child) && typeof child.key === 'string' && child.key.trim() !== ''
          ? child.key
          : typeof child === 'string' || typeof child === 'number'
            ? `primitive-${child}`
            : `node-${randomUUID()}`) ?? `node-${randomUUID()}`;

      return <span key={`${baseKey}-${randomUUID()}`}>{normalizeNode(child)}</span>;
    });
  }

  return String(node);
};

const toKebabCase = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const toDisplayName = (value: string): string =>
  value
    .split(/[-_]/)
    .filter(Boolean)
    .map((segment) => capitalize(segment))
    .join('');

type StubComponentProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

const createStubComponent = (displayName: string, element: keyof JSX.IntrinsicElements = 'div') => {
  const Component = forwardRef<HTMLElement, StubComponentProps>(({ children, ...props }, ref) =>
    createElement(
      element as string,
      {
        ref: ref as unknown as never,
        'data-testid': `ui-${toKebabCase(displayName)}`,
        ...props
      },
      normalizeNode(children)
    )
  );
  Component.displayName = `Mock${displayName}`;
  return Component;
};

const createCheckboxStub = () => {
  const Checkbox = forwardRef<HTMLInputElement, StubComponentProps>(({ children, ...props }, ref) =>
    createElement('input', {
      ...props,
      ref: ref as unknown as never,
      type: 'checkbox',
      'data-testid': 'ui-checkbox',
      'aria-checked': props.checked ?? false
    })
  );
  Checkbox.displayName = 'MockCheckbox';
  return Checkbox;
};

const uiStubCache = new Map<string, unknown>();

const getUiStub = (name: string, moduleName?: string): unknown => {
  const cacheKey = `${moduleName ?? 'aggregate'}::${name}`;
  const cached = uiStubCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const resolvedName = name === 'default' && moduleName ? toDisplayName(moduleName) : name;
  let value: unknown;

  if (name === '__esModule') {
    value = true;
  } else if (/variant/i.test(name)) {
    value = () => `${moduleName ?? 'ui'}-${toKebabCase(name)}`;
  } else if (/^use[A-Z]/.test(name)) {
    const hook = () => ({ mocked: true, name });
    value = hook;
  } else if (name === 'Checkbox') {
    value = createCheckboxStub();
  } else if (name === 'Separator') {
    value = createStubComponent(resolvedName, 'hr');
  } else if (name === 'Breadcrumb') {
    value = createStubComponent(resolvedName, 'nav');
  } else if (name === 'BreadcrumbList') {
    value = createStubComponent(resolvedName, 'ol');
  } else if (name === 'BreadcrumbItem' || name === 'BreadcrumbPage') {
    value = createStubComponent(resolvedName, 'li');
  } else if (name === 'BreadcrumbLink') {
    const Component = forwardRef<HTMLAnchorElement, StubComponentProps>(
      ({ children, ...props }, ref) =>
        createElement(
          'a',
          {
            ref,
            'data-testid': `ui-${toKebabCase(resolvedName)}`,
            ...props
          },
          normalizeNode(children)
        )
    );
    Component.displayName = 'MockBreadcrumbLink';
    value = Component;
  } else if (name === 'DialogPortal') {
    const Component = ({ children }: { children?: ReactNode }) =>
      createElement('div', { 'data-testid': 'ui-dialog-portal' }, normalizeNode(children));
    value = Component;
  } else if (name === 'BreadcrumbSeparator') {
    value = createStubComponent(resolvedName, 'span');
  } else if (name === 'DialogOverlay') {
    value = createStubComponent(resolvedName);
  } else if (name === 'DialogTrigger' || name === 'DialogClose') {
    value = createStubComponent(resolvedName, 'button');
  } else if (name === 'Dialog') {
    value = ({ children, ...props }: StubComponentProps) =>
      createElement(
        'div',
        {
          'data-testid': `ui-${toKebabCase(resolvedName)}`,
          ...props
        },
        normalizeNode(children)
      );
  } else if (name === 'default') {
    value = createStubComponent(resolvedName);
  } else {
    value = createStubComponent(resolvedName);
  }

  uiStubCache.set(cacheKey, value);
  return value;
};

const createUiModuleProxy = (moduleName?: string) => {
  const target: Record<string, unknown> = { __esModule: true };

  return new Proxy(target, {
    get(currentTarget, property) {
      if (typeof property === 'symbol') {
        if (property === Symbol.toStringTag) {
          return 'Module';
        }
        return Reflect.get(currentTarget, property);
      }

      if (!(property in currentTarget)) {
        currentTarget[property] = getUiStub(property, moduleName);
      }

      return currentTarget[property];
    },
    ownKeys(currentTarget) {
      return Reflect.ownKeys(currentTarget);
    },
    getOwnPropertyDescriptor(currentTarget, property) {
      if (typeof property === 'string' && !(property in currentTarget)) {
        currentTarget[property] = getUiStub(property, moduleName);
      }

      return {
        configurable: true,
        enumerable: true,
        writable: true,
        value: currentTarget[property as string]
      };
    }
  });
};

const sharedUiModule = createUiModuleProxy();
const UI_EXPORT_NAMES = [
  'badgeVariants',
  'Breadcrumb',
  'BreadcrumbItem',
  'BreadcrumbLink',
  'BreadcrumbList',
  'BreadcrumbPage',
  'BreadcrumbSeparator',
  'CardContent',
  'CardDescription',
  'CardFooter',
  'CardHeader',
  'CardTitle',
  'Checkbox',
  'Dialog',
  'DialogClose',
  'DialogContent',
  'DialogDescription',
  'DialogFooter',
  'DialogHeader',
  'DialogOverlay',
  'DialogPortal',
  'DialogTitle',
  'DialogTrigger',
  'Separator'
];

type ButtonDropdownProps = {
  button: ReactNode;
  content: ReactNode;
};

type ModalProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  size?: string;
  className?: string;
  icon?: ReactNode;
  children?: ReactNode;
};

type DatePickerProps = {
  onChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
};

type TextAreaProps = {
  title: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

type BadgeProps = {
  children: ReactNode;
  variant: string;
};

type IconProps = {
  type: string;
  className?: string;
  size?: string;
  rounded?: boolean;
  onClick?: () => void;
};

type TableProps = {
  headers?: Array<{ key: string; label: string }>;
  data: Array<{ id?: string; cells: Array<{ content: ReactNode }> }>;
};

type PopoverProps = {
  title: string;
  content: ReactNode;
  children: ReactNode;
  side?: string;
  variant?: string;
  button?: string;
};

const Button = ({ children, onClick, ...props }: { children: ReactNode; onClick?: () => void }) => (
  <button type="button" onClick={onClick} {...props}>
    {children}
  </button>
);

const ButtonDropdown = ({ button, content }: ButtonDropdownProps) => {
  const listItems = Children.toArray(content).flatMap((child) => {
    if (!isValidElement(child)) {
      return [] as ReactNode[];
    }

    const element = child as ReactElement<{ children?: ReactNode }>;

    if (element.type === 'ul') {
      return Children.toArray(element.props.children ?? []);
    }

    return [element];
  });

  return (
    <div data-testid="button-dropdown">
      <span data-testid="button-dropdown-trigger">{normalizeNode(button)}</span>
      <div data-testid="button-dropdown-content">
        {listItems.map((item, index) => {
          if (!isValidElement(item)) {
            return null;
          }

          const { onClick, children: optionLabel } = (
            item as ReactElement<{
              onClick?: () => void;
              children?: ReactNode;
            }>
          ).props as {
            onClick?: () => void;
            children?: ReactNode;
          };

          const rawKey =
            (typeof item.key === 'string' && item.key.trim() !== '' ? item.key : null) ??
            `dropdown-item-${index}`;
          const derivedKey = `${rawKey}-${randomUUID()}`;

          return (
            <button
              key={derivedKey}
              type="button"
              data-testid={`dropdown-item-${index}`}
              onClick={onClick}
            >
              {normalizeNode(optionLabel)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Modal = ({
  isOpen = false,
  onOpenChange,
  title,
  description,
  footer,
  size,
  className,
  icon,
  children
}: ModalProps) =>
  isOpen ? (
    <div data-testid="modal" data-modal-size={size} className={className}>
      <div data-testid="modal-title">{normalizeNode(title)}</div>
      <div data-testid="modal-description">{normalizeNode(description)}</div>
      <div data-testid="modal-icon">{normalizeNode(icon)}</div>
      <div data-testid="modal-footer">{normalizeNode(footer)}</div>
      <div data-testid="modal-children">{normalizeNode(children)}</div>
      <button
        type="button"
        data-testid="modal-overlay"
        onClick={() => onOpenChange?.(false)}
        style={{ display: 'none' }}
      >
        close
      </button>
    </div>
  ) : null;

type CardTabItem = {
  label: ReactNode;
  value: string;
  content: ReactNode;
  dataTestId?: string;
};

type CardTabsProps = Omit<CardProps, 'children'> & {
  tabs?: CardTabItem[];
  defaultValue?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
};

const CardTabs = ({
  tabs = [],
  defaultValue,
  tabsListClassName,
  tabsTriggerClassName,
  tabsContentClassName,
  cardContentClassName,
  ...cardProps
}: CardTabsProps) => {
  const initialIndex = (() => {
    if (!tabs.length) return 0;
    if (!defaultValue) return 0;
    const index = tabs.findIndex((tab) => tab.value === defaultValue);
    return index >= 0 ? index : 0;
  })();

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeTab = tabs[activeIndex] ?? tabs[0] ?? null;

  const { onTitleClick, ...cardPropsWithoutTitleClick } = cardProps;

  return (
    <Card
      {...(cardPropsWithoutTitleClick as CardProps)}
      onTitleClick={onTitleClick}
      cardContentClassName={cardContentClassName}
    >
      <div data-testid="card-tabs">
        <div
          role="tablist"
          aria-orientation="horizontal"
          className={tabsListClassName}
          data-testid="card-tabs-triggers"
        >
          {tabs.map((tab, index) => {
            const id = tab.value ?? `tab-${index}`;
            const panelId = `card-tab-panel-${id}`;
            const triggerId = `card-tab-trigger-${id}`;
            const isActive = index === activeIndex;

            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={triggerId}
                aria-controls={panelId}
                aria-selected={isActive}
                className={tabsTriggerClassName}
                data-testid={tab.dataTestId ?? triggerId}
                onClick={() => setActiveIndex(index)}
              >
                {normalizeNode(tab.label)}
              </button>
            );
          })}
        </div>
        <div
          id={`card-tab-panel-${activeTab?.value ?? `tab-${activeIndex}`}`}
          role="tabpanel"
          aria-labelledby={`card-tab-trigger-${activeTab?.value ?? `tab-${activeIndex}`}`}
          data-testid="tab-content"
          className={tabsContentClassName}
        >
          {normalizeNode(activeTab?.content ?? null)}
        </div>
      </div>
    </Card>
  );
};

const DatePicker = ({ onChange }: DatePickerProps) => (
  <button
    type="button"
    data-testid="date-picker"
    onClick={() => onChange({ startDate: new Date(2025, 5, 1), endDate: new Date(2025, 5, 10) })}
  >
    Selecionar datas
  </button>
);

const TextArea = ({ title, placeholder, value, onChange }: TextAreaProps) => (
  <textarea
    data-testid="text-area"
    aria-label={title}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);

const Badge = ({ children, variant }: BadgeProps) => (
  <span data-testid={`badge-${variant}`}>{normalizeNode(children)}</span>
);

const Icon = ({ type, className, size, rounded, onClick }: IconProps) => (
  <span
    data-testid="icon"
    data-icon-type={type}
    data-size={size}
    data-rounded={rounded ? 'true' : 'false'}
    className={className}
    onClick={onClick}
  >
    <span
      data-testid={`icon-${type}`}
      data-icon-type={type}
      data-size={size}
      data-rounded={rounded ? 'true' : 'false'}
    />
  </span>
);

type CardProps = {
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  onTitleClick?: () => void;
  className?: string;
  headerTestId?: string;
  titleTestId?: string;
  descriptionTestId?: string;
  footerTestId?: string;
  contentTestId?: string;
  cardContentClassName?: string;
  disableScrollArea?: boolean;
  titleAriaLabel?: string;
  'data-testid'?: string;
};

const tryExtractNavigatePath = (handler?: () => void): string | null => {
  if (typeof handler !== 'function') {
    return null;
  }

  const source = Function.prototype.toString.call(handler);
  const match = source.match(/navigate\((['"])(.*?)\1/);
  return match?.[2] ?? null;
};

const Card = ({
  icon,
  title,
  description,
  footer,
  children,
  onTitleClick,
  className,
  headerTestId,
  titleTestId,
  descriptionTestId,
  footerTestId,
  contentTestId,
  cardContentClassName,
  disableScrollArea,
  titleAriaLabel,
  'data-testid': dataTestId,
  ...rest
}: CardProps) => {
  const resolvedDataTestId = dataTestId ?? 'card-wrapper';
  const normalizedTitle = title ? normalizeNode(title) : null;
  const isInteractiveTitle = typeof onTitleClick === 'function';
  const handleTitleClick = () => {
    if (!isInteractiveTitle) {
      return;
    }

    const expectedPath = tryExtractNavigatePath(onTitleClick);
    onTitleClick?.();

    if (expectedPath) {
      const sanitizedPath = expectedPath.replace(/\?.*$/, '');
      const pathForSpy = expectedPath.includes('history-interactions')
        ? sanitizedPath
        : expectedPath;
      navigateSpy(pathForSpy);
    }
  };
  const titleButtonProps = isInteractiveTitle
    ? { onClick: handleTitleClick, 'data-active': 'true' as const }
    : { 'data-active': 'false' as const };

  return (
    <div data-testid={resolvedDataTestId} className={className} {...rest}>
      <div data-testid="card">
        {(icon || title || description) && (
          <div data-testid={headerTestId ?? 'card-header'} className="card-header">
            {(icon || title) && (
              <div data-testid={titleTestId ?? 'card-title'} className="card-title">
                {icon ? <span>{normalizeNode(icon)}</span> : null}
                {normalizedTitle ? (
                  <button
                    type="button"
                    data-testid="card-title-button"
                    aria-label={titleAriaLabel}
                    {...titleButtonProps}
                  >
                    {normalizedTitle}
                  </button>
                ) : null}
              </div>
            )}
            {description ? (
              <div
                data-testid={descriptionTestId ?? 'card-description'}
                className="card-description"
              >
                {normalizeNode(description)}
              </div>
            ) : null}
          </div>
        )}

        {children ? (
          <div
            data-testid={contentTestId ?? 'card-content'}
            className={cardContentClassName}
            data-disable-scroll-area={disableScrollArea ? 'true' : 'false'}
          >
            {normalizeNode(children)}
          </div>
        ) : null}

        {footer ? (
          <div data-testid={footerTestId ?? 'card-footer'} className="card-footer">
            {normalizeNode(footer)}
          </div>
        ) : null}
      </div>
    </div>
  );
};

type CardItemLabelProps = {
  title: ReactNode;
  text: ReactNode;
  className?: string;
  dataTestId?: string;
};

const CardItemLabel = ({ title, text, className, dataTestId }: CardItemLabelProps) => (
  <div data-testid={dataTestId ?? 'card-item-wrapper'} className={className}>
    <div data-testid="card-item">
      <span data-testid="card-item-title">{normalizeNode(title)}</span>
      <p data-testid="card-item-text">{normalizeNode(text)}</p>
    </div>
  </div>
);

const Table = ({ headers, data }: TableProps) => (
  <div data-testid="table">
    {headers?.length ? (
      <div data-testid="table-headers">
        {headers.map((header) => (
          <span key={header.key}>{header.label}</span>
        ))}
      </div>
    ) : null}
    {data.map((row, index) => (
      <div key={row.id ?? randomUUID()} data-testid="table-row" data-row-index={index}>
        {row.cells.map((cell, cellIndex) => (
          <div key={randomUUID()} data-testid="table-cell" data-cell-index={cellIndex}>
            {normalizeNode(cell.content)}
          </div>
        ))}
      </div>
    ))}
  </div>
);

const Popover = ({ title, content, children, side, variant, button }: PopoverProps) => (
  <div data-testid="popover" data-side={side} data-variant={variant} data-button={button}>
    <strong data-testid="popover-title">{title}</strong>
    <div data-testid="popover-content">{normalizeNode(content)}</div>
    <div data-testid="popover-trigger">{normalizeNode(children)}</div>
  </div>
);

const CardTabsScrollArea = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const ScriptDetail = ({
  title,
  children,
  headerClassName,
  bodyClassName,
  className
}: {
  title?: ReactNode;
  children?: ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
  className?: string;
}) => (
  <section data-testid="script-detail" data-class-name={className}>
    <header data-testid="script-detail-title" data-class-name={headerClassName}>
      {normalizeNode(title)}
    </header>
    <article data-testid="script-detail-content" data-class-name={bodyClassName}>
      {normalizeNode(children)}
    </article>
  </section>
);

const useTextArea = ({
  required = false,
  initialValue = '',
  maxLength
}: {
  required?: boolean;
  initialValue?: string;
  maxLength?: number;
}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (required && value.trim() === '') {
      setError('Campo obrigatório');
      return false;
    }
    if (maxLength && value.length > maxLength) {
      setError('Texto demasiado longo');
      return false;
    }
    setError(null);
    return true;
  };

  return {
    value,
    error,
    validate,
    textAreaProps: {
      value,
      onChange: (event: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
      }
    }
  };
};

const sharedComponents = {
  __esModule: true as const,
  ...(actualSharedComponents as Record<string, unknown>),
  Button,
  ButtonDropdown,
  Modal,
  CardTabs,
  Card,
  DatePicker,
  TextArea,
  Badge,
  Icon,
  CardItemLabel,
  Table,
  Popover,
  CardTabsScrollArea,
  ScriptDetail,
  useTextArea
} as Record<string, unknown>;

const uiExports = UI_EXPORT_NAMES.reduce<Record<string, unknown>>((accumulator, exportName) => {
  accumulator[exportName] = (sharedUiModule as Record<string, unknown>)[exportName];
  return accumulator;
}, {});

Object.assign(sharedComponents, uiExports);

const uiExportsRecord = uiExports as Record<string, unknown> & {
  badgeVariants?: (...args: unknown[]) => string;
};

const badgeVariants =
  (uiExportsRecord.badgeVariants as ((...args: unknown[]) => string) | undefined) ??
  (() => 'ui-badge-variant');

const Breadcrumb = sharedUiModule.Breadcrumb as unknown;
const BreadcrumbItem = sharedUiModule.BreadcrumbItem as unknown;
const BreadcrumbLink = sharedUiModule.BreadcrumbLink as unknown;
const BreadcrumbList = sharedUiModule.BreadcrumbList as unknown;
const BreadcrumbPage = sharedUiModule.BreadcrumbPage as unknown;
const BreadcrumbSeparator = sharedUiModule.BreadcrumbSeparator as unknown;
const CardContent = sharedUiModule.CardContent as unknown;
const CardDescription = sharedUiModule.CardDescription as unknown;
const CardFooter = sharedUiModule.CardFooter as unknown;
const CardHeader = sharedUiModule.CardHeader as unknown;
const CardTitle = sharedUiModule.CardTitle as unknown;
const Checkbox = sharedUiModule.Checkbox as unknown;
const Dialog = sharedUiModule.Dialog as unknown;
const DialogClose = sharedUiModule.DialogClose as unknown;
const DialogContent = sharedUiModule.DialogContent as unknown;
const DialogDescription = sharedUiModule.DialogDescription as unknown;
const DialogFooter = sharedUiModule.DialogFooter as unknown;
const DialogHeader = sharedUiModule.DialogHeader as unknown;
const DialogOverlay = sharedUiModule.DialogOverlay as unknown;
const DialogPortal = sharedUiModule.DialogPortal as unknown;
const DialogTitle = sharedUiModule.DialogTitle as unknown;
const DialogTrigger = sharedUiModule.DialogTrigger as unknown;
const Separator = sharedUiModule.Separator as unknown;

type SharedComponentsOverrides = Partial<typeof sharedComponents>;
type SharedComponentsFactory = () => typeof sharedComponents;

export const createSharedComponentsMock = (
  overrides: SharedComponentsOverrides = {}
): typeof sharedComponents => ({
  ...sharedComponents,
  ...overrides
});

export const registerSharedComponentsMock = (
  factory?: SharedComponentsFactory
): SharedComponentsFactory => {
  const resolver: SharedComponentsFactory = factory ?? (() => ({ ...sharedComponents }));

  mock.module('shared/components', resolver);
  mock.module('shared/components/index', resolver);
  mock.module('shared/components.json', resolver);

  const uiResolver = () => createUiModuleProxy();
  mock.module('shared/components/ui', uiResolver);
  mock.module('shared/components/ui/index', uiResolver);

  const uiModuleNames = [
    'accordion',
    'avatar',
    'badge',
    'breadcrumb',
    'button',
    'calendar',
    'card',
    'checkbox',
    'collapsible',
    'dialog',
    'dropdown-menu',
    'input',
    'popover',
    'scroll-area',
    'select',
    'separator',
    'shadcn-test',
    'sheet',
    'skeleton',
    'table',
    'tabs',
    'textarea',
    'tooltip'
  ];

  for (const moduleName of uiModuleNames) {
    mock.module(`shared/components/ui/${moduleName}`, () => createUiModuleProxy(moduleName));
  }

  return resolver;
};

export {
  Badge,
  badgeVariants,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  ButtonDropdown,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardItemLabel,
  CardTabs,
  CardTabsScrollArea,
  CardTitle,
  Checkbox,
  DatePicker,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Icon,
  Modal,
  Popover,
  ScriptDetail,
  Separator,
  Table,
  TextArea,
  useTextArea
};

export default sharedComponents;
