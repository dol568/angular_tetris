import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {User} from "../User";
import {GameplayService} from "../gameplay.service";
import {Panel} from "../Panel";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() user: User;
  @Output() logout = new EventEmitter<void>();

  constructor(private gs: GameplayService) {
  }

  exit() {
    if (confirm('Are you sure you want to exit?')) {
      this.gs.setPanel(new Panel());
      this.logout.emit();
    }
  }
}

