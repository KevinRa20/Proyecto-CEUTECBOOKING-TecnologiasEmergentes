import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Seleccionarrol } from './seleccionarrol';

describe('Seleccionarrol', () => {
  let component: Seleccionarrol;
  let fixture: ComponentFixture<Seleccionarrol>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Seleccionarrol]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Seleccionarrol);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
