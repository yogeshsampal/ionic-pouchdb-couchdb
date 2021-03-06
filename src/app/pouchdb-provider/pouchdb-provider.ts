import { Injectable, EventEmitter } from '@angular/core';
import PouchDB from 'pouchdb';
@Injectable()
export class PouchDBProvider {

    private isInstantiated: boolean;
    private database: any;
    private remoteDB: any;
    private listener: EventEmitter<any> = new EventEmitter();

    public constructor() {
        if(!this.isInstantiated) {
            this.database = new PouchDB("testdb");
            //this.remoteDB = new PouchDB("http://192.168.225.188:5984")
            this.remoteDB = new PouchDB("http://root:root@192.168.225.188:5984/testdb")
            this.isInstantiated = true;
        }
    }

    public fetch() {
        return this.database.allDocs({include_docs: true});
    }

    public get(id: string) {
        return this.database.get(id);
    }

    public put(document: any, id: string) {
        document._id = id;
        return this.get(id).then(result => {
            document._rev = result._rev;
            return this.database.put(document);
        }, error => {
            if(error.status == "404") {
                return this.database.put(document);
            } else {
                return new Promise((resolve, reject) => {
                    reject(error);
                });
            }
        });
    }

    public sync() {
        this.database.sync(this.remoteDB, {
            live: true
        }).on('change', change => {
            this.listener.emit(change);
        }).on('error', error => {
            console.error(JSON.stringify(error));
        });
    }

    public getChangeListener() {
        return this.listener;
    }

}
