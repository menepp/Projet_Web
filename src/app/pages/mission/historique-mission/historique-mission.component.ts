import { Component, Input } from '@angular/core';
import { Mission } from '../../../models/mission.interface';
import { CarteMissionComponent } from '../carte-mission/carte-mission.component';

@Component({
  selector: 'app-historique-mission',
  imports: [CarteMissionComponent],
  templateUrl: './historique-mission.component.html',
  styleUrls: ['./historique-mission.component.css']
})
export class HistoriqueMissionComponent {
  @Input() missionsTerminees: Mission[] = [];
}
