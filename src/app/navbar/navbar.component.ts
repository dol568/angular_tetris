import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IUser} from "../model/IUser";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() user: IUser;
  @Output() logout = new EventEmitter<void>();

  exit() {
    if (confirm('Are you sure you want to exit?')) {
      this.logout.emit();
    }
  }
}

