import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeService } from '../../services/employe.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  imports: [FormsModule],
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {
  email: string = ''; 
  password: string = ''; 

  constructor(
    private router: Router, 
    private employeService: EmployeService,
    private authService: AuthService
  ) {}

  onSubmit() {
    if (this.email && this.password) {
      this.employeService.getEmployes().subscribe(response => {
        const employes = response.employes;
        const user = employes.find((emp: any) => emp.email === this.email && emp.mot_de_passe === this.password);
        if (user) {
          this.authService.login(user);
          if(user.role_employe === 'RH') {
            this.router.navigate(['/accueil']);
          } else {
            this.router.navigate(['/salon']);
          }
        } else {
          alert('Identifiants incorrects');
        }
      }, error => {
        console.error("Erreur API :", error);
        alert('Erreur lors de la connexion');
      });
    }
  }
}
