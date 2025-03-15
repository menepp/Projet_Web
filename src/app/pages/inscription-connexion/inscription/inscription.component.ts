import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { EmployeInscription } from '../../../models/employes.interface';
import { EmployeService } from '../../../services/employe.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  imports: [FormsModule],
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent {
  nom: string = '';
  prenom: string = '';
  email: string = ''; 
  password: string = ''; 
  confirmPassword: string = ''; 

  constructor(private router: Router, private employeService: EmployeService) {}  

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
  
    if (this.nom && this.prenom && this.email && this.password && this.confirmPassword) {
      // Création de l'objet employé à envoyer
      const newEmploye = {
        nom: this.nom,
        prenom: this.prenom,
        email: this.email,
        mot_de_passe: this.password,
        role_employe: 'Employé', // par défaut pour l'inscription
        date_entree: new Date(),
        competences: [''] // envoyer une chaîne vide car l'API attend une chaîne
      };
  
      console.log('Données envoyées :', newEmploye); // Ajoutez ce log
  
      this.employeService.addEmploye(newEmploye).subscribe({
        next: (response) => {
          alert("Inscription réussie. Veuillez vous connecter.");
          this.router.navigate(['/inscription-connexion']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'inscription :', error);
          alert("Erreur lors de l'inscription. Vérifiez les données.");
        }
      });
    }
  }
  
}
