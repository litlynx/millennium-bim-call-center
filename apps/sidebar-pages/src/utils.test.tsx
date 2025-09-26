import { describe, expect, it, mock } from 'bun:test';
import {
  getMenusBySidebarId,
  getSidebarLabelById,
  getSubmenuLinksBySubmenuId,
  getSubmenusByMenuId
} from './utils/utils';

// Mock the data
const mockSidebarMapData = [
  { id: 'home', icon: 'home', label: 'Início', path: '/home' },
  { id: 'registos', icon: 'register', label: 'Registos' },
  { id: 'vendas', icon: 'shopping', label: 'Vendas', path: '/sales' }
];

const mockBottomSidebarMapData = [
  { id: 'definicoes', icon: 'config', label: 'Definições', path: '/settings' },
  { id: 'ajuda', icon: 'help', label: 'Ajuda', path: '/help' }
];

const mockMenuMapData = [
  { id: 'canais-digitais', label: 'Canais Digitais', parentSidebarId: 'registos' },
  { id: 'operacoes', label: 'Operações', parentSidebarId: 'registos' },
  { id: 'relatorios', label: 'Relatórios', parentSidebarId: 'vendas' },
  { id: 'configuracoes', label: 'Configurações', parentSidebarId: 'definicoes' }
];

const mockSubmenuMapData = [
  {
    id: 'mobile-banking',
    label: 'Mobile Banking',
    parentMenuId: 'canais-digitais',
    submenuLinksIds: ['mb-overview', 'mb-transactions']
  },
  {
    id: 'internet-banking',
    label: 'Internet Banking',
    parentMenuId: 'canais-digitais',
    submenuLinksIds: ['ib-overview', 'ib-accounts']
  },
  {
    id: 'atm-operations',
    label: 'Operações ATM',
    parentMenuId: 'operacoes',
    submenuLinksIds: ['atm-withdrawals', 'atm-deposits']
  }
];

const mockSubmenuLinks = [
  {
    id: 'mb-overview',
    label: 'Visão Geral',
    parentSubmenuId: 'mobile-banking',
    path: '/mobile-banking/overview',
    description: 'Visão geral do mobile banking'
  },
  {
    id: 'mb-transactions',
    label: 'Transações',
    parentSubmenuId: 'mobile-banking',
    path: '/mobile-banking/transactions',
    description: 'Transações mobile banking'
  },
  {
    id: 'ib-overview',
    label: 'Visão Geral',
    parentSubmenuId: 'internet-banking',
    path: '/internet-banking/overview',
    description: 'Visão geral do internet banking'
  },
  {
    id: 'ib-accounts',
    label: 'Contas',
    parentSubmenuId: 'internet-banking',
    path: '/internet-banking/accounts',
    description: 'Gestão de contas'
  },
  {
    id: 'atm-withdrawals',
    label: 'Levantamentos',
    parentSubmenuId: 'atm-operations',
    path: '/atm/withdrawals',
    description: 'Operações de levantamento'
  },
  {
    id: 'atm-deposits',
    label: 'Depósitos',
    parentSubmenuId: 'atm-operations',
    path: '/atm/deposits',
    description: 'Operações de depósito'
  }
];

// Mock the data module
mock.module('./data/menuData', () => ({
  sidebarMapData: mockSidebarMapData,
  bottomSidebarMapData: mockBottomSidebarMapData,
  menuMapData: mockMenuMapData,
  submenuMapData: mockSubmenuMapData,
  submenuLinks: mockSubmenuLinks
}));

