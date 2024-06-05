import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(
    values: any[],
    field: any,
    term: string,
    exact: boolean = false
  ): any[] {
    if (!values) {
      return [];
    }

    if (!term) {
      return values;
    }

    return [...values].filter((value) => {
      if (exact) {
        return value[field] === term;
      } else {
        term = term.toLowerCase().trim();
        return value[field].toString().toLowerCase().includes(term);
      }
    });
  }
}
