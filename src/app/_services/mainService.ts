import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';
// @ts-ignore
import config from '../config/config.json';
@Injectable({ providedIn: 'root' })
export class MainService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`${config.apiUrl}/users`);
  }

  addProduct(data) {
    console.log(data)
    console.log('add Product')
    return this.http.post(`${config.apiUrl}/Product`, data);
  }

  delete(id: number) {
    return this.http.delete(`${config.apiUrl}/users/${id}`);
  }
}
