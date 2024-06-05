import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  WritableSignal,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../model/User';
import { FormFieldValidators } from '../../../model/formFieldValidators';
import { RouterLink } from '@angular/router';
import { _emailOnly } from '../../../model/_client_consts';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFabButton } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatFabButton,
    MatRadioModule,
    FormsModule,
    MatSlideToggleModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  toggleChecked = false;

  @Output() formData = new EventEmitter<User>();
  loginForm: FormGroup;
  type: WritableSignal<string> = signal<string>('password');
  public id: boolean = false;
  user = input.required<User>();

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(this.user()?.username, [
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
          FormFieldValidators.patternValidator(new RegExp('(?=.*[A-Z])'), {
            requiresUppercase: true,
          }),
          FormFieldValidators.patternValidator(new RegExp('(?=.*[a-z])'), {
            requiresLowercase: true,
          }),
        ]),
      ]),
      id: new FormControl('', [
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          FormFieldValidators.patternValidator(new RegExp('^[0-9]+$'), {
            onlyNumberAllowed: true,
          }),
        ]),
      ]),
      game: new FormControl('tetris', [Validators.required]),
      color: new FormControl(true, [Validators.required]),
    });
  }

  public onSubmit(): void {
    this.formData.emit(this.loginForm.value);
  }

  onToggleChange(checked: boolean) {
    this.toggleChecked = checked;
  }

  public toggleIdVisibility(): void {
    this.id = !this.id;
  }

  checkForErrorsIn(field: string): string {
    if (this.loginForm.controls[`${field}`].hasError('required')) {
      return field === 'username' ? 'Username is required' : 'Id is required';
    }

    if (this.loginForm.controls[`${field}`].hasError('requiresUppercase')) {
      return 'Must contain at least 1 uppercase character';
    }
    if (this.loginForm.controls[`${field}`].hasError('requiresLowercase')) {
      return 'Must contain at least 1 lowercase character';
    }
    if (this.loginForm.controls[`${field}`].hasError('onlyNumberAllowed')) {
      return 'Must contain only numbers';
    }
    if (this.loginForm.controls[`${field}`].hasError('minlength')) {
      return field === 'username'
        ? 'Must be at least 5 characters long'
        : 'Must be at exactly 4 characters long';
    }
    if (this.loginForm.controls[`${field}`].hasError('maxlength')) {
      return field === 'username'
        ? 'Must be at most 30 characters long'
        : 'Must be at exactly 4 characters long';
    }

    return '';
  }

  get f() {
    return this.loginForm.controls;
  }

  get idValid() {
    return this.loginForm.controls['id'].errors === null;
  }

  get usernameValid() {
    return this.loginForm.controls['username'].errors === null;
  }
}
