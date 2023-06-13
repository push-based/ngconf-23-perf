import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'list/:category',
    loadChildren: () =>
      import('./movie/movie-list-page/movie-list-page.module').then(
        (m) => m.MovieListPageModule
      ),
  },
  {
    path: 'list/genre/:id',
    loadChildren: () =>
      import('./movie/movie-list-page/movie-list-page.module').then(
        (file) => file.MovieListPageModule
      ),
  },
  {
    path: 'movie/:id',
    loadChildren: () =>
      import('./movie/movie-detail-page/movie-detail-page.module').then(
        (file) => file.MovieDetailPageModule
      ),
  },
  {
    path: 'search/:query',
    loadChildren: () =>
      import('./movie/movie-search-page/movie-search-page.module').then(
        (file) => file.MovieSearchPageModule
      ),
  },
  {
    path: 'my-movies',
    loadChildren: () =>
      import('./movie/my-movie-list/my-movie-list.module').then(
        (file) => file.MyMovieListModule
      ),
  },
  {
    path: '',
    redirectTo: 'list/popular',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadChildren: () => {
      return import('./not-found-page/not-found-page.module').then(
        (m) => m.NotFoundPageModule
      );
    },
  },
];

