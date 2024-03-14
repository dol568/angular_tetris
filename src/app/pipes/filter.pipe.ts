import { Pipe, PipeTransform } from '@angular/core';
import { TableData } from '../model/Panel';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(
    values: TableData[],
    field: keyof TableData,
    term: string
  ): TableData[] {
    if (!values) {
      return [];
    }

    if (!term) {
      return values;
    }

    term = term.toLowerCase().trim();

    return [...values].filter((value) =>
      value[field].toString().toLowerCase().includes(term)
    );
  }
}
