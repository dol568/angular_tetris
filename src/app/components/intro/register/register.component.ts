import { Component, EventEmitter, OnInit, Output, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { User } from '../../../model/User';
import { FormFieldValidators } from '../../../model/formFieldValidators';
import { _emailOnly } from '../../../model/_const_vars';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  @Output() login = new EventEmitter<void>();
  @Output() registerData = new EventEmitter<User>();
  registerForm: FormGroup;
  isText: WritableSignal<boolean> = signal<boolean>(false);
  type: WritableSignal<string> = signal<string>('password');

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl('', [
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
          FormFieldValidators.patternValidator(new RegExp('(?=.*[A-Z])'), {
            requiresUppercase: true,
          }),
          FormFieldValidators.patternValidator(new RegExp('(?=.*[a-z])'), {
            requiresLowercase: true,
          }),
        ]),
      ]),
      email: new FormControl('', [
        Validators.compose([
          Validators.required,
          FormFieldValidators.patternValidator(_emailOnly, {
            requiresEmail: true,
          }),
        ]),
      ]),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
          FormFieldValidators.patternValidator(new RegExp('(?=.*[0-9])'), {
            requiresDigit: true,
          }),
          FormFieldValidators.patternValidator(new RegExp('(?=.*[A-Z])'), {
            requiresUppercase: true,
          }),
          FormFieldValidators.patternValidator(new RegExp('(?=.*[a-z])'), {
            requiresLowercase: true,
          }),
          FormFieldValidators.patternValidator(new RegExp('(?=.*[$@^!%*?&])'), {
            requiresSpecialChars: true,
          }),
        ])
      ),
    });
  }

  onSubmit(): void {
    this.registerData.emit(this.registerForm.value);
  }

  public hideShowPass(): void {
    this.isText.set(this.isText() === false);
    this.type.set(this.type() === 'text' ? 'password' : 'text');
  }

  get f() {
    return this.registerForm.controls;
  }

  get usernameValid() {
    return this.registerForm.controls['username'].errors === null;
  }

  get usernameRequiredValid() {
    return !this.registerForm.controls['username'].hasError('required');
  }

  get usernameMinLengthValid() {
    return !this.registerForm.controls['username'].hasError('minlength');
  }

  get usernameMaxLengthValid() {
    return !this.registerForm.controls['username'].hasError('maxlength');
  }

  get usernameRequiresUppercaseValid() {
    return !this.registerForm.controls['username'].hasError(
      'requiresUppercase'
    );
  }

  get usernameRequiresLowercaseValid() {
    return !this.registerForm.controls['username'].hasError(
      'requiresLowercase'
    );
  }

  get emailValid() {
    return this.registerForm.controls['email'].errors === null;
  }

  get emailRequiredValid() {
    return !this.registerForm.controls['email'].hasError('required');
  }

  get requiresEmailValid() {
    return !this.registerForm.controls['email'].hasError('requiresEmail');
  }

  get passwordValid() {
    return this.registerForm.controls['password'].errors === null;
  }

  get passwordRequiredValid() {
    return !this.registerForm.controls['password'].hasError('required');
  }

  get passwordMinLengthValid() {
    return !this.registerForm.controls['password'].hasError('minlength');
  }

  get passwordMaxLengthValid() {
    return !this.registerForm.controls['password'].hasError('maxlength');
  }

  get passwordRequiresUppercaseValid() {
    return !this.registerForm.controls['password'].hasError(
      'requiresUppercase'
    );
  }

  get passwordRequiresLowercaseValid() {
    return !this.registerForm.controls['username'].hasError(
      'requiresLowercase'
    );
  }

  get passwordRequiresDigitValid() {
    return !this.registerForm.controls['password'].hasError('requiresDigit');
  }

  get passwordRequiresSpecialCharsValid() {
    return !this.registerForm.controls['password'].hasError(
      'requiresSpecialChars'
    );
  }
}
