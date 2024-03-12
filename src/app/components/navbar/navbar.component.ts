import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IUser} from "../../model/IUser";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() currentUser: IUser;
  @Output() logout: EventEmitter<void> = new EventEmitter<void>();

  public exit() {
      this.logout.emit();
  }
}

