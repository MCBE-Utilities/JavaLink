import JavaLink from 'src'
import {
  ServerClient,
} from 'minecraft-protocol'
import mcData from 'minecraft-data'

export class ClientManager {
  private plugin: JavaLink
  private client: ServerClient

  constructor(plugin: JavaLink) {
    this.plugin = plugin
  }
  public onEnabled(): void {
    this.plugin.getServerManager().on('ClientConnected', (client: ServerClient) => this._handlerLogin(client))
  }
  public onDisabled(): void {
    if (!this.client) return
    this.client.end('§cJavaLink§r\n\n§7Connection Closed!')
  }
  public getClient(): ServerClient { return this.client }
  private _handlerLogin(client: ServerClient): void {
    this.client = client
    this.client.username = this.plugin.getApi().getConnection()
      .getXboxProfile().extraData.displayName
    this.plugin.getApi().getWorldManager()
      .sendMessage(`§cJavaLink §r§l§8>§r §e${client.username}§7 Joined the realm!`)
    const loginPacket = mcData('1.16.3') as any
    this.client.write('login', {
      entityId: client.id,
      isHardcore: false,
      gameMode: 0,
      previousGameMode: 255,
      worldNames: loginPacket.loginPacket.worldNames,
      dimensionCodec: loginPacket.loginPacket.dimensionCodec,
      dimension: loginPacket.loginPacket.dimension,
      worldName: 'minecraft:overworld',
      hashedSeed: [0, 0],
      maxPlayers: this.plugin.getServerManager().getServer().maxPlayers,
      viewDistance: 10,
      reducedDebugInfo: false,
      enableRespawnScreen: true,
      isDebug: false,
      isFlat: false,
    })
    this.client.write('position', {
      x: this.plugin.getApi().getConnection()
        .getGameInfo().spawn_position.x,
      y: this.plugin.getApi().getConnection()
        .getGameInfo().spawn_position.y,
      z: this.plugin.getApi().getConnection()
        .getGameInfo().spawn_position.z,
      yaw: 0,
      pitch: 0,
      flags: 0x00,
    })
  }
  public sendMessage(sender: string, message: string): void {
    this.client
      .write('chat', {
        message: JSON.stringify({
          translate: 'chat.type.announcement',
          with: [
            sender,
            message,
          ],
        }),
        position: 0,
        sender: sender,
      })
  }
}
