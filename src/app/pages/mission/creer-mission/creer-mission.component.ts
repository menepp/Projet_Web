import { Component, Output, Input, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Competence } from '../../../models/competence.interface';

@Component({
  selector: 'app-creer-mission',
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

  // Vérifie si le formulaire est valide (valeur non vide)
  get isFormValid(): boolean {
    return this.nomm.trim() !== '' && this.dated.trim() !== '' && this.datef.trim() !== '';
  }
  ngOnInit() {
    this.addMission();
  }
//Ajoute une mission en envoyant une requête http
  addMission() {
    fetch('http://localhost:3000/api/missions', { //requête post vers api
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ //données de la mission
      nomm: this.nomm,
      dated: this.dated,
      datef: this.datef,
      competences: this.competencesSelectionnees
      })
    })
    .then(response => response.json())
    .then(() => {
      this.missionAdded.emit();
      this.closeAddMissionPopup();
    })
    .catch(error => console.error('Erreur lors de l\'ajout de la mission :', error));
  }

  closeAddMissionPopup() {
    this.nomm = '';  //réinitialise le champ
    this.dated = '';  
    this.datef = ''; 
    this.closePopup.emit();
  }
  
//Retire sinon ajoute la compétence
  toggleCompetence(code_skill: string) {
    if (this.competencesSelectionnees.includes(code_skill)) {
      this.competencesSelectionnees = this.competencesSelectionnees.filter(c => c !== code_skill);
    } else {
      this.competencesSelectionnees.push(code_skill);
    }
    console.log("Compétences sélectionnées :", this.competencesSelectionnees);
  }
}
