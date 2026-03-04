import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderStore {
  private loader = signal<boolean>(false);

  readonly loader$ = this.loader.asReadonly();

  showLoader() {
    this.loader.set(true);
  }

  hideLoader() {
    this.loader.set(false);
  }
}
