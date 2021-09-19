import JavaLink from "src"

export class PositionsPacket {

  public packetName: "chat"

  constructor(private plugin: JavaLink) { }

  public onEnabled(): void {
    this.plugin.getClientManager().getClient().on('position_look', (data) => {
      console.log(data)
    })
  }

  public onDisabled(): void {
    return
  }

}
