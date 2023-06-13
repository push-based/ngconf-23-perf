import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  Inject,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { RxActionFactory } from '@rx-angular/state/actions';
import { filter, fromEvent, map } from 'rxjs';

type Actions = { visible: boolean; onDestroy: void };

@Directive({
  selector: '[elementVisible]',
  providers: [RxActionFactory],
  standalone: true,
})
export class ElementVisibilityDirective {
  signals = this.actionsF.create();

  @Output() elementVisible = this.signals.visible$;

  constructor(
    private actionsF: RxActionFactory<Actions>,
    private elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    if (isPlatformBrowser(platformId)) {
      fromEvent(document, 'scroll')
        .pipe(
          filter(() => !!document.scrollingElement),
          map(() => {
            const { scrollTop, clientHeight } = document.scrollingElement!;
            return (
              scrollTop + clientHeight + 100 >=
              elementRef.nativeElement.offsetTop
            );
          })
        )
        .subscribe(this.signals.visible);
    }
  }
}
