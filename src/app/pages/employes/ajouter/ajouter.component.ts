import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeInscription } from '../../../models/employes.interface';

@Component({
  selector: 'app-ajouter',
  imports: [CommonModule, FormsModule],
  templateUrl: './ajouter.component.html',
  styleUrls: ['./ajouter.component.css']
})
export class AjouterComponent implements OnInit {
  newEmployee: EmployeInscription = { 
    identifiant: 0, nom: '', prenom: '', email: '', 
    mot_de_passe: '', role_employe: '', date_entree: new Date(), 
    competences: [''] 
  };

  @Input() employes!: EmployeInscription[];
  @Output() employeeAdded = new EventEmitter<void>();

  isLoading = true;
  filteredEmployees: EmployeInscription[] = [];
  isAddEmployeePopupOpen: boolean = false;

  competences: { code_skill: string, description_competence_fr: string }[] = [];
  competencesSelectionnees: string[] = [];

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit() {
    // Vous pouvez charger ici d'autres données si besoin
  }

  openAddEmployeePopup() {
    this.isAddEmployeePopupOpen = true;
  }

  closeAddEmployeePopup() {
    this.isAddEmployeePopupOpen = false;
    this.newEmployee = { 
      identifiant: 0, nom: '', prenom: '', email: '', 
      mot_de_passe: '', role_employe: '', date_entree: new Date(), 
      competences: [''] 
    };
  }

  addEmployee() {
    // Vérifie si l'email existe déjà
    const emailExists = this.employes.some(emp => emp.email === this.newEmployee.email);
    if (emailExists) {
      alert('Un employé avec cet email existe déjà.');
      return;
    }

    fetch('http://localhost:3000/api/employes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: this.newEmployee.nom,
        prenom: this.newEmployee.prenom,
        email: this.newEmployee.email,
        mot_de_passe: this.newEmployee.mot_de_passe,
        role_employe: this.newEmployee.role_employe,
        date_entree: this.newEmployee.date_entree,
        competences: this.competencesSelectionnees,
      })
    })
    .then(response => {
      if (!response.ok) throw new Error("Erreur lors de l'ajout de l'employé");
      return response.json();
    })
    .then(data => {
      console.log("✅ Employé ajouté :", data);
      alert('Employé ajouté avec succès.');
      // Émettre l'événement vers le parent pour recharger l'API
      this.employeeAdded.emit();

      // Fermer la pop-up d'ajout et réinitialiser le formulaire
      this.closeAddEmployeePopup();
    })
    .catch(error => {
      console.error('❌ Erreur lors de l\'ajout de l\'employé :', error);
    });
  }

  toggleCompetence(code_skill: string) {
    const index = this.competencesSelectionnees.indexOf(code_skill);
    if (index !== -1) {
      this.competencesSelectionnees.splice(index, 1);
    } else {
      this.competencesSelectionnees.push(code_skill);
    }
    console.log("Compétences sélectionnées :", this.competencesSelectionnees);
  }
}
