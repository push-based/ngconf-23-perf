import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { MovieModel } from '../movie-model';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent implements AfterViewInit {
  @Input() movies!: MovieModel[];

  @ViewChild('movieList') movieList!: ElementRef<HTMLElement>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {}

  ngAfterViewInit() {
    fromEvent(this.document, 'resize').subscribe(() => {
      this.movieList.nativeElement.classList.add('resized');
    });
  }

  navToDetail(movie: MovieModel): void {
    this.router.navigate(['/movie', movie.id]);
  }
}
