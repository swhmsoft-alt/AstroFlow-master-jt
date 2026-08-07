import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { NAVIGATION } from '../../config/site';
import type { NavItem } from '../../config/site';

interface MobileMenuProps {
  /** Locale-aware navigation items to render. Defaults to the shared NAVIGATION. */
  items?: NavItem[];
  /** Translated text for the hamburger button aria-label */
  toggleMenuLabel?: string;
  /** Translated text for the dialog title (screen-reader only) */
  navigationMenuLabel?: string;
  /** Translated text for the dialog description (screen-reader only) */
  mainNavigationMenuLabel?: string;
  /** Translated text for the close button aria-label */
  closeMenuLabel?: string;
  /** Translated text for the CTA button */
  requestQuoteLabel?: string;
}

function NavItemWithChildren({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);

  if (!item.children || item.children.length === 0) {
    return (
      <Dialog.Close asChild key={item.href}>
        <a
          href={item.href}
          onClick={onClose}
          className="block px-4 py-3 text-base font-medium rounded-lg transition-all"
          style={{ color: 'color-mix(in srgb, var(--theme-text) 75%, transparent)' }}
          onMouseOver={(e) => { e.currentTarget.style.color = 'var(--theme-primary)'; e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-primary) 10%, transparent)' }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'color-mix(in srgb, var(--theme-text) 75%, transparent)'; e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          {item.name}
        </a>
      </Dialog.Close>
    );
  }

  return (
    <div style={{ borderBottom: '1px solid color-mix(in srgb, var(--theme-primary) 10%, transparent)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-lg transition-all"
        style={{ color: 'color-mix(in srgb, var(--theme-text) 75%, transparent)' }}
        onMouseOver={(e) => { e.currentTarget.style.color = 'var(--theme-primary)'; e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-primary) 10%, transparent)' }}
        onMouseOut={(e) => { e.currentTarget.style.color = 'color-mix(in srgb, var(--theme-text) 75%, transparent)'; e.currentTarget.style.backgroundColor = 'transparent' }}
      >
        <span>{item.name}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-3 space-y-3">
          {item.children.map((column) => (
            <div key={column.heading}>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1.5 mt-3 first:mt-0"
                style={{ color: 'var(--theme-primary)' }}
              >
                {column.heading}
              </h4>
              <ul className="space-y-0.5">
                {column.items.map((child) => (
                  <li key={child.name}>
                    <Dialog.Close asChild>
                      <a
                        href={child.href}
                        onClick={onClose}
                        className="block px-3 py-2 text-sm rounded-md transition-all"
                        style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }}
                        onMouseOver={(e) => { e.currentTarget.style.color = 'var(--theme-primary)'; e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-primary) 10%, transparent)' }}
                        onMouseOut={(e) => { e.currentTarget.style.color = 'color-mix(in srgb, var(--theme-text) 65%, transparent)'; e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        {child.name}
                      </a>
                    </Dialog.Close>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MobileMenu({
  items = NAVIGATION,
  toggleMenuLabel = 'Toggle menu',
  navigationMenuLabel = 'Navigation Menu',
  mainNavigationMenuLabel = 'Main navigation menu',
  closeMenuLabel = 'Close menu',
  requestQuoteLabel = 'Request Quote',
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="lg:hidden p-2 rounded-lg transition-colors"
          style={{ color: 'color-mix(in srgb, var(--theme-text) 75%, transparent)' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          aria-label={toggleMenuLabel}
        >
          <Menu className="h-6 w-6" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 lg:hidden" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 50%, transparent)' }} />
        <Dialog.Content className="fixed top-0 left-0 right-0 z-50 lg:hidden max-h-[85vh] overflow-y-auto"
          style={{ backgroundColor: 'var(--theme-surface)', borderBottom: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}
        >
          <Dialog.Title className="sr-only">{navigationMenuLabel}</Dialog.Title>
          <Dialog.Description className="sr-only">{mainNavigationMenuLabel}</Dialog.Description>
          <div className="container mx-auto px-4 py-6 space-y-2">
            {items.map((item) => (
              <NavItemWithChildren key={item.href} item={item} onClose={() => setOpen(false)} />
            ))}
            <div className="pt-4">
              <Dialog.Close asChild>
                <a
                  href="https://www.bozemetal.com/contact" target="_blank" rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block text-center px-6 py-3 text-sm font-semibold rounded-lg shadow-md transition-all"
                  style={{ backgroundColor: 'var(--theme-primary)', color: 'var(--theme-text)' }}
                >
                  {requestQuoteLabel}
                </a>
              </Dialog.Close>
            </div>
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-2 rounded-lg transition-colors"
              style={{ color: 'color-mix(in srgb, var(--theme-text) 75%, transparent)' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              aria-label={closeMenuLabel}
            >
              <X className="h-6 w-6" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
