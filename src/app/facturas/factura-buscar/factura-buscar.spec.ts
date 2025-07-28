import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaBuscar } from './factura-buscar';

describe('FacturaBuscar', () => {
  let component: FacturaBuscar;
  let fixture: ComponentFixture<FacturaBuscar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturaBuscar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturaBuscar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
