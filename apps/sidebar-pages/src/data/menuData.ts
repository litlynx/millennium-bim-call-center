import type { IconProps } from 'shared/components';

export interface NavItemProps {
  id: string;
  icon: IconProps['type'];
  label: string;
  path?: string;
}

export interface SidebarItem extends NavItemProps {
  menuIds?: string[];
}

export interface MenuItem extends Omit<NavItemProps, 'icon'> {
  parentSidebarId: string;
  submenuIds?: string[];
}

export interface SubmenuItem extends Omit<NavItemProps, 'icon' | 'path'> {
  parentMenuId: string;
  submenuLinksIds: string[];
}

export interface SubmenuLinkItemProps extends Omit<NavItemProps, 'icon'> {
  parentSubmenuId: string;
  description?: string;
  path: string;
}

export interface SidebarItemProps {
  item: NavItemProps;
  expanded: boolean;
  onOpenMenu: (id: string) => void;
  onCloseMenu: () => void;
  className?: string;
  isPendingActive: boolean;
  hasMenu: boolean;
}

export interface MenuItemProps {
  isMenuOpen: boolean;
  activeItem: string | null;
  isSubmenuOpen: boolean;
  activeSubmenuItem: string | null;
  onSubmenuItemClick: (item: string) => void;
  onCloseMenu: () => void;
  onCloseSubmenu: () => void;
}

export interface SubmenuItemProps {
  isSubmenuOpen: boolean;
  activeMenuItem?: string;
  activeSubmenuItem?: string | null;
  onSubmenuItemClick: (id: string) => void;
  onCloseSubmenu: () => void;
}

export const sidebarMapData: SidebarItem[] = [
  {
    id: '',
    icon: 'home',
    label: 'Início',
    path: '/'
  },
  {
    id: 'records',
    icon: 'register',
    label: 'Registos'
  }
  // {
  //   id: 'outbounds',
  //   icon: 'makePhoneCall',
  //   label: 'Outbounds',
  //   path: '/outbounds'
  // },
  // {
  //   id: 'vendas',
  //   icon: 'shoppingBag',
  //   label: 'Vendas',
  //   path: '/sales'
  // },
  // {
  //   id: 'scripts',
  //   icon: 'info',
  //   label: 'Scripts',
  //   path: '/scripts'
  // },
  // {
  //   id: 'documentacao',
  //   icon: 'files',
  //   label: 'Documentação'
  // },
  // {
  //   id: 'kpis',
  //   icon: 'graph2',
  //   label: "KPI's",
  //   path: '/kpis'
  // }
];

export const bottomSidebarMapData: SidebarItem[] = [
  // {
  //   id: 'definicoes',
  //   icon: 'config',
  //   label: 'Definições',
  //   path: '/settings'
  // },
  // {
  //   id: 'pesquisa',
  //   icon: 'search',
  //   label: 'Pesquisa'
  // }
];

export const menuMapData: MenuItem[] = [
  //submenus de Registos
  {
    id: 'canais-digitais',
    label: 'Canais Digitais',
    parentSidebarId: 'records',
    submenuIds: ['mobile-banking-izi-smart-izi-submenu']
  }
  // {
  //   id: 'cartoes',
  //   label: 'Cartões',
  //   parentSidebarId: 'registos',
  //   submenuIds: ['cartoes-submenu']
  // },
  // {
  //   id: 'contas-a-ordem',
  //   label: 'Contas à Ordem',
  //   parentSidebarId: 'registos',
  //   submenuIds: ['contas-a-ordem-submenu']
  // },
  // {
  //   id: 'creditos',
  //   label: 'Créditos',
  //   parentSidebarId: 'registos',
  //   submenuIds: ['creditos-submenu']
  // },
  // {
  //   id: 'reclamacoes',
  //   label: 'Reclamações',
  //   parentSidebarId: 'registos',
  //   submenuIds: ['reclamacoes-submenu']
  // },
  // {
  //   id: 'outros-servicos',
  //   label: 'Outros Serviços',
  //   parentSidebarId: 'registos',
  //   submenuIds: ['outros-servicos-submenu']
  // },

  //menu de Documentação
  // {
  //   id: 'simuladores',
  //   label: 'Simuladores',
  //   parentSidebarId: 'documentacao',
  //   path: '/documentation/calculators'
  // },
  // {
  //   id: 'impressos',
  //   label: 'Impressos',
  //   parentSidebarId: 'documentacao',
  //   path: '/documentation/forms'
  // },
  // {
  //   id: 'divulgacoes',
  //   label: 'Divulgações',
  //   parentSidebarId: 'documentacao',
  //   path: '/documentation/disclosures'
  // },
  // {
  //   id: 'campanha-de-ciclo',
  //   label: 'Campanha de Ciclo',
  //   parentSidebarId: 'documentacao',
  //   path: '/documentation/campaigns'
  // },
  // {
  //   id: 'precario',
  //   label: 'Preçário',
  //   parentSidebarId: 'documentacao',
  //   path: '/documentation/pricing'
  // },
  // {
  //   id: 'cambio',
  //   label: 'Câmbio',
  //   parentSidebarId: 'documentacao',
  //   path: '/documentation/exchange'
  // }
];

