import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FastSvgModule } from '@push-based/ngx-fast-svg';
import { AppShellModule } from './app-shell/app-shell.module';

import { routes } from './app.routes';
import { ReadAccessInterceptor } from './read-access.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom(AppShellModule), importProvidersFrom(FastSvgModule.forRoot({
    url: (name: string) => `assets/svg-icons/${name}.svg`,
    defaultSize: '12',
  })), provideRouter(routes),  {
    provide: HTTP_INTERCEPTORS,
    useClass: ReadAccessInterceptor,
    multi: true,
  }, ]
};
