import { Component, OnInit } from '@angular/core';
import { CarteMissionComponent } from './carte-mission/carte-mission.component';
import { Mission } from '../models/mission.interface';

@Component({
  selector: 'app-mission',
  imports: [CarteMissionComponent],

  templateUrl: './mission.component.html',
  styleUrl: './mission.component.css'
})

export class MissionComponent implements OnInit{
  missions: Mission[] = [];
  isLoading = true;

  ngOnInit(): void{
    fetch('http://localhost:3000/api/missions')
    .then((response) => response.json())
      .then((data) => {
        this.missions = data; // Stocker les données dans le tableau
        this.isLoading = false; // Masquer l'indicateur de chargement
        console.log(this.missions);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des missions:', error);
        this.isLoading = false; // Masquer l'indicateur même en cas d'erreur
      });
  }
}
