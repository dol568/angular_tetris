import {Component, EventEmitter, InputSignal, Output, input} from '@angular/core';
import {User} from "../../model/User";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentUser: InputSignal<User> = input.required<User>();
  @Output() logout: EventEmitter<void> = new EventEmitter<void>();

  public exit(): void {
      this.logout.emit();
  }
}

