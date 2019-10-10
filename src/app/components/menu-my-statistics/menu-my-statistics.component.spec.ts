import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMyStatisticsComponent } from './menu-my-statistics.component';

describe('MenuMyStatisticsComponent', () => {
  let component: MenuMyStatisticsComponent;
  let fixture: ComponentFixture<MenuMyStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuMyStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuMyStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
