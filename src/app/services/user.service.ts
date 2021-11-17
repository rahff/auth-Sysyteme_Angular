import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResServer, User } from 'src/models/interfaces.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user$ = new BehaviorSubject<User | null>(null);
  private URL_API = environment.URL_API;
  constructor(private http: HttpClient) {
    this.loginAuto();
  }

  getUser(): Observable<User | null> {
    return this.user$.asObservable().pipe();
  }

  postLogin(body: { email: string; password: string }): Observable<any> {
    return this.http.post(this.URL_API + '/auth/login', body).pipe(
      tap((res: any) => {
        if (res.status === 200) {
          this.user$.next({
            name: res.response.name,
            avatar: res.response.avatar,
            firstname: res.response.firstname,
            email: res.response.local.email,
          });
        }
      }),
      map((res: any) => {
        return res;
      })
    );
  }
  postSignup(body: any): Observable<any> {
    return this.http.post(this.URL_API + '/auth/signup', body).pipe(
      tap((res: any) => {
        if (res.status === 200) {
          this.user$.next({
            name: res.response.name,
            avatar: res.response.avatar,
            firstname: res.response.firstname,
            email: res.response.local.email,
          });
        }
      }),
      map((res: any) => {
        return res;
      })
    );
  }
  loginAuto(): void {
    const allCookies: any[] = document.cookie.split(';');
    const allCookieInObj: any = {};
    if (allCookies) {
      allCookies.forEach((cookie: string) => {
        if (cookie) {
          const key: string = cookie.split('=')[0].trim();
          const value: string = cookie.split('=')[1].trim();
          allCookieInObj[key] = value;
        }
      });
    }
    const token = allCookieInObj['jwt'];
    if (token) {
      this.verifToken(token).subscribe((res: any) => {
        if (res) {
          const user = localStorage.getItem('user');
          if (user) {
            const parsedUser = JSON.parse(user);
            this.user$.next({
              name: parsedUser.name,
              firstname: parsedUser.firstname,
              email: parsedUser.local.email,
              avatar: parsedUser.avatar
            });
          }
        }
      });
    }
  }
  logout(): Observable<any> {
    return this.http.get(this.URL_API + '/auth/logout').pipe(
      tap(() => {
        this.user$.next(null);
      })
    );
  }
  verifToken(token: string): Observable<boolean> {
    const headers = new HttpHeaders({
      jwt: token
    })
    return this.http.get(this.URL_API + '/auth/verif-token')
      .pipe(
        map((res: any) => {
          console.log(res);
          
          if (res.status === 200) {
            return true;
          } else {
            return false;
          }
        })
      );
  }
}
