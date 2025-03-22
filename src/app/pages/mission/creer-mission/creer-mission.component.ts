import { Component, Output, Input, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MissionService } from '../../../services/mission.service';

@Component({
  selector: 'app-creer-mission',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './creer-mission.component.html',
  styleUrls: ['./creer-mission.component.css']
})
export class CreerMissionComponent {
  nomm: string = '';
  dated: string = '';
  datef: string = '';

  competencesSelectionnees: string[] = [];

  @Input() competences: { code_skill: string; description_competence_fr: string }[] = [];
  @Output() closePopup = new EventEmitter<void>();
  @Output() missionAdded = new EventEmitter<void>();

  constructor(private missionService: MissionService) {}

  // Vérifie si le formulaire est valide
  get isFormValid(): boolean {
    return this.nomm.trim() !== '' && this.dated.trim() !== '' && this.datef.trim() !== '';
  }

  addMission() {
    this.missionService.addMission({
      nomm: this.nomm,
      dated: new Date(this.dated), 
      datef: new Date(this.datef),
      competences: this.competencesSelectionnees
    }).subscribe({
      next: () => {
        this.missionAdded.emit();
        this.closeAddMissionPopup();
      },
      error: error => console.error('Erreur lors de l\'ajout de la mission :', error)
    });
  }

  closeAddMissionPopup() {
    this.nomm = '';
    this.dated = '';
    this.datef = '';
    this.closePopup.emit();
  }

  toggleCompetence(code_skill: string) {
    if (this.competencesSelectionnees.includes(code_skill)) {
      this.competencesSelectionnees = this.competencesSelectionnees.filter(c => c !== code_skill);
    } else {
      this.competencesSelectionnees.push(code_skill);
    }
    console.log("Compétences sélectionnées :", this.competencesSelectionnees);
  }
}
