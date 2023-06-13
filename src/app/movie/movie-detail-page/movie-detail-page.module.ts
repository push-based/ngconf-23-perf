import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DetailGridModule } from '../../ui/component/detail-grid/detail-grid.module';
import { StarRatingModule } from '../../ui/pattern/star-rating/star-rating.module';
import { MovieModule } from '../movie.module';
import { MovieDetailPageComponent } from './movie-detail-page.component';
import {FastSvgModule} from '@push-based/ngx-fast-svg';

const routes: Routes = [
  {
    path: '',
    component: MovieDetailPageComponent,
  },
];

@NgModule({
  declarations: [MovieDetailPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DetailGridModule,
    MovieModule,
    StarRatingModule,
    FastSvgModule,
  ],
})
export class MovieDetailPageModule {}
