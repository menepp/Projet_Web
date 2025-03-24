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

  getMissions(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addMission(mission: Partial<Mission> & { competences?: string[] }): Observable<any> {
    return this.http.post<any>(this.apiUrl, mission);
  }

  updateMission(mission: Partial<Mission> & { idm: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${mission.idm}`, mission, { responseType: 'json' });
  }

  deleteMission(idm: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idm}`, { responseType: 'text' });
  }

  getMissionEmployees(missionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${missionId}/employes`);
  }

  getEmployesWithCompetences(missionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employes?missionId=${missionId}`);
  }

  addEmployeesToMission(missionId: number, employes: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${missionId}/employes`, { employes });
  }

  removeEmployeeFromMission(missionId: number, employeId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${missionId}/employes/${employeId}`, {
      responseType: 'text' as 'json'
    });
  }
  
}
