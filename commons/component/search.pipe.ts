import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {
  transform<T>(value: T[] | null | undefined, propNames: (keyof T)[], searchText?: string): T[] {
    if (!value || !value.length) {
      return [];
    }

    if (!searchText) {
      return value;
    }

    return value.filter(v => {
      for (const key of propNames) {
        if (v[key] && (v[key]! as string).toLowerCase().includes(searchText!)) {
          return true;
        }
      }
      return false;
    });
  }
}
