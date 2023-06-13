import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'movieImage',
})
export class MovieImagePipe implements PipeTransform {
  transform(value?: string, width = 342): string {
    if (value) {
      return `https://image.tmdb.org/t/p/w${width}/${value}`;
    }
    return '/assets/images/no_poster_available.jpg';
  }
}
