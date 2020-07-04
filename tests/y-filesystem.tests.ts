import test from 'ava'
//@ts-ignore
import { default as Y } from 'yjs'
import { FilesystemPersistence } from '../src/y-filesystem.js'
import { readFile } from 'fs/promises'

test('can persist a file', async t => {
  let doc1 = new Y.Doc()
  let persist = new FilesystemPersistence(doc1)
  let filename = 'tests/out/somedoc.js'
  let txt = doc1.getText(filename)
  txt.insert(0, 'abc')
  txt.insert(2, 'xyz')
  txt.insert(0, '123')
  let expected = '123abxyzc'
  let actual = await readFile(filename, { encoding: 'utf8' })
  t.is(actual, expected, "persisted file contents are incorrect")
})