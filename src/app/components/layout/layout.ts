import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from "../header/header";
import { ChartContainer } from '../chart-container/chart-container';

@Component({
  selector: 'app-layout',
  imports: [Header,ChartContainer],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {

}