describe('Utils Functions', () => {
  describe('getMenusBySidebarId', () => {
    it('should return menus for existing sidebar id', () => {
      const menus = getMenusBySidebarId('registos');
      expect(menus).toHaveLength(2);
      expect(menus[0].id).toBe('canais-digitais');
      expect(menus[1].id).toBe('operacoes');
    });

    it('should return menus for sidebar id with different case', () => {
      const menus = getMenusBySidebarId('REGISTOS');
      expect(menus).toHaveLength(2);
      expect(menus[0].parentSidebarId).toBe('registos');
    });

    it('should return empty array for non-existing sidebar id', () => {
      const menus = getMenusBySidebarId('non-existing');
      expect(menus).toHaveLength(0);
    });

    it('should return single menu for sidebar with one menu', () => {
      const menus = getMenusBySidebarId('vendas');
      expect(menus).toHaveLength(1);
      expect(menus[0].id).toBe('relatorios');
    });

    it('should handle empty string input', () => {
      const menus = getMenusBySidebarId('');
      expect(menus).toHaveLength(0);
    });
  });

  describe('getSidebarLabelById', () => {
    it('should return label for existing sidebar id from main sidebar', () => {
      const label = getSidebarLabelById('home');
      expect(label).toBe('Início');
    });

    it('should return label for existing sidebar id from bottom sidebar', () => {
      const label = getSidebarLabelById('definicoes');
      expect(label).toBe('Definições');
    });

    it('should return id itself for non-existing sidebar id', () => {
      const label = getSidebarLabelById('non-existing');
      expect(label).toBe('non-existing');
    });

    it('should handle empty string input', () => {
      const label = getSidebarLabelById('');
      expect(label).toBe('');
    });

    it('should be case sensitive', () => {
      const label = getSidebarLabelById('HOME');
      expect(label).toBe('HOME'); // Should return the id since case doesn't match
    });

    it('should handle special characters in id', () => {
      const label = getSidebarLabelById('special-chars-@#$');
      expect(label).toBe('special-chars-@#$');
    });
  });

  describe('getSubmenusByMenuId', () => {
    it('should return submenus for existing menu id', () => {
      const submenus = getSubmenusByMenuId('canais-digitais');
      expect(submenus).toHaveLength(2);
      expect(submenus[0].id).toBe('mobile-banking');
      expect(submenus[1].id).toBe('internet-banking');
    });

    it('should return single submenu for menu with one submenu', () => {
      const submenus = getSubmenusByMenuId('operacoes');
      expect(submenus).toHaveLength(1);
      expect(submenus[0].id).toBe('atm-operations');
    });

    it('should return empty array for non-existing menu id', () => {
      const submenus = getSubmenusByMenuId('non-existing');
      expect(submenus).toHaveLength(0);
    });

    it('should return empty array for menu without submenus', () => {
      const submenus = getSubmenusByMenuId('relatorios');
      expect(submenus).toHaveLength(0);
    });

    it('should handle empty string input', () => {
      const submenus = getSubmenusByMenuId('');
      expect(submenus).toHaveLength(0);
    });
  });

  describe('getSubmenuLinksBySubmenuId', () => {
    it('should return links for existing submenu id', () => {
      const links = getSubmenuLinksBySubmenuId('mobile-banking');
      expect(links).toHaveLength(2);
      expect(links[0].id).toBe('mb-overview');
      expect(links[1].id).toBe('mb-transactions');
    });

    it('should return links with all required properties', () => {
      const links = getSubmenuLinksBySubmenuId('internet-banking');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveProperty('id');
      expect(links[0]).toHaveProperty('label');
      expect(links[0]).toHaveProperty('path');
      expect(links[0]).toHaveProperty('description');
      expect(links[0]).toHaveProperty('parentSubmenuId');
    });

    it('should return empty array for non-existing submenu id', () => {
      const links = getSubmenuLinksBySubmenuId('non-existing');
      expect(links).toHaveLength(0);
    });

    it('should handle empty string input', () => {
      const links = getSubmenuLinksBySubmenuId('');
      expect(links).toHaveLength(0);
    });

    it('should verify parent submenu relationship', () => {
      const links = getSubmenuLinksBySubmenuId('atm-operations');
      expect(links).toHaveLength(2);
      links.forEach((link) => {
        expect(link.parentSubmenuId).toBe('atm-operations');
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null input gracefully', () => {
      // @ts-expect-error - Testing null input
      expect(getMenusBySidebarId(null)).toHaveLength(0);
      // @ts-expect-error - Testing null input
      expect(getSidebarLabelById(null)).toBe('');
      // @ts-expect-error - Testing null input
      expect(getSubmenusByMenuId(null)).toHaveLength(0);
      // @ts-expect-error - Testing null input
      expect(getSubmenuLinksBySubmenuId(null)).toHaveLength(0);
    });

    it('should handle undefined input gracefully', () => {
      // @ts-expect-error - Testing undefined input
      expect(getMenusBySidebarId(undefined)).toHaveLength(0);
      // @ts-expect-error - Testing undefined input
      expect(getSidebarLabelById(undefined)).toBe('');
      // @ts-expect-error - Testing undefined input
      expect(getSubmenusByMenuId(undefined)).toHaveLength(0);
      // @ts-expect-error - Testing undefined input
      expect(getSubmenuLinksBySubmenuId(undefined)).toHaveLength(0);
    });
  });

  describe('Data Integrity', () => {
    it('should maintain referential integrity between data structures', () => {
      // Test that all menu items reference valid sidebar ids
      const allSidebarIds = [...mockSidebarMapData, ...mockBottomSidebarMapData].map(
        (item) => item.id
      );
      mockMenuMapData.forEach((menu) => {
        expect(allSidebarIds).toContain(menu.parentSidebarId);
      });
    });

    it('should maintain referential integrity for submenu links', () => {
      // Test that all submenu links reference valid submenu ids
      const allSubmenuIds = mockSubmenuMapData.map((submenu) => submenu.id);
      mockSubmenuLinks.forEach((link) => {
        expect(allSubmenuIds).toContain(link.parentSubmenuId);
      });
    });
  });
});
