import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { Profile } from '../types/profile';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {  environment } from '../../environments/environments';
import { NutritionalValue } from '../types/nutritionalValue';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profileData: Profile[] = []
  profileDataObs = new BehaviorSubject<Profile[]>(this.profileData)
  BMRValues: NutritionalValue[] = []
  BMRValuesObs = new BehaviorSubject<NutritionalValue[]>(this.BMRValues)
  private url = "Profile"
  constructor(private http: HttpClient) { }

  addProfile(profile: Profile){
    if(this.profileData.length > 0){
      this.profileData.pop()
    }
    this.profileData.push(profile)
    this.profileDataObs.next(this.profileData)
  }

  getProfileObs(): Observable<Profile[]>{
    return this.profileDataObs.asObservable()
  }

  getProfileObsFromServer(): Observable<any>{
    return this.http.get<Profile[]>(`${environment.apiUrl}/${this.url}`).pipe(
      catchError((error: any) => {
        alert('Błąd pobierania danych z serwera');
        return [];
      }
    )
  )}

  updateProfile(profile: Profile){
    return this.http.put<Profile[]>(`${environment.apiUrl}/${this.url}`,profile)
  }
  createProfile(profile: Profile){
    return this.http.post<Profile[]>(`${environment.apiUrl}/${this.url}`,profile)
    
  }
  deleteProfile(profile: Profile){
    return this.http.delete<Profile[]>(`${environment.apiUrl}/${this.url}/${profile.id}`)
  }
  addBMR(data: NutritionalValue){
    this.BMRValues = []
    this.BMRValues.push(data)
    this.BMRValuesObs.next(this.BMRValues)
    
  }


}
