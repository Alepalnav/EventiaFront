import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { jwtDecode } from 'jwt-decode';
import { LoginCredentials } from '../interfaces/login-credentials';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  cusers:User[]=[];

  private currentUser: any;
  private url: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {
    this.currentUser = this.getCurrentUserFromToken();
    console.log('Servicio iniciado')
  }

  register(user: Omit<User,'id'>):Observable<User>{
    return this.http.post<User>(`${this.url}/auth/register`,user)
  }

  login(loginCredentials: LoginCredentials): Observable<string> {
    return this.http.post(`${this.url}/auth/login`, loginCredentials, { responseType: 'text' }).pipe(
      map(response => {
        console.log(response);
        const token = response; // Extraer token JWT
        return token;
      })
    );
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  getUserRole():string {
    if(this.currentUser!=null){
      return this.currentUser.role;
    }else{
      return '';
    }
  }
  getUserId():number {
    if(this.currentUser!=null){
      return this.currentUser.id;
    }else{
      return 0;
    }
  }

  private getCurrentUserFromToken(): any {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token) // Decodificar el token
      return decodedToken;
    }
    return null;
  }

  logout():void {
    localStorage.removeItem('token');
    this.setCurrentUser(null);
  }

}