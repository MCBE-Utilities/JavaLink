import JavaLink from "src"

export class PlayerPacket {

  public packetName: "player"

  constructor(private plugin: JavaLink) { }

  public onEnabled(): void {
    this.plugin.getApi().getEventManager().on('PlayerJoin', () => {
      this.plugin.getClientManager().updateList()
    })

    this.plugin.getApi().getEventManager().on('PlayerInitialized', (player) => {
      this.plugin.getClientManager().updateList()
      this.plugin.getClientManager().sendMessage(`§e${player.getName()} joined the Realm`)
    })
    
    this.plugin.getApi().getEventManager().on('PlayerLeft', (player) => {
      this.plugin.getClientManager().updateList()
      this.plugin.getClientManager().sendMessage(`§e${player.getName()} left the Realm`)
    })
  }

  public onDisabled(): void {
    return
  }

}
