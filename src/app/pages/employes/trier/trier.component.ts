import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trier',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './trier.component.html',
  styleUrls: ['./trier.component.css']
})
export class TrierComponent {
  isSortPopupOpen: boolean = false;
  sortBy: string = '';
  @Output() sortChanged = new EventEmitter<string>();

  openSortPopup() {
    this.isSortPopupOpen = true;
  }

  closeSortPopup() {
    this.isSortPopupOpen = false;
  }

  applySort() {
    this.sortChanged.emit(this.sortBy);
    this.closeSortPopup();
  }
}
