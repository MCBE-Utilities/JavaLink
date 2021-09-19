import JavaLink from 'src'
import {
  ServerClient,
} from 'minecraft-protocol'
import mcData from 'minecraft-data'

export class ClientManager {
  
  private client: ServerClient

  constructor(private plugin: JavaLink) { }

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

    this.client.write('difficulty', {
      difficulty: this.plugin.getApi().getConnection()
        .getGameInfo().difficulty,
      difficultyLocked: false,
    })

    this.sendSpawnPosition()
    const pos = this.plugin.getApi().getConnection()
      .getGameInfo().spawn_position
    this.sendPosition(pos.x, pos.y, pos.z, 0, 0)
    this.updateList()
  }

  public sendSpawnPosition(): void {
    this.client.write('spawn_position', {
      location: {
        x: this.plugin.getApi().getConnection()
          .getGameInfo().spawn_position.x,
        y: this.plugin.getApi().getConnection()
          .getGameInfo().spawn_position.x,
        z: this.plugin.getApi().getConnection()
          .getGameInfo().spawn_position.x,
      },
    })
  }
  public sendPosition(x: number, y: number, z: number, yaw: number, pitch: number): void {
    this.client.write('position', {
      x: x,
      y: y,
      z: z,
      yaw: yaw,
      pitch: pitch,
      flags: 0x00,
      teleportId: 1,
    })
  }

  public updateList(): void {
    const listData = []
    const players = this.plugin.getApi().getPlayerManager()
      .getPlayerList()
    for (const [, player] of players) {
      listData.push({
        UUID: player.getUUID(),
        name: player.getName(),
        properties: player.getSkinData(),
        gamemode: 0,
        ping: 0,
      })
    }
    listData.push({
      UUID: this.client.uuid,
      name: this.client.username,
      properties: this.client.profile,
      gamemode: 1,
      ping: this.client.latency,
    })
    this.client.write('player_info', {
      action: 0,
      data: listData,
    })
  }

  public sendMessage(message: string): void {
    this.client.write('chat', {
      message: JSON.stringify({
        text: message,
      }),
      position: 0,
      sender: 'JavaLink',
    })
  }

  public sendChat(sender: string, message: string): void {
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
