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
    mot_de_passe: '', role_employe: 'Employé', 
    date_entree: new Date(), competences: [''] 
  };

  @Input() employes!: EmployeInscription[];
  @Output() employeeAdded = new EventEmitter<void>();

  isLoading = true;
  competences: { code_skill: string, description_competence_fr: string }[] = [];
  competencesSelectionnees: string[] = [];

  isAddEmployeePopupOpen: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone, private employeService: EmployeService) {}

  ngOnInit() {
    this.fetchCompetences();
  }

   // Méthode pour récupérer les compétences depuis le service
   fetchCompetences() {
    this.employeService.getEmployes().subscribe({
      next: data => {
        this.competences = data.competences || []; // Stocke les compétences récupérées
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
  
  // Méthode pour ajouter un nouvel employé
  addEmployee() {
    // Vérifie si l'email de l'employé existe déjà dans la liste
    const emailExists = this.employes.some(emp => emp.email === this.newEmployee.email);
    if (emailExists) {
      alert('Un employé avec cet email existe déjà.');
      return; // Stoppe l'exécution si l'email est déjà pris
    }

    // Appel du service pour ajouter un employé avec ses compétences sélectionnées
    this.employeService.addEmploye({
      ...this.newEmployee,
      competences: this.competencesSelectionnees // Assigne les compétences sélectionnées à l'employé
    }).subscribe({
      next: data => {
        alert(`Employé ajouté avec succès en tant que ${this.newEmployee.role_employe}.`);
        this.employeeAdded.emit(); // Émet un événement pour informer le composant parent de l'ajout
        this.closeAddEmployeePopup(); // Ferme la pop-up après l'ajout
      },
      error: error => {
        console.error("❌ Erreur lors de l'ajout :", error);
        alert("Erreur lors de l'ajout.");
      }
    });
  }

  // Méthode pour ajouter ou retirer une compétence de la liste des compétences sélectionnées
  toggleCompetence(code_skill: string) {
    if (this.competencesSelectionnees.includes(code_skill)) {
      // Si la compétence est déjà sélectionnée, on la retire
      this.competencesSelectionnees = this.competencesSelectionnees.filter(c => c !== code_skill);
    } else {
      // Sinon, on l'ajoute à la liste
      this.competencesSelectionnees.push(code_skill);
    }
  }
}

