import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { SymbolSearchDialog } from '@components/symbol-search-dialog/symbol-search-dialog';
import { AppStore } from '@state/app-store';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  constructor(
    private dialog: Dialog,
    protected appStore: AppStore,
  ) {}

  openSymbolSearchDialog() {
    this.dialog.open(SymbolSearchDialog, {
      minWidth: '500px',
      maxWidth: '96vw',
      maxHeight: '50vh',
      data: {
        query: this.appStore.settings.symbol$().symbol,
      },
    });
  }

  toggleTheme() {
    // TODO: implement theme toggle
  }

  importData() {
    // TODO: implement data import
  }

  exportScreenshot() {
    // TODO: implement screenshot export
  }

  openHelp() {
    // TODO: implement help dialog
  }
}
