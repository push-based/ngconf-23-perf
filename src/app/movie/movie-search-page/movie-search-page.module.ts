import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MovieModule } from '../movie.module';
import { MovieSearchPageComponent } from './movie-search-page.component';

const routes: Routes = [
  {
    path: '',
    component: MovieSearchPageComponent,
  },
];

@NgModule({
  declarations: [MovieSearchPageComponent],
  imports: [CommonModule, MovieModule, RouterModule.forChild(routes)],
})
export class MovieSearchPageModule {}
