import JavaLink from "src"

export class PositionsPacket {
  private plugin: JavaLink
  public packetName: "chat"

  constructor(plugin: JavaLink) {
    this.plugin = plugin
  }
  public onEnabled(): void {
    this.plugin.getClientManager().getClient()
      .on('position_look', (data) => {
        console.log(data)
      })
  }
  public onDisabled(): void {
    return
  }
}
