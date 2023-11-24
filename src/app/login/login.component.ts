import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {User} from "../User";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    @Output() formData = new EventEmitter<User>();
    user: User = new User('', '');

    onSubmit(data) {
        this.user = data;
        this.formData.emit(this.user);
        localStorage.setItem('user', JSON.stringify(this.user));
    }
}
