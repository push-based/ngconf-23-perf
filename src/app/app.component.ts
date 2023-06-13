import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShellModule } from './app-shell/app-shell.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppShellModule],
  template: `
    <app-shell><router-outlet></router-outlet></app-shell>
  `
})
export class AppComponent {}
