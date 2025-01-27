import { Component, Input } from '@angular/core';
import { Mission } from '../../models/mission.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carte-mission',
  imports:[CommonModule],
  templateUrl: './carte-mission.component.html',
  styleUrls: ['./carte-mission.component.css'],
})
export class CarteMissionComponent {
  @Input() mission!: Mission;


}
