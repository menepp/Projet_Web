import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeInscription } from '../models/employes.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeService {
  private apiUrl = 'http://localhost:3000/api/employes';

  constructor(private http: HttpClient) {}

  getEmployes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addEmploye(employe: EmployeInscription): Observable<any> {
    return this.http.post<any>(this.apiUrl, employe);
  }
}
