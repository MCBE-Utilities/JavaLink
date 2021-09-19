import { EventEmitter } from 'events'
import {
  createServer,
  Server,
} from 'minecraft-protocol'
import JavaLink from 'src'

export class ServerManager extends EventEmitter {
  private plugin: JavaLink
  private server: Server
  public port = 25565
  private inv

  constructor(plugin: JavaLink) {
    super()
    this.plugin = plugin
  }
  public onEnabled(): void {
    this.server = createServer({
      "online-mode": true,
      host: "0.0.0.0",
      port: this.port,
      version: "1.16.3",
      motd: "§9JavaLink",
      maxPlayers: this.plugin.getApi().getConnection().realm.maxPlayers,
    })
    this.emit("ServerStarted", this.server)
    this._listener()
    this._logs()
    this._motd()
  }
  public onDisabled(): void {
    clearInterval(this.inv)
    this.server.close()
    this.emit('ServerClosed')
  }
  public getServer(): Server { return this.server }
  private _listener(): void {
    this.server.on('login', (client) => this.emit("ClientConnected", client))
  }
  private _logs(): void {
    this.server.on('error', (error) => this.plugin.getApi().getLogger()
      .error(error))
    this.server.on('listening', () => this.plugin.getApi().getLogger()
      .info(`JavaLink server listening on port ${this.port}.`))
    this.server.on('login', (client) => this.plugin.getApi().getLogger()
      .info(`${client.username} joined the game!`))
  }
  private _motd(): void {
    this.inv = setInterval(() => {
      const playerCount = this.plugin.getApi().getPlayerManager()
        .getPlayerList().size
      this.server.playerCount = playerCount
      this.server.motd = `§9BeRP JavaLink§r\n§7${this.plugin.getApi().getConnection().realm.name}§r §8|§r §ePlayers: §7${playerCount}§r§8/§710§r`
    }, 20)
  }
}
