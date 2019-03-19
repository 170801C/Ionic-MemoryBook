import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapturedModalPage } from './captured-modal.page';

describe('CapturedModalPage', () => {
  let component: CapturedModalPage;
  let fixture: ComponentFixture<CapturedModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapturedModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturedModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
