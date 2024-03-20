import { Injectable } from '@angular/core';
import { User } from '../types/user';
import { BehaviorSubject, Observable, Subject, catchError, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  private url = "User"
  userData: User[] = []
  userDataObs = new BehaviorSubject<User[]>(this.userData)
  userDataServer: User[] = []
  userDataServerObs = new BehaviorSubject<User[]>(this.userDataServer)
  currentUser: User[] = []
  currentUserObs = new BehaviorSubject<User[]>(this.currentUser)

  constructor(private http: HttpClient) {
    this.getUserObsFromServer().subscribe()
   }

  addUser(user: User){
    this.userData.push(user)
    this.userDataObs.next(this.userData)
  }
  getCurrentUserObs(): Observable<any[]>{
    return this.currentUserObs.asObservable()
  }



  getUserObsFromServer(){
    return this.http.get<User[]>(`${environment.apiUrl}/${this.url}`).pipe(
      tap((data: User[]) => {
        this.userDataServer = data;
        this.userDataServerObs.next(this.userDataServer);
      }),
      catchError((error: any) => {
        console.error('Błąd pobierania danych z serwera', error);
        return [];
      })
    );
    }

  updateUser(user: User){
    return this.http.put<User[]>(`${environment.apiUrl}/${this.url}`,user)
  }
  createUser(user: User){
    return this.http.post<User[]>(`${environment.apiUrl}/${this.url}`,user)
  }
  deleteUser(user: User){
    return this.http.delete<User[]>(`${environment.apiUrl}/${this.url}/${user.id}`)
  }

  checkUser(user: User): Observable<boolean> {
    this.currentUser = [];
    this.currentUserObs.next(this.currentUser);

    return this.getUserObsFromServer().pipe(
      map((data: User[]) => {
        this.userDataServer = data;
        this.userDataServerObs.next(this.userDataServer);
        const userExists = this.userDataServer.some(data => data.email === user.email && data.password === user.password);

        if (userExists) {
          const matchedUser = this.userDataServer.find(data => data.email === user.email && data.password === user.password);
          this.currentUser.push(matchedUser as any);
          this.currentUserObs.next(this.currentUser);
        }
        return userExists;
      })
    );
  }


}
