import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MovieSearchControlModule } from '../movie-search-control/movie-search-control.module';
import { MyMovieListComponent } from './my-movie-list.component';
import {FastSvgModule} from '@push-based/ngx-fast-svg';

const routes: Routes = [
  {
    path: '',
    component: MyMovieListComponent,
  },
];

@NgModule({
  declarations: [MyMovieListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MovieSearchControlModule,
    FastSvgModule,
  ],
})
export class MyMovieListModule {}
