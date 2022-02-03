import { IOClients } from '@vtex/api'
import { Catalog } from '@vtex/clients'

// Extend the default IOClients implementation with addional clients
export class Clients extends IOClients {
  public get catalog() {
    return this.getOrSet('catalog', Catalog)
  }
}
