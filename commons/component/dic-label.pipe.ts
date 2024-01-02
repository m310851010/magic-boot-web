import { Pipe, PipeTransform } from '@angular/core';
import { map, Observable } from 'rxjs';

import { DicItem, DicService } from '@xmagic/nzx-antd/service';

import { DicItemPipe } from './dic-item.pipe';

@Pipe({
  name: 'dicLabel',
  standalone: true
})
export class DicLabelPipe implements PipeTransform {
  private readonly dicMap: DicItemPipe;
  constructor(dicService: DicService) {
    this.dicMap = new DicItemPipe(dicService);
  }

  transform(
    key: string | number | null,
    dicItemsOrKey: Observable<DicItem[]> | string
  ): Observable<string | null | undefined> {
    return this.dicMap.transform(key, dicItemsOrKey).pipe(map(v => v?.label));
  }
}
