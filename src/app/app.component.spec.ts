import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';
import { fakeAsync, tick } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { FeatureFlagService } from './presentation/services/feature-flag.service';

describe('AppComponent', () => {
  let mockFirebaseX: jasmine.SpyObj<FirebaseX>;
  let mockPlatform: jasmine.SpyObj<Platform>;
  let mockFeatureFlagService: jasmine.SpyObj<FeatureFlagService>;

  beforeEach(async () => {
    mockFirebaseX = jasmine.createSpyObj('FirebaseX', ['fetch', 'activateFetched', 'getValue']);
    mockPlatform = jasmine.createSpyObj('Platform', ['ready']);
    mockFeatureFlagService = jasmine.createSpyObj('FeatureFlagService', ['setFeatureFlag']);

    mockFirebaseX.fetch.and.returnValue(Promise.resolve());
    mockFirebaseX.activateFetched.and.returnValue(Promise.resolve());
    mockFirebaseX.getValue.and.returnValue(Promise.resolve(true));
    mockPlatform.ready.and.returnValue(Promise.resolve('dom'));

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: FirebaseX, useValue: mockFirebaseX },
        { provide: Platform, useValue: mockPlatform },
        { provide: FeatureFlagService, useValue: mockFeatureFlagService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call platform.ready on initialization', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(mockPlatform.ready).toHaveBeenCalled();
  });

  it('should fetch feature flag when platform is ready', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    tick();
    expect(mockFirebaseX.fetch).toHaveBeenCalledWith(0);
    expect(mockFirebaseX.activateFetched).toHaveBeenCalled();
    expect(mockFirebaseX.getValue).toHaveBeenCalledWith('feature_flag');
    expect(mockFeatureFlagService.setFeatureFlag).toHaveBeenCalledWith(true);
  }));

  it('should handle firebase errors gracefully', fakeAsync(() => {
    mockFirebaseX.fetch.and.returnValue(Promise.reject(new Error('Firebase error')));
    spyOn(console, 'error');
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    tick();
    expect(console.error).toHaveBeenCalledWith('Error al obtener el Feature Flag:', jasmine.any(Error));
  }));

});
