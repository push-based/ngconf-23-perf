import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetModule } from '@rx-angular/template/let';
import { SearchBarComponent } from './search-bar.component';
import {FastSvgModule} from '@push-based/ngx-fast-svg';

@NgModule({
  declarations: [SearchBarComponent],
  imports: [CommonModule, LetModule, FastSvgModule],
  exports: [SearchBarComponent],
})
export class SearchBarModule {}
