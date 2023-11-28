import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  standalone: true
})
export class SortPipe implements PipeTransform {

  transform(array: any, reverse: boolean = false, field: string): any[] {

    if (!(Array.isArray(array))) {
      return array;
    }

    let sortedArray = array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });

    if (reverse) {
      return sortedArray.reverse();
    } else {
      return sortedArray
    }
    }


}
