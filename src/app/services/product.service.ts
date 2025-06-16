import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../domain/product';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Promise<Product[]> {
    return lastValueFrom(
      this.http.get<Product[]>('https://fakestoreapi.com/products')
    );
  }
}
