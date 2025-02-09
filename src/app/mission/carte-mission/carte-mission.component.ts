import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges  } from '@angular/core';
import { Mission } from '../../models/mission.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carte-mission',
  imports: [CommonModule, FormsModule],
  templateUrl: './carte-mission.component.html',
  styleUrls: ['./carte-mission.component.css'],
})
export class CarteMissionComponent implements OnInit {
  @Input() mission!: Mission;
  @Output() missionUpdated = new EventEmitter<void>(); 

  currentDate: Date = new Date();

  isDeletePopupOpen: boolean = false;
  delMission: any = null;

  isEditMissionPopupOpen = false;

  editMission : Mission = { idm: 0, nomm: '', dated: new Date(), datef: new Date() };

  ngOnInit(): void {
    this.convertMissionDates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mission']) {
      this.convertMissionDates();
    }
  }

  convertMissionDates() {
    this.mission.dated = new Date(this.mission.dated);
    this.mission.datef = new Date(this.mission.datef);
  }
  openDeleteMissionPopup(mission: Mission) {
    this.delMission = { ...mission };
    this.isDeletePopupOpen = true;
  }

  closeDeleteMissionPopup() {
    this.isDeletePopupOpen = false;
  }

  deleteMission() {
    console.log('Tentative de suppression avec ID :', this.delMission.idm);

    fetch(`http://localhost:3000/api/missions/${this.delMission.idm}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de la mission.');
        }
        alert('Mission supprimée avec succès.');
        this.missionUpdated.emit();
      })
      .catch((error) => {
        console.error('Erreur :', error);
        alert('Erreur lors de la suppression de la mission.');
      });

    this.closeDeleteMissionPopup();
  }

  openEditMissionPopup(mission: Mission) {
    this.editMission = { ...mission };
    this.isEditMissionPopupOpen = true;
  }

  closeEditMissionPopup() {
    this.isEditMissionPopupOpen = false;
  }

  saveMission() {
    fetch(`http://localhost:3000/api/missions/${this.editMission.idm}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nomm: this.editMission.nomm,
        dated: this.editMission.dated,
        datef: this.editMission.datef,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        alert('Mission mise à jour avec succès.');
        this.missionUpdated.emit(); 
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour de la mission :', error);
        alert('Erreur lors de la modification de la mission.');
      });

    this.closeEditMissionPopup();
  }
}
