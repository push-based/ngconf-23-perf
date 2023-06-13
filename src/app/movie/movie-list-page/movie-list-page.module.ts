import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ElementVisibilityDirective } from '../../shared/cdk/element-visibility/element-visibility.directive';
import { MovieModule } from '../movie.module';
import { MovieListPageComponent } from './movie-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: MovieListPageComponent,
  },
];

@NgModule({
  declarations: [MovieListPageComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MovieModule,
    ElementVisibilityDirective,
  ],
})
export class MovieListPageModule {}
