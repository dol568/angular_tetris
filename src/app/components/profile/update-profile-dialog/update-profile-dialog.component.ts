import { Component, OnInit, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../model/User';

@Component({
  selector: 'app-update-profile-dialog',
  standalone: true,
  imports: [
    MatIcon,
    MatFabButton,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
  ],
  templateUrl: './update-profile-dialog.component.html',
  styleUrl: './update-profile-dialog.component.scss',
})
export class UpdateProfileDialogComponent implements OnInit {
  #dialogRef = inject(MatDialogRef<UpdateProfileDialogComponent>);
  #data: User = inject(MAT_DIALOG_DATA);
  updateProfileForm: FormGroup;

  ngOnInit(): void {
    this.updateProfileForm = new FormGroup({
      username: new FormControl({ value: this.#data.username, disabled: true }),
      email: new FormControl(this.#data.email, [Validators.email]),
      bio: new FormControl(this.#data.bio, [Validators.maxLength(160)]),
    });
  }

  public onSubmit(): void {
    this.#dialogRef.close(this.updateProfileForm.getRawValue());
  }
  public onNoClick(): void {
    this.#dialogRef.close();
  }

  public checkForErrorsIn(field: string): string {
    if (this.updateProfileForm.controls[`${field}`].hasError('email')) {
      return 'Must be a valid email';
    }
    if (this.updateProfileForm.controls[`${field}`].hasError('maxlength')) {
      return 'Too long';
    }

    return '';
  }

  get f() {
    return this.updateProfileForm.controls;
  }

  get usernameValid() {
    return this.updateProfileForm.controls['username'].errors === null;
  }
  get emailValid() {
    return this.updateProfileForm.controls['email'].errors === null;
  }

  get bioValid() {
    return this.updateProfileForm.controls['bio'].errors === null;
  }
}
