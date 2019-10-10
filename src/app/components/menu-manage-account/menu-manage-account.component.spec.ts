import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuManageAccountComponent } from './menu-manage-account.component';

describe('MenuManageAccountComponent', () => {
  let component: MenuManageAccountComponent;
  let fixture: ComponentFixture<MenuManageAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuManageAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuManageAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
