import * as chai from 'chai'
//@ts-ignore
import { default as Y } from 'yjs'
import { FilesystemPersistence, clearDocument, PREFERRED_TRIM_SIZE, fetchUpdates } from '../src/y-filesystem.js'
import { readFile } from 'fs/promises'
let expect = chai.expect

describe('Filesystem Persistence', async () => {
  it('can persist a file', async () => {
    let docName = 'testdoc'
    await clearDocument(docName)
    let doc1 = new Y.Doc()
    let persist = new FilesystemPersistence(docName, doc1)
    let filename = 'tests/out/somedoc.js'
    let txt = doc1.getText(filename)
    txt.insert(0, 'abc')
    txt.insert(2, 'xyz')
    txt.insert(0, '123')
    let expected = '123abxyzc'
    let actual = await readFile(filename, { encoding: 'utf8' })
    expect(actual).to.be.equal(expected, "persisted file contents are incorrect")
  })

  /*
  describe.skip('Update and Merge', async () => {
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

  describe.skip('Concurrent Merge', async () => {
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
  */
})