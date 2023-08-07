import { HttpClient, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements HttpInterceptor {

  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post(`http://localhost:3000/login`, data)
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  intercept(req: any, next: any) {
    let tokenn = this.getToken();
    console.log(tokenn);
    
    let tokenisedReq = req.clone({
      setHeaders: {
        Authorisation: `Bearer ${this.getToken()}`
      }
    })
    return next.handle(tokenisedReq);
  }
}
