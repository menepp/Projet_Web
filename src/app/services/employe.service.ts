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

  // Récupère la liste des employés
  getEmployes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Ajoute un nouvel employé
  addEmploye(employe: EmployeInscription): Observable<any> {
    return this.http.post<any>(this.apiUrl, employe);
  }

  // Met à jour un employé existant
  updateEmploye(employe: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${employe.identifiant}`, employe);
  }

  // Supprime un employé via son identifiant
  deleteEmploye(identifiant: number) {
    return this.http.delete(`http://localhost:3000/api/employes/${identifiant}`, { responseType: 'text' });
  }

  
}
