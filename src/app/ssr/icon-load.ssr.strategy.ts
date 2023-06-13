import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { join } from 'path';
import { readFileSync } from 'fs';
@Injectable()
export class SvgLoadStrategySsr implements SvgLoadStrategy {
  load(url: string): Observable<string> {
    const iconPath = join(
      process.cwd(),
      'dist',
      'angular-perf-ngbe',
      'browser',
      url
    );
    const iconSVG = readFileSync(iconPath, 'utf8');
    return of(iconSVG);
  }
}
