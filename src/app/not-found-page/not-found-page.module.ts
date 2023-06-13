import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page.component';
import {FastSvgModule} from '@push-based/ngx-fast-svg';

const routes: Routes = [
  {
    path: '',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [RouterModule.forChild(routes), CommonModule, FastSvgModule],
})
export class NotFoundPageModule {}
