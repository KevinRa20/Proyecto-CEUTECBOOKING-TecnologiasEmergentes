import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrreservaComponent } from './qrreserva';

describe('Qrreserva', () => {
  let component: QrreservaComponent;
  let fixture: ComponentFixture<QrreservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrreservaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrreservaComponent);
import { Qrreserva } from './qrreserva';

describe('Qrreserva', () => {
  let component: Qrreserva;
  let fixture: ComponentFixture<Qrreserva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Qrreserva]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Qrreserva);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
