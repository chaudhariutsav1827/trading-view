import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { Header } from '../header/header';
import { ChartContainer } from '../chart-container/chart-container';
import { Dialog } from '@angular/cdk/dialog';
import { SymbolSearchDialog } from '@components/symbol-search-dialog/symbol-search-dialog';

@Component({
  selector: 'app-layout',
  imports: [Header, ChartContainer],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  readonly #dialog = inject(Dialog);

  @HostListener('document:keydown', ['$event'])
  onDocumentKeyDown(event: KeyboardEvent) {
    // Ignore if dialog is already open
    if (this.#dialog.openDialogs.length > 0) return;

    // Ignore if focus is on an input/textarea/select
    const tag = (event.target as HTMLElement).tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;

    // Ignore modifier combos (Ctrl+S, Cmd+K, etc.)
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    // Only trigger on single printable characters
    if (event.key.length !== 1 || !/[a-zA-Z0-9]/.test(event.key)) return;

    (document.activeElement as HTMLElement)?.blur();

    this.#dialog.open(SymbolSearchDialog, {
      minWidth: '500px',
      maxWidth: '96vw',
      maxHeight: '50vh',
      autoFocus: false,
      data: { query: event.key },
    });
  }
}
