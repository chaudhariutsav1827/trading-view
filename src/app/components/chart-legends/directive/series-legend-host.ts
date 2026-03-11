import { Directive, input, OnInit, ViewContainerRef } from '@angular/core';
import { LegendRegistry } from '@services/legend-registry';

@Directive({
  selector: '[appSeriesLegendHost]',
})
export class SeriesLegendHost implements OnInit {
  series = input.required<any>();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private legendRegistry: LegendRegistry,
  ) {}

  ngOnInit() {
    const component = this.legendRegistry.getLegendComponent(this.series().type);
    if (!component) return;
    const ref = this.viewContainerRef.createComponent(component);
    ref.setInput('series', this.series());
  }
}
