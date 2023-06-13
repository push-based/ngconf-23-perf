import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieModule } from '../movie.module';
import { MovieSearchControlComponent } from './movie-search-control.component';

@NgModule({
  declarations: [MovieSearchControlComponent],
  imports: [CommonModule, MovieModule],
  exports: [MovieSearchControlComponent],
})
export class MovieSearchControlModule {}
