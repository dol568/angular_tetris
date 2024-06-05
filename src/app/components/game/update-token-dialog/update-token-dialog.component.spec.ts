import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTokenDialogComponent } from './update-token-dialog.component';

describe('UpdateTokenDialogComponent', () => {
  let component: UpdateTokenDialogComponent;
  let fixture: ComponentFixture<UpdateTokenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTokenDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateTokenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
