import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {IUser} from "../../../model/IUser";
import {FormFieldValidators} from "../../../model/formFieldValidators";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  @Output() register = new EventEmitter<void>();
  @Output() formData = new EventEmitter<IUser>();
  loginForm: FormGroup;
  readonly emailOnly = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  onSubmit(): void {
    this.formData.emit(this.loginForm.value);
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.compose([
          Validators.required,
          FormFieldValidators.patternValidator(this.emailOnly, {requiresEmail: true})
        ])
      ]),
      password: new FormControl('', [
        Validators.compose([
          Validators.required,
        ])
      ])
    })
  }

  get f() {
    return this.loginForm.controls;
  }

  get emailValid() {
    return this.loginForm.controls['email'].errors === null;
  }

  get emailRequiredValid() {
    return !this.loginForm.controls['email'].hasError('required');
  }

  get requiresEmailValid() {
    return !this.loginForm.controls['email'].hasError('requiresEmail');
  }

  get passwordValid() {
    return this.loginForm.controls['password'].errors === null;
  }

  get passwordRequiredValid() {
    return !this.loginForm.controls['password'].hasError('required');
  }
}
