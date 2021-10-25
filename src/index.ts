import { PluginApi } from './@interface/pluginApi.i'
import { ClientManager } from './ClientManager'
import { ServerManager } from './ServerManager'
import { PacketHandler } from './PacketHandler'

class JavaLink {

  private serverManager: ServerManager
  private clientManager: ClientManager
  private packetHandler: PacketHandler

  constructor(private api: PluginApi) {
    this.serverManager = new ServerManager(this)
    this.clientManager = new ClientManager(this)
    this.packetHandler = new PacketHandler(this)
  }

  public onEnabled(): void {
    this.api.getLogger().info('Enabled!')
    this.clientManager.onEnabled()
    this.packetHandler.onEnabled()
    this.serverManager.onEnabled()
  }

  public onDisabled(): void {
    this.api.getLogger().info('Disabled!')
    this.clientManager.onDisabled()
    this.packetHandler.onDisabled()
    this.serverManager.onDisabled()
  }

  public getApi(): PluginApi { return this.api }
  public getServerManager(): ServerManager { return this.serverManager }
  public getClientManager(): ClientManager { return this.clientManager }
  public getPacketHandler(): PacketHandler { return this.packetHandler }
}

export = JavaLink
