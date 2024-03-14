import {Component, EventEmitter, OnInit, Output, WritableSignal, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {User} from "../../../model/User";
import {FormFieldValidators} from "../../../model/formFieldValidators";
import {RouterLink} from "@angular/router";
import { _emailOnly } from '../../../model/_const_vars';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  @Output() register = new EventEmitter<void>();
  @Output() formData = new EventEmitter<User>();
  loginForm: FormGroup;
  isText: WritableSignal<boolean> = signal<boolean>(false);
  type: WritableSignal<string> = signal<string>('password');
  
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.compose([
          Validators.required,
          FormFieldValidators.patternValidator(_emailOnly, {requiresEmail: true})
        ])
      ]),
      password: new FormControl('', [
        Validators.compose([
          Validators.required,
        ])
      ])
    })
  }
  
  public onSubmit(): void {
    this.formData.emit(this.loginForm.value);
  }

  public hideShowPass(): void {
    this.isText.set(this.isText() === false);
    this.type.set(this.type() === 'text' ? 'password' : 'text');
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
