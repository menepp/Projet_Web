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

  // Méthode pour ajouter une mission
  addMission() {
    // Appel du service pour ajouter la mission en passant les données du formulaire
    this.missionService.addMission({
      nomm: this.nomm, // Nom de la mission
      dated: new Date(this.dated), // Date de début convertie en objet Date
      datef: new Date(this.datef), // Date de fin convertie en objet Date
      competences: this.competencesSelectionnees // Compétences sélectionnées pour la mission
    }).subscribe({
      next: () => {
        this.missionAdded.emit(); // Émet un événement pour signaler l'ajout de la mission
        this.closeAddMissionPopup(); // Ferme la pop-up d'ajout
        alert(`La mission a bien été ajoutée.`); // Affiche un message de succès
      },
      error: error => console.error('Erreur lors de l\'ajout de la mission :', error) // Gère l'erreur en cas d'échec
    });
  }

  // Méthode pour fermer la pop-up d'ajout de mission
  closeAddMissionPopup() {
    // Réinitialise les champs du formulaire
    this.nomm = '';
    this.dated = '';
    this.datef = '';
    // Émet l'événement pour fermer la pop-up
    this.closePopup.emit();
  }

  // Méthode pour ajouter ou supprimer une compétence sélectionnée
  toggleCompetence(code_skill: string) {
    if (this.competencesSelectionnees.includes(code_skill)) {
      // Si la compétence est déjà sélectionnée, on la retire de la liste
      this.competencesSelectionnees = this.competencesSelectionnees.filter(c => c !== code_skill);
    } else {
      // Sinon, on l'ajoute à la liste des compétences sélectionnées
      this.competencesSelectionnees.push(code_skill);
    }
  }
}
