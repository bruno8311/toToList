import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';
import { FeatureFlagService } from './presentation/services/feature-flag.service'; // Importa el servicio

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private firebaseX: FirebaseX,
    private platform: Platform,
    private featureFlagService: FeatureFlagService
  ) {
    this.platform.ready().then(() => {
      this.fetchFeatureFlag();
    });
  }

  async fetchFeatureFlag() {
    try {
      await this.firebaseX.fetch(0);
      await this.firebaseX.activateFetched();
      const featureFlag = await this.firebaseX.getValue('feature_flag');
      this.featureFlagService.setFeatureFlag(featureFlag);
    } catch (error) {
      console.error('Error al obtener el Feature Flag:', error);
    }
  }
}
