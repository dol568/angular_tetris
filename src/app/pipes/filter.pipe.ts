import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value: any, field: any, args?: any): any {

    if(!value)return null;
    if(!args)return value;

    args = args.toLowerCase().trim();

    return value.filter(function(item){
      return JSON.stringify(item[field]).toLowerCase().includes(args);
    });
  }
}
