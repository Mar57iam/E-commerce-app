import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  isLoggedIn = signal<boolean>(false);

  signUp(data: object):Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/api/v1/auth/signup', data);
  }

   signIn(data: object):Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/api/v1/auth/signin', data);
  }
   forgetPassword(data: object):Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/api/v1/auth/forgotPasswords', data);
  }
   verifyCode(data: object):Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/api/v1/auth/verifyResetCode', data);
  }
  resetPassword(data: { email: string; newPassword: string }): Observable<{ token: string }> {
    return this.httpClient.put<{ token: string }>(
      environment.baseUrl + '/api/v1/auth/resetPassword',
      data,
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);

  }
}
