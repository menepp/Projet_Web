import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-creer-mission',
  templateUrl: './creer-mission.component.html',
  styleUrls: ['./creer-mission.component.css'],
  imports: [FormsModule]
})
export class CreerMissionComponent {
  nomm: string = ''; 
  dated: string = ''; 
  datef: string = ''; 

  @Output() closePopup = new EventEmitter<void>();
  @Output() missionAdded = new EventEmitter<void>();

  get isFormValid(): boolean {
    return this.nomm.trim() !== '' && this.dated.trim() !== '' && this.datef.trim() !== '';
  }

  addMission() {
    const missionData = {
      nomm: this.nomm,
      dated: this.dated,
      datef: this.datef,
    };

    fetch('http://localhost:3000/api/missions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(missionData),
    })
      .then((response) => response.json())
      .then(() => {
        this.missionAdded.emit();
        this.closeAddMissionPopup();
      })
      .catch((error) => console.error("Erreur lors de l'ajout de la mission:", error));
  }

  closeAddMissionPopup() {
    this.nomm = '';  
    this.dated = '';  
    this.datef = ''; 
    this.closePopup.emit();
  }
}
