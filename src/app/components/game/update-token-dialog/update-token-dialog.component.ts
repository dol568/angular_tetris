import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormFieldValidators } from '../../../model/formFieldValidators';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-token-dialog',
  standalone: true,
  imports: [MatIcon,
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
    ReactiveFormsModule,],
  templateUrl: './update-token-dialog.component.html',
  styleUrl: './update-token-dialog.component.scss'
})
export class UpdateTokenDialogComponent implements OnInit{
  public id: boolean = false;
  updateTokenForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<UpdateTokenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.updateTokenForm = new FormGroup({
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
    });
  }

  public onSubmit(): void {
    console.log(this.updateTokenForm.getRawValue())
    this.dialogRef.close(this.updateTokenForm.getRawValue());
  }

  checkForErrorsIn(field: string): string {
    if (this.updateTokenForm.controls[`${field}`].hasError('required')) {
      return 'Id is required';
    }
    if (this.updateTokenForm.controls[`${field}`].hasError('onlyNumberAllowed')) {
      return 'Must contain only numbers';
    }
    if (this.updateTokenForm.controls[`${field}`].hasError('minlength')) {
      return 'Must be at exactly 4 characters long';
    }
    if (this.updateTokenForm.controls[`${field}`].hasError('maxlength')) {
      return 'Must be at exactly 4 characters long';
    }

    return '';
  }

  get f() {
    return this.updateTokenForm.controls;
  }

  get idValid() {
    return this.updateTokenForm.controls['id'].errors === null;
  }

  public toggleIdVisibility(): void {
    this.id = !this.id;
  }
}
