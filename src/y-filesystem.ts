// @ts-ignore
import { default as Y } from 'yjs'
import { writeFile } from 'fs/promises'

export class FilesystemPersistence {
  whenSynced: () => Promise<void>
  private doc: Y.Doc
  private storeUpdate: (update: Uint8Array, origin: any, doc: Y.Doc) => Promise<void>

  constructor(doc: Y.Doc) {
    this.doc = doc

    this.whenSynced = async () => {
      let currState = Y.encodeStateAsUpdate(doc)
    }

    this.storeUpdate = async (update: Uint8Array, origin: any, doc: Y.Doc) => {
      Y.applyUpdate(this.doc, update)
      for (let share of this.doc.share.entries()) {
        let name = share[0]
        let ytext = doc.getText(name).toString()
        await writeFile(name, ytext)
      }
      //console.log(ytext)
    }
    doc.on('update', this.storeUpdate)
  }

  destroy() {
    this.doc.off('update', this.storeUpdate)
  }
}
