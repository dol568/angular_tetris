import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {IUser} from "../model/IUser";
import {_localstorage_user} from "../model/_const_vars";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Output() formData = new EventEmitter<IUser>();
  user: IUser = {username: '', email: ''};

  onSubmit(data: IUser) {
    this.user = data;
    this.formData.emit(this.user);
  }
}
