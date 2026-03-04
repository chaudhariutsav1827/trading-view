import { Component, signal } from '@angular/core';
import { Layout } from './components/layout/layout';

@Component({
  selector: 'app-root',
  template: ` <app-layout /> `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  imports: [Layout],
})
export class App {}
