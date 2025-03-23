// mission.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mission } from '../models/mission.interface';

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private apiUrl = 'http://localhost:3000/api/missions';

  constructor(private http: HttpClient) {}

  // Récupérer la liste des missions (et éventuellement les compétences associées)
  getMissions(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Ajouter une nouvelle mission
  addMission(mission: Partial<Mission> & { competences?: string[] }): Observable<any> {
    return this.http.post<any>(this.apiUrl, mission);
  }

  // Mettre à jour une mission existante
  updateMission(mission: Partial<Mission> & { idm: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${mission.idm}`, mission);
  }

  // Supprimer une mission
  deleteMission(idm: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${idm}`);
  }

  // Récupérer les employés affectés à une mission donnée
  getMissionEmployees(missionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${missionId}/employes`);
  }

  // Ajouter des employés à une mission
  addEmployeesToMission(missionId: number, employes: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${missionId}/employes`, { employes });
  }

  // Retirer un employé d'une mission
  removeEmployeeFromMission(missionId: number, employeId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${missionId}/employes/${employeId}`);
  }
}
