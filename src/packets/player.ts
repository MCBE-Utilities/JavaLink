import JavaLink from "src"

export class PlayerPacket {
  private plugin: JavaLink
  public packetName: "player"

  constructor(plugin: JavaLink) {
    this.plugin = plugin
  }
  public onEnabled(): void {
    this.plugin.getApi().getEventManager()
      .on('PlayerJoin', () => {
        this.plugin.getClientManager().updateList()
      })
    this.plugin.getApi().getEventManager()
      .on('PlayerInitialized', (player) => {
        this.plugin.getClientManager().updateList()
        this.plugin.getClientManager().sendMessage(`§e${player.getName()} joined the Realm`)
      })
    this.plugin.getApi().getEventManager()
      .on('PlayerLeft', (player) => {
        this.plugin.getClientManager().updateList()
        this.plugin.getClientManager().sendMessage(`§e${player.getName()} left the Realm`)
      })
  }
  public onDisabled(): void {
    //
  }
}
