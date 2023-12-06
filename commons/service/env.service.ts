import { Injectable } from '@angular/core';

/**
 * 以服务的形式提供environment
 */
@Injectable({
  providedIn: 'root'
})
export class EnvService {
  basePath!: string;
  constructor() {}
}
