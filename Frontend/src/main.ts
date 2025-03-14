import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as $ from 'jquery';

(window as any).$ = $;
(window as any).jQuery = $;


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
