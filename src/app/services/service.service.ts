import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../config/environment';
import { delay } from 'rxjs/operators';
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inventoryStatus: string;
  image: string;
}
@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  constructor(public http: HttpClient) {}

  loginData(userlogin: any) {
    console.log('aaaaaaaaaaaa', userlogin);
    return this.http.post<any>(
      'http://localhost:3000/submitloginData',
      userlogin
    );
  }
  getUsers(loggedInUseremail: any) {
    console.log('=====================', loggedInUseremail);
    return this.http.post('http://localhost:3000/dashboardData', {
      loggedInUseremail,
    });
  }
  deleteUser(deleteuserData: any) {
    return this.http.post('http://localhost:3000/deleteUser', {
      deleteuserData,
    });
  }
  updateUser(Updatedata: any, id: any, imagePath: any) {
    return this.http.post('http://localhost:3000/UpdateUser', {
      Updatedata,
      id,
      imagePath,
    });
  }
  userData(userFormValue: FormData) {
    console.log('Sending user data', userFormValue);
    return this.http.post<any>(
      'http://localhost:3000/submitUserData',
      userFormValue
    );
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:3000/products');
  }
  // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  /* New Services V3 */

  addUser(userFormValue: FormData) {
    return this.http.post<any>(
      `${env.baseUrl}/userServices/addUser`,
      userFormValue
    );
  }
  uploadfile(formData: FormData) {
    console.log(formData);
    return this.http.post('http://localhost:3000/uploadfile', formData);
  }
  loginUser(userlogin: any) {
    return this.http.post<any>(
      `${env.baseUrl}/userServices/loginUser`,
      userlogin
    );
  }
  getAllUser(payload: any) {
    console.log('	Shreyaaaaaaaaaaaaaaaaaaaaaaaaaaa' + payload);

    return this.http.post(`${env.baseUrl}/userServices/getAllUser`, payload);
  }
  deleteUserById(payload: any) {
    return this.http.post(
      `${env.baseUrl}/userServices/deleteUserById`,
      payload
    );
  }
  updateUserById(payload: any) {
    debugger;
    return this.http.post(
      `${env.baseUrl}/userServices/updateUserById`,
      payload
    );
  }
  getUserById(payload: any) {
    return this.http.post(`${env.baseUrl}/userServices/getUser`, payload);
  }
  loginUserinfo(payload: any) {
    // console.log("aaaaaaaaaaaa",userlogin);
    return this.http.post<any>(
      `${env.baseUrl}/userServices/loginUserinfo`,
      payload
    );
  }
  addTask(payload: any) {
    debugger;
    console.log('addTask Serviceeee', payload);

    return this.http.post<any>(`${env.baseUrl}/taskServices/addTask`, payload);
  }
  getTask(payload: any) {
    console.log('getTask serviceService', payload);
    return this.http.post<any>(`${env.baseUrl}/taskServices/getTask`, payload);
  }
  isDeleted(payload: any) {
    debugger;
    console.log('isDeleted Service ', payload);

    return this.http.post<any>(
      `${env.baseUrl}/taskServices/deleteTask`,
      payload
    );
  }
  updateTask(payload: any) {
    return this.http.post<any>(
      `${env.baseUrl}/taskServices/updateTask`,
      payload
    );
  }
  getTaskById(id: any) {
    return this.http.post<any>(`${env.baseUrl}/taskServices/getTaskById`, {
      id,
    });
  }
  otpMail(payload: any) {
    return this.http.post<any>(`${env.baseUrl}/mailServices/otpMail`, payload);
  }

  URLlog(payload: any) {
    return this.http.post<any>(`${env.baseUrl}/URLlog`, payload);
  }
  // C:\Users\aryan\OneDrive\Desktop\angular_learn\server\utils\interceptor.json
  userActivityInfo(payload: any) {
    return this.http.post<any>(
      `${env.baseUrl}/userServices/userActivityInfo`,
      payload
    );
  }
  dashboardData(payload: any) {
    return this.http.post<any>(
      `${env.baseUrl}/dashboardService/dashboardData`,
      payload
    );
  }
}
