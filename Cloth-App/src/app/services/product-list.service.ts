import { Injectable } from '@angular/core';
import { product } from '../shared/productlist-model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductListService {

  readonly baseUrl = 'https://localhost:44337/api/products';
  formData: product = new product();
  list: product[] = [];
  constructor(private http: HttpClient) {

  }

  postProduct() {
    return this.http.post(this.baseUrl, this.formData);
  }

  getAll() {
    return this.http.get<product[]>(this.baseUrl);
    // this.http.get(this.baseUrl).toPromise().then(res =>
    //   this.list = res as product[]
    // );
  }

  getById(id: number) : Observable<any>{
    return this.http.get(this.baseUrl + '/' + id);
  }

  updateProductDetails() {
    return this.http.put(`${this.baseUrl}/${this.formData.id}`, this.formData);
  }

  deletePaymentDetail(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
