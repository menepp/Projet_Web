import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeInscription } from '../../../models/employes.interface';
import { EmployeService } from '../../../services/employe.service';

@Component({
  selector: 'app-ajouter',
  standalone: true,
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
  competences: { code_skill: string, description_competence_fr: string }[] = [];
  competencesSelectionnees: string[] = [];

  // Déclaration de la variable pour contrôler l'état de la pop-up
  isAddEmployeePopupOpen: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone, private employeService: EmployeService) {}

  ngOnInit() {
    this.fetchCompetences();
  }

  fetchCompetences() {
    // On récupère ici les compétences depuis l'API via l'appel de getEmployes (si l'API renvoie aussi les compétences)
    this.employeService.getEmployes().subscribe({
      next: data => {
        this.competences = data.competences || [];
        console.log("Compétences disponibles :", this.competences);
      },
      error: error => {
        console.error("Erreur lors de la récupération des compétences :", error);
      }
    });
  }

  // Méthode pour afficher la pop-up
  openAddEmployeePopup() {
    this.isAddEmployeePopupOpen = true;
  }

  // Méthode pour fermer la pop-up
  closeAddEmployeePopup() {
    this.isAddEmployeePopupOpen = false;
    // Réinitialise le formulaire
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

    this.employeService.addEmploye({
      ...this.newEmployee,
      competences: this.competencesSelectionnees
    }).subscribe({
      next: data => {
        console.log("✅ Employé ajouté :", data);
        alert('Employé ajouté avec succès.');
        this.employeeAdded.emit();
        this.closeAddEmployeePopup();
      },
      error: error => {
        console.error("❌ Erreur lors de l'ajout de l'employé :", error);
        alert("Erreur lors de l'ajout de l'employé.");
      }
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