export const submenuMapData: SubmenuItem[] = [
  {
    id: 'mobile-banking-submenu',
    label: 'Mobile Banking (IZI/SMART IZI)',
    parentMenuId: 'canais-digitais',
    submenuLinksIds: [
      'acessos',
      'cancelamento-bloqueio',
      'limites-transaccionais',
      'recargas',
      'erros-da-aplicacao',
      'duvidas-de-instalacao-app-smart-izi',
      'libertacao-otp'
    ]
  },
  {
    id: 'cartoes-submenu',
    label: 'Cartões',
    parentMenuId: 'cartoes',
    submenuLinksIds: [
      'limites-transaccionais',
      'cancelamento-bloqueio',
      'aumento-tentativas-pin',
      'duvidas',
      'utilizcao-na-internet'
    ]
  },
  {
    id: 'contas-a-ordem-submenu',
    label: 'Contas à ordem',
    parentMenuId: 'contas-a-ordem',
    submenuLinksIds: [
      'reabertura-actualizacao-de-dados',
      'duvidas-de-movimentos-taxas',
      'consulta-de-saldo',
      'creditos-nao-recebidos'
    ]
  },
  {
    id: 'creditos-submenu',
    label: 'Créditos',
    parentMenuId: 'creditos',
    submenuLinksIds: [
      'elegibilidade',
      'pedido-de-simulacao',
      'cativos',
      'esclarecimentos-sobre-o-credito'
    ]
  },
  {
    id: 'reclamacoes-submenu',
    label: 'Reclamações',
    parentMenuId: 'reclamacoes',
    submenuLinksIds: [
      'consulta-reclamacao',
      'consulta-carteiras-moveis',
      'reclamacao-e-carteiras-moveis'
    ]
  },
  {
    id: 'outros-servicos-submenu',
    label: 'Outros Serviços',
    parentMenuId: 'outros-servicos',
    submenuLinksIds: [
      'validacao-troca-sim',
      'depositos-a-prazos',
      'cheques',
      'comerciantes-pos',
      'cancelamento-seguros',
      'questoes-mtop'
    ]
  }
];

