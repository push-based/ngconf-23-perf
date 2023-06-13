import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  concat,
  exhaustMap,
  filter,
  map,
  Observable,
  shareReplay,
  Subject, switchMap, tap,
} from 'rxjs';
import { TMDBMovieModel } from '../../shared/model/movie.model';
import { MovieService } from '../movie.service';

@Component({
  selector: 'movie-list-page',
  templateUrl: './movie-list-page.component.html',
  styleUrls: ['./movie-list-page.component.scss'],
})
export class MovieListPageComponent implements OnInit {
  movies$ = this.activatedRoute.params.pipe(switchMap(params => {
    if (params['category']) {
      return this.paginate((page) =>
        this.movieService.getMovieList(params['category'], page)
      );
    } else {
      return this.paginate((page) =>
        this.movieService.getMoviesByGenre(params['id'], page)
      );
    }
  }));

  readonly paginate$ = new Subject<boolean>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit() {

  }

  private paginate(
    requestFn: (page: string) => Observable<TMDBMovieModel[]>
  ): Observable<TMDBMovieModel[]> {
    let movieCache: TMDBMovieModel[] = [];
    return concat(
      requestFn('1'),
      this.paginate$.pipe(
        filter(Boolean),
        exhaustMap((v, i) =>
          requestFn(`${i + 2}`).pipe(
            map((movies) => [...movieCache, ...movies])
          )
        )
      )
    ).pipe(tap(movies => movieCache = movies), shareReplay(10));
  }
}
