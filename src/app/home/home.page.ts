import { Component, NgZone } from '@angular/core';
import { PouchDBProvider } from '../pouchdb-provider/pouchdb-provider';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  test;
  constructor(private database: PouchDBProvider, private zone: NgZone) {}

  ionViewDidEnter() {
    this.database.sync();
    this.database.getChangeListener().subscribe(data => {
      this.zone.run(() => {
        console.log(data);
        this.test = data.change.docs[0].test;
      });
    });
    this.database.fetch().then(data => {
      this.zone.run(() => {
        console.log(data);
        if (data.rows.length)
        this.test = data.rows[0].doc.test;
      });
    });
  }

  updateValue() {
    const val = Math.floor((Math.random() * 100) + 1);
    this.database.put({test: val}, val.toString());
  }

}
