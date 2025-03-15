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
    nom: '', prenom: '', email: '', 
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
    this.fetchEmployees();
  }
  
  fetchEmployees() {
    console.log("📡 Envoi de la requête GET /api/employes...");
    fetch('http://localhost:3000/api/employes')
      .then(response => response.json())
      .then(data => {
        this.competences = data.competences || []; // 📌 Récupération des compétences
        console.log("Compétences disponibles :", this.competences);
      });
  }

  openAddEmployeePopup() {
    this.isAddEmployeePopupOpen = true;
  }

  closeAddEmployeePopup() {
    this.isAddEmployeePopupOpen = false;
    this.newEmployee = { 
      nom: '', prenom: '', email: '', 
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
        date_entree: this.newEmployee.date_entree,
        email: this.newEmployee.email,
        mot_de_passe: this.newEmployee.mot_de_passe,
        role_employe: this.newEmployee.role_employe,
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
    if (this.competencesSelectionnees.includes(code_skill)) {
      this.competencesSelectionnees = this.competencesSelectionnees.filter(c => c !== code_skill);
    } else {
      this.competencesSelectionnees.push(code_skill);
    }
  }
  
}
