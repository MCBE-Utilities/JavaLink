import { PluginApi } from './@interface/pluginApi.i'
import {
  createServer,
  ServerClient,
  Server,
} from 'minecraft-protocol'
import mcData from 'minecraft-data'

class JavaLink {
    private api: PluginApi
    private server: Server
    private client: ServerClient
    private inv: any

    constructor(api: PluginApi) {
      this.api = api
    }

    public onEnabled(): void {
      this.api.getLogger().info('Enabled!')
      this.server = createServer({
        "online-mode": true,
        host: "0.0.0.0",
        port: 25565,
        version: "1.16.3",
        motd: `JavaLink: ${this.api.getConnection().realm.name}`,
        maxPlayers: this.api.getConnection().realm.maxPlayers,
      })
      this.server.on("login", (client) => this._handleLogin(client))
      this._chatListener()
      this._motd()
    }
    public onDisabled(): void {
      this.api.getLogger().info('Disabled!')
      clearInterval(this.inv)
      this.server.close()
    }
    private _handleLogin(client: ServerClient): void {
      this.client = client
      this.api.getWorldManager().sendMessage(`§cJavaLink §r§l§8>§r §e${client.username}§7 Joined the realm!`)
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
        maxPlayers: this.server.maxPlayers,
        viewDistance: 10,
        reducedDebugInfo: false,
        enableRespawnScreen: true,
        isDebug: false,
        isFlat: false,
      })
      this.client.write('position', {
        x: this.api.getConnection().getGameInfo().spawn_position.x,
        y: this.api.getConnection().getGameInfo().spawn_position.y,
        z: this.api.getConnection().getGameInfo().spawn_position.z,
        yaw: 0,
        pitch: 0,
        flags: 0x00,
      })
      this.client.on('packet', (data) => {
        //console.log(data)
      })
    }
    private _chatListener(): void {
      this.api.getConnection().on('text', (packet) => {
        if (packet.type != "chat" || !this.client) return
        this.client.write('chat', {
          message: JSON.stringify({
            translate: 'chat.type.announcement',
            with: [
              packet.source_name || "Unkown",
              packet.message,
            ],
          }),
          position: 0,
          sender: packet.source_name,
        })
      })
    }
    private _motd(): void {
      this.inv = setInterval(() => {
        const playerCount = this.api.getPlayerManager().getPlayerList().size
        this.server.playerCount = playerCount
        this.server.motd = `§9BeRP JavaLink§r\n§7${this.api.getConnection().realm.name}§r §8|§r §ePlayers: §7${playerCount}§r§8/§710§r`
      }, 20)
    }
}

export = JavaLink
