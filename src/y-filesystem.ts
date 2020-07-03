// @ts-ignore
import { default as Y } from 'yjs'
import * as mutex from 'lib0/mutex.js'
import { Observable } from 'lib0/observable.js'
import { writeFile } from 'fs/promises'

const customStoreName = 'custom'
const updatesStoreName = 'updates'

export const PREFERRED_TRIM_SIZE = 500

/**
 * @param {FilesystemPersistence} fsPersistence
 */
export const fetchUpdates = (fsPersistence: FilesystemPersistence) => {
  if (!fsPersistence.db) {
    throw new Error("fsPersistence should not be null")
  }
  //const [updatesStore] = idb.transact(/** @type {any} */(fsPersistence.db), [updatesStoreName]) // , 'readonly')
  //return idb.getAll(updatesStore, idb.createIDBKeyRangeLowerBound(fsPersistence._dbref, false)).then(updates =>
  //  fsPersistence._mux(() =>
  //    updates.forEach(val => Y.applyUpdate(fsPersistence.doc, val))
  //  )
  //)
  //  .then(() => idb.getLastKey(updatesStore).then(lastKey => { fsPersistence._dbref = lastKey + 1 }))
  //  .then(() => idb.count(updatesStore).then(cnt => { fsPersistence._dbsize = cnt }))
  //  .then(() => updatesStore)
}

/**
 * @param {FilesystemPersistence} fsPersistence
 * @param {boolean} forceStore
 */
export const storeState = (fsPersistence: FilesystemPersistence, forceStore: boolean = true) => {
  fetchUpdates(fsPersistence)
}
//.then(updatesStore => {
//  if (forceStore || fsPersistence._dbsize >= PREFERRED_TRIM_SIZE) {
//    idb.addAutoKey(updatesStore, Y.encodeStateAsUpdate(fsPersistence.doc))
//      .then(() => idb.del(updatesStore, idb.createIDBKeyRangeUpperBound(fsPersistence._dbref, true)))
//      .then(() => idb.count(updatesStore).then(cnt => { fsPersistence._dbsize = cnt }))
//  }
//})

/**
 * @param {string} name
 */
export const clearDocument = (name: string) => { }

/**
 * @extends Observable<string>
 */
export class FilesystemPersistence extends Observable<any> {
  doc: Y.Doc
  name: string
  _mux: mutex.mutex
  _dbref: number
  _dbsize: number
  db: any
  synced: boolean
  whenSynced: any
  _storeTimeout: number
  _storeTimeoutId: NodeJS.Timeout | null
  _storeUpdate: (update: Uint8Array, origin: any, doc: Y.Doc) => any

  /**
   * @param {string} name
   * @param {Y.Doc} doc
   */
  constructor(name: string, doc: Y.Doc) {
    super()
    this.doc = doc
    this.name = name
    this._mux = mutex.createMutex()
    this._dbref = 0
    this._dbsize = 0
    this.db = null
    this.synced = false
    /**
     * @type {Promise<FilesystemPersistence>}
     */
    this.whenSynced = async () => {
      const currState = Y.encodeStateAsUpdate(doc)
    }
    //this.whenSynced = this._db.then((db: any) => {
    //  this.db = db
    //  const currState = Y.encodeStateAsUpdate(doc)
    //  //return fetchUpdates(this).then(updatesStore => idb.addAutoKey(updatesStore, currState)).then(() => {
    //  //  this.emit('synced', [this])
    //  //  this.synced = true
    //  //  return this
    //  //})
    //})
    /**
     * Timeout in ms untill data is merged and persisted in idb.
     */
    this._storeTimeout = 1000

    this._storeTimeoutId = null

    this._storeUpdate = async (update: Uint8Array, origin: any, doc: Y.Doc) => {
      Y.applyUpdate(this.doc, update)
      for (let share of this.doc.share.entries()) {
        let name = share[0]
        console.log(name)
        let ytext = doc.getText(name).toString()
        await writeFile(name, ytext)
      }
      //console.log(ytext)
    }
    //this._mux(() => {
    //  if (this.db) {
    //    const [updatesStore] = idb.transact(/** @type {any} */(this.db), [updatesStoreName])
    //    idb.addAutoKey(updatesStore, update)
    //    if (++this._dbsize >= PREFERRED_TRIM_SIZE) {
    //      // debounce store call
    //      if (this._storeTimeoutId !== null) {
    //        clearTimeout(this._storeTimeoutId)
    //      }
    //      this._storeTimeoutId = setTimeout(() => {
    //        storeState(this, false)
    //        this._storeTimeoutId = null
    //      }, this._storeTimeout)
    //    }
    //  }
    //})
    doc.on('update', this._storeUpdate)
  }

  destroy() {
    if (this._storeTimeoutId) {
      clearTimeout(this._storeTimeoutId)
    }
    this.doc.off('update', this._storeUpdate)
    //return this._db.then(db => {
    //  db.close()
    //})
  }

  /**
   * Destroys this instance and removes all data from indexeddb.
   */
  clearData() {
    //this.destroy().then(() => {
    //  //idb.deleteDB(this.name)
    //})
  }

  /**
   * @param {String | number | ArrayBuffer | Date} key
   * @return {Promise<String | number | ArrayBuffer | Date | any>}
   */
  get(key: string | number | ArrayBuffer | Date): Promise<string | number | ArrayBuffer | Date | any> {
    return new Promise(() => { })
    //return this._db.then(db => {
    //  const [custom] = idb.transact(db, [customStoreName], 'readonly')
    //  return idb.get(custom, key)
    //})
  }

  /**
   * @param {String | number | ArrayBuffer | Date} key
   * @param {String | number | ArrayBuffer | Date} value
   * @return {Promise<String | number | ArrayBuffer | Date>}
   */
  set(key: string | number | ArrayBuffer | Date, value: string | number | ArrayBuffer | Date): Promise<string | number | ArrayBuffer | Date> {
    return new Promise(() => { })
    //return this._db.then(db => {
    //  const [custom] = idb.transact(db, [customStoreName])
    //  return idb.put(custom, key, value)
    //})
  }

  /**
   * @param {String | number | ArrayBuffer | Date} key
   * @return {Promise<undefined>}
   */
  del(key: string | number | ArrayBuffer | Date): Promise<undefined> {
    return new Promise(() => { })
    //return this._db.then(db => {
    //  const [custom] = idb.transact(db, [customStoreName])
    //  return idb.del(custom, key)
    //return undefined
    //})
  }
}
