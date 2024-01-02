import { Pipe, PipeTransform } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DicItem, DicService } from '@xmagic/nzx-antd/service';
import { dicMap } from '../utils';
import { NzxUtils } from '@xmagic/nzx-antd/util';

@Pipe({
  name: 'dicItem',
  standalone: true
})
export class DicItemPipe implements PipeTransform {
  constructor(private dicService: DicService) {}
  transform(
    key: string | number | undefined | null,
    dicItemsOrKey: Observable<DicItem[] | undefined | null> | string
  ): Observable<DicItem> {
    const dic$ = NzxUtils.isString(dicItemsOrKey) ? this.dicService.getDic(dicItemsOrKey) : dicItemsOrKey;
    return dic$.pipe(
      dicMap(),
      map(v => v[key!] || {})
    );
  }
}