export const submenuLinks: SubmenuLinkItemProps[] = [
  // Registos > Canais Digitais
  {
    id: 'acessos',
    label: 'Acessos',
    path: '/records/digital-channels/mobile-banking/accesses',
    parentSubmenuId: 'mobile-banking-submenu'
  },
  {
    id: 'cancelamento-bloqueio',
    label: 'Cancelamento/Bloqueio',
    path: '/records/digital-channels/mobile-banking/cancels-blocked',
    parentSubmenuId: 'mobile-banking-submenu'
  },
  {
    id: 'limites-transaccionais',
    label: 'Limites Transaccionais',
    path: '/records/digital-channels/mobile-banking/transactional-limits',
    parentSubmenuId: 'mobile-banking-submenu'
  },
  {
    id: 'recargas',
    label: 'Recargas',
    path: '/records/digital-channels/mobile-banking/refills',
    parentSubmenuId: 'mobile-banking-submenu'
  },
  {
    id: 'application-errors',
    label: 'Erros da Aplicação',
    path: '/records/digital-channels/mobile-banking/application-errors',
    parentSubmenuId: 'mobile-banking-submenu'
  },

  // {
  //   id: 'duvidas-de-instalacao-app-smart-izi',
  //   label: 'Dúvidas de Instalação App - Smart IZI',
  //   path: '/records/digital-channels/mobile-banking/doubts',
  //   parentSubmenuId: 'mobile-banking-submenu'
  // },
  // {
  //   id: 'libertacao-otp',
  //   label: 'Libertação OTP',
  //   path: '/records/digital-channels/mobile-banking/otp-release',
  //   parentSubmenuId: 'mobile-banking-submenu'
  // },
  // Registos > Cartões
  {
    id: 'limites-transaccionais',
    label: 'Limites Transaccionais',
    path: '/records/cards/limits',
    parentSubmenuId: 'cartoes-submenu'
  },
  {
    id: 'cancelamento-bloqueio',
    label: 'Cancelamento/Bloqueio',
    path: '/records/cards/cancels',
    parentSubmenuId: 'cartoes-submenu'
  },
  {
    id: 'aumento-tentativas-pin',
    label: 'Aumento Tentativas PIN',
    path: '/records/cards/pin-attempts',
    parentSubmenuId: 'cartoes-submenu'
  },
  {
    id: 'duvidas',
    label: 'Dúvidas',
    description: 'Utilização / Movimentos / Taxas',
    path: '/records/cards/doubts',
    parentSubmenuId: 'cartoes-submenu'
  },
  {
    id: 'utilizacao-na-internet',
    label: 'Utilização na Internet',
    description: 'E-commerce / VBV',
    path: '/records/cards/internet',
    parentSubmenuId: 'cartoes-submenu'
  },
  // Registos > Contas à Ordem
  {
    id: 'reabertura-actualizacao-de-dados',
    label: '(Re)abertura / Actualização de Dados',
    path: '/records/current-accounts/data-updates',
    parentSubmenuId: 'contas-a-ordem-submenu'
  },
  {
    id: 'duvidas-de-movimentos-taxas',
    label: 'Dúvidas de Movimentos/Taxas',
    path: '/records/current-accounts/doubts',
    parentSubmenuId: 'contas-a-ordem-submenu'
  },
  {
    id: 'consulta-de-saldo',
    label: 'Consulta de Saldo',
    path: '/records/current-accounts/balances',
    parentSubmenuId: 'contas-a-ordem-submenu'
  },
  {
    id: 'creditos-nao-recebidos',
    label: 'Créditos não Recebidos',
    path: '/records/current-accounts/loans-not-received',
    parentSubmenuId: 'contas-a-ordem-submenu'
  },
  // Registos > Créditos
  {
    id: 'elegibilidade',
    label: 'Elegibilidade',
    path: '/records/loans/eligibility',
    parentSubmenuId: 'creditos-submenu'
  },
  {
    id: 'pedido-de-simulacao',
    label: 'Pedido de Simulação',
    path: '/records/loans/simulations',
    parentSubmenuId: 'creditos-submenu'
  },
  {
    id: 'cativos',
    label: 'Cativos',
    path: '/records/loans/captives',
    parentSubmenuId: 'creditos-submenu'
  },
  {
    id: 'esclarecimentos-sobre-o-credito',
    label: 'Esclarecimentos sobre o Crédito',
    path: '/records/loans/clarifications',
    parentSubmenuId: 'creditos-submenu'
  },
  // Registos > Reclamações
  {
    id: 'consulta-reclamacao',
    label: 'Consulta Reclamação',
    path: '/records/complaints/consults',
    parentSubmenuId: 'reclamacoes-submenu'
  },
  {
    id: 'consulta-carteiras-moveis',
    label: 'Consulta Carteiras Móveis',
    path: '/records/complaints/digital-wallets',
    parentSubmenuId: 'reclamacoes-submenu'
  },
  {
    id: 'reclamacao-e-carteiras-moveis',
    label: 'Reclamação e Carteiras Móveis',
    path: '/records/complaints/complaints-digital-wallets',
    parentSubmenuId: 'reclamacoes-submenu'
  },
  // Registos > Outros Serviços
  {
    id: 'validacao-troca-sim',
    label: 'Validação/Troca SIM',
    path: '/records/other-services/sim-validations',
    parentSubmenuId: 'outros-servicos-submenu'
  },
  {
    id: 'depositos-a-prazos',
    label: 'Depósitos a Prazos',
    path: '/records/other-services/term-deposits',
    parentSubmenuId: 'outros-servicos-submenu'
  },
  {
    id: 'cheques',
    label: 'Cheques',
    path: '/records/other-services/cheques',
    parentSubmenuId: 'outros-servicos-submenu'
  },
  {
    id: 'comerciantes-pos',
    label: 'Comerciantes POS',
    path: '/records/other-services/pos-merchants',
    parentSubmenuId: 'outros-servicos-submenu'
  },
  {
    id: 'questoes-mtop',
    label: 'Questões MTOP',
    path: '/records/other-services/mtop-issues',
    parentSubmenuId: 'outros-servicos-submenu'
  }
];
