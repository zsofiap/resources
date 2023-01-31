import { Component } from '@angular/core';
import * as RxJS from 'rxjs';
import * as RxJSOperators from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'resources';

  rxjs = {
    ...RxJS,
    ...RxJSOperators
  };
}
