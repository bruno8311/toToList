import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  private featureFlagSubject = new BehaviorSubject<boolean>(false);
  featureFlag$ = this.featureFlagSubject.asObservable(); // Observable para escuchar cambios

  setFeatureFlag(value: boolean) {
    this.featureFlagSubject.next(value);
  }

  getFeatureFlag(): boolean {
    return this.featureFlagSubject.value;
  }
}
