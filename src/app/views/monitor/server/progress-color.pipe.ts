import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'progressColor',
  standalone: true
})
export class ProgressColorPipe implements PipeTransform {
  transform(value: number): string {
    const values = value;
    if (values <= 30) {
      return '#49aa19';
    }
    if (values <= 80) {
      return '#1890fe';
    }
    return '#e60000';
  }
}
