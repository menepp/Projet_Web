import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Blog } from '../../models/blog.interface';
import { BlogService } from '../../services/blog.service';
import { FormsModule } from '@angular/forms';
import { MessageData } from '../../models/message.interface';


@Component({
  selector: 'app-salon',
  imports : [CommonModule, FormsModule],
  templateUrl: './salon.component.html',
  styleUrls: ['./salon.component.css']
})
export class SalonComponent implements OnInit {
  blogs: Blog[] = [];
  newMessage: string = '';
  newMissionMessage: string = ''; 
  missionId: number = 1;
  missionMessages: any[] = [];
  
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(
    private blogService: BlogService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getBlogs();  // Récupérer les messages généraux
    this.missionId = this.getMissionId();  // Récupérer l'ID de la mission
    this.getMissionMessages(); 
    this.loadCompanyMessages();
    this.loadMissionMessages(); // Récupérer les messages pour la mission spécifique
    setInterval(() => {
      this.getBlogs();
      this.getMissionMessages();  // Rafraîchir les messages de la mission toutes les 5s
    }, 5000);
  }

  getBlogs(): void {
    this.blogService.getBlogs().subscribe(
      (data) => {
        this.blogs = data;
        setTimeout(() => this.scrollToBottom(), 100);  // Scroller en bas
      },
      (error) => console.error('Erreur lors de la récupération des messages', error)
    );
  }
  
  
  loadCompanyMessages(): void {
    this.http.get('/api/blog').subscribe((data: any) => {
      this.blogs = data;
    });
  }
  loadMissionMessages(): void {
    this.http.get(`/api/blog/getMissionMessages?missionId=${this.missionId}`).subscribe((data: any) => {
      this.missionMessages = data;
    });
  }
  sendMessage(): void {
    if (!this.newMessage.trim()) return;
  
    const userId = localStorage.getItem('userId');  // Récupérer l'ID de l'utilisateur
  
    if (!userId) {
      alert('Vous devez être connecté pour envoyer un message.');
      return;
    }
  
    const messageData = { message: this.newMessage, code_employe: userId };
  
    // Envoi du message
    this.http.post('http://localhost:3000/api/blog/send', messageData).subscribe(
      () => {
        this.newMessage = '';  // Effacer le champ
        this.getBlogs();  // Mettre à jour les messages
      },
      (error) => {
        console.error('Erreur lors de l\'envoi du message', error);
        alert('Erreur lors de l\'envoi du message');
      }
    );
  }
  
  // Correction des URLs dans les appels API
getMissionMessages(): void {
  this.http.get<MessageData[]>(`http://localhost:3000/api/blog/getMissionMessages`, {
    params: { missionId: this.missionId }
  }).subscribe(
    data => {
      this.missionMessages = data;
    },
    error => {
      console.error('Erreur lors de la récupération des messages', error);
    }
  );
}

sendMissionMessage(): void {
  if (this.newMissionMessage.trim() === '') return;

  const userId = localStorage.getItem('userId');

  if (!userId) {
    alert('Vous devez être connecté pour envoyer un message.');
    return;
  }

  const messageData = { message: this.newMissionMessage, missionId: this.missionId };

  this.http.post('http://localhost:3000/api/blog/sendMissionMessage', messageData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userId}`  // Utilisation correcte de la syntaxe
    }
  }).subscribe(
    () => {
      this.newMissionMessage = '';
      this.loadMissionMessages();
    },
    (error) => {
      console.error('Erreur lors de l\'envoi du message', error);
      alert('Erreur lors de l\'envoi du message');
    }
  );
}

  



  getMissionId(): number {
    // Tu devrais récupérer l'ID de la mission de l'employé depuis le profil ou le localStorage
    return parseInt(localStorage.getItem('missionId') || '1', 10);
  }

  scrollToBottom(): void {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }
}
