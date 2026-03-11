import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { StockRepository } from '@repositories/stock-repository';
import { KeyValue } from '@angular/common';
import { StockResponse } from '@models/responses';
import { AppStore } from '@state/app-store';
import { Symbol } from '@state/settings/settings-model';

@Component({
  selector: 'app-symbol-search-dialog',
  templateUrl: './symbol-search-dialog.html',
  styleUrl: './symbol-search-dialog.css',
  standalone: true,
  imports: [DialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SymbolSearchDialog implements OnInit, AfterViewInit, OnDestroy {
  data = inject(DIALOG_DATA);

  //#region  properties
  #destroy$ = new Subject<void>();
  #searchInput$ = new Subject<string>();

  protected searchInput = viewChild<ElementRef | null>('searchInput');

  query = signal<string>('');
  results = signal<StockResponse[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  activeIndex = signal<number>(-1);
  //#endregion

  //#region constructor
  constructor(
    public dialogRef: DialogRef<SymbolSearchDialog>,
    private stockRepository: StockRepository,
    private appStore: AppStore,
  ) {}
  //#endregion

  //#region  lifecycle hooks
  ngOnInit(): void {
    this.#searchInput$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.#destroy$))
      .subscribe((query) => {
        this.#getStocks(query);
      });

    this.query.set(this.data.query);
    this.#getStocks(this.data.query);
  }

  ngAfterViewInit(): void {
    // Auto-focus the input after the view is ready
    setTimeout(() => this.searchInput()?.nativeElement.focus());
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }
  //#endregion

  onQueryChange(value: string) {
    this.query.set(value);
    this.#searchInput$.next(value);
  }

  onKeyDown(event: KeyboardEvent): void {
    const list = this.results();
    const max = list.length - 1;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.update((i) => Math.min(i + 1, max));
      this.#scrollActiveIntoView();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.update((i) => Math.max(i - 1, 0));
      this.#scrollActiveIntoView();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = list[this.activeIndex()];
      if (item) this.select(item);
    } else if (event.key === 'Escape') {
      this.closeDialog();
    }
  }

  select(item: StockResponse) {
    var selectedSymbol: Symbol = {
      id: item.id,
      symbol: item.name,
      type: item.type,
      expiry: item.expiryDate,
      strike: item.strikePrice,
      optionType: item.optionType,
    };
    this.appStore.settings.setSymbol(selectedSymbol);
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  //#region private methods

  #scrollActiveIntoView(): void {
    setTimeout(() => {
      const el = document.querySelector('.result-item.active');
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  #getStocks(query: string) {
    this.loading.set(true);
    this.results.set([]);
    this.error.set(null);
    const queryParams: KeyValue<string, string | number>[] = [{ key: 'count', value: 20 }];
    if (query) queryParams.push({ key: 'query', value: query });
    this.stockRepository.getStocks(queryParams).subscribe({
      next: (res) => {
        if (res.data) this.results.set(res.data);
      },
      error: (err) => {
        this.error.set(err.message);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
  //#endregion
}
