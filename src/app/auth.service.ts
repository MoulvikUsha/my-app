import { HttpClient, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements HttpInterceptor {

  apiUrl = 'http://localhost:3000/user';
  
  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post(`http://localhost:3000/login`, data)
  }

  // loggedIn() {
  //   return !!localStorage.getItem('accessToken');
  // }

  first() {
    return this.http.get(`http://localhost:3000/first`)
  }

  intercept(req: any, next: any): Observable<HttpEvent<any>> {
    let tokenn = localStorage.getItem('accessToken');
    let tokenisedReq = req.clone({
      setHeaders: {
        Authorisation: `Bearer ${tokenn}`
      }
    });
    return next.handle(tokenisedReq);
  }


  getAllUsers() {
    return this.http.get(this.apiUrl);
  }

  getUserById(id: any) {
    return this.http.get(this.apiUrl + '/' + id)
  }

  registerUser(data: any) {
    return this.http.post(this.apiUrl, data)
  }

  updateUser(code: any, data: any) {
    return this.http.put(this.apiUrl + '/' + code, data)
  }

  isLoggedIn() {
    return sessionStorage.getItem('username') != null
  }

  getAllRoles() {
    return this.http.get('http://localhost:3000/roles');
  }

  getUserRole() {
    return sessionStorage.getItem('role') != null? sessionStorage.getItem('role')?.toString(): '';
  }
}
