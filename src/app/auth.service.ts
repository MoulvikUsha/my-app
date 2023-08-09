import { HttpClient, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements HttpInterceptor {

  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post(`http://localhost:3000/login`, data)
  }

  loggedIn() {
    return !!localStorage.getItem('accessToken');
  }

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
}
