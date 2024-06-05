import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  standalone: true
})
export class SortPipe implements PipeTransform {

  transform(values: any, reverse: boolean = false, field: string): any[] {
    if (!Array.isArray(values)) {
      return values;
    }

    return values.sort((a: any, b: any) => {
      
      if (a[field] instanceof Date && b[field] instanceof Date) {
        return !reverse ? a[field].getTime() - b[field].getTime() : b[field].getTime() - a[field].getTime();
      } else {

        if (reverse) {
          return a[field] < b[field] ? 1 : a[field] > b[field] ? -1 : 0;
        } else {
          return a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0;
        }
      }
    });
  }
}
