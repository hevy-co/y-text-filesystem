import * as chai from 'chai'
//@ts-ignore
import { default as Y } from 'yjs'
import { FilesystemPersistence, clearDocument, PREFERRED_TRIM_SIZE, fetchUpdates } from '../src/y-filesystem.js'
import * as promise from 'lib0/promise.js'

describe('Filesystem Persistence', async () => {
  describe('Update and Merge', async () => {
    let docName = 'testdoc1'
    await clearDocument(docName)
    const doc1 = new Y.Doc()
    const arr1 = doc1.getArray('t')
    const doc2 = new Y.Doc()
    const arr2 = doc2.getArray('t')
    arr1.insert(0, [0])
    const persistence1 = new FilesystemPersistence(docName, doc1)
    persistence1._storeTimeout = 0
    await persistence1.whenSynced
    arr1.insert(0, [1])
    const persistence2 = new FilesystemPersistence(docName, doc2)
    persistence2._storeTimeout = 0
    await persistence2.whenSynced
    chai.assert.equal(arr2.length, 2)
    for (let i = 2; i < PREFERRED_TRIM_SIZE + 1; i++) {
      arr1.insert(i, [i])
    }
    await promise.wait(100)
    await fetchUpdates(persistence2)
    chai.assert.equal(arr2.length, PREFERRED_TRIM_SIZE + 1)
    chai.assert.equal(persistence1._dbsize, 1) // wait for dbsize === 0. db should be concatenated
  })

  describe('Concurrent Merge', async () => {
    let docName = 'testdoc2'
    await clearDocument(docName)
    const doc1 = new Y.Doc()
    const arr1 = doc1.getArray('t')
    const doc2 = new Y.Doc()
    const arr2 = doc2.getArray('t')
    arr1.insert(0, [0])
    const persistence1 = new FilesystemPersistence(docName, doc1)
    persistence1._storeTimeout = 0
    await persistence1.whenSynced
    arr1.insert(0, [1])
    const persistence2 = new FilesystemPersistence(docName, doc2)
    persistence2._storeTimeout = 0
    await persistence2.whenSynced
    chai.assert.equal(arr2.length, 2)
    arr1.insert(0, ['left'])
    for (let i = 0; i < PREFERRED_TRIM_SIZE + 1; i++) {
      arr1.insert(i, [i])
    }
    arr2.insert(0, ['right'])
    for (let i = 0; i < PREFERRED_TRIM_SIZE + 1; i++) {
      arr2.insert(i, [i])
    }
    await promise.wait(100)
    await fetchUpdates(persistence1)
    await fetchUpdates(persistence2)
    chai.assert.isTrue(persistence1._dbsize < 10)
    chai.assert.isTrue(persistence2._dbsize < 10)
    chai.assert.equal(arr1.toArray(), arr2.toArray())
  })
})