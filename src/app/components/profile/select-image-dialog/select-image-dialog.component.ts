import { CommonModule } from '@angular/common';
import { Component, Inject, WritableSignal, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-select-image-dialog',
  standalone: true,
  imports: [MatIcon, MatFabButton, MatInputModule, MatFormFieldModule,  FormsModule, CommonModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,ReactiveFormsModule, ImageCropperModule],
  templateUrl: './select-image-dialog.component.html',
  styleUrl: './select-image-dialog.component.scss'
})
export class SelectImageDialogComponent {
  image: string;
  crop: WritableSignal<Blob> = signal<Blob>(null);

  constructor(
    public dialogRef: MatDialogRef<SelectImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  imageCropped(event: ImageCroppedEvent) {
    this.image = event.objectUrl;
    this.crop.set(event.blob);
  }

  public uploadFile(): void {
    this.dialogRef.close(this.crop());
  }
}
