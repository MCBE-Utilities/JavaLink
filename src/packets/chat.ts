import JavaLink from "src"

export class ChatPacket {
  private plugin: JavaLink
  public packetName: "chat"

  constructor(plugin: JavaLink) {
    this.plugin = plugin
  }
  public onEnabled(): void {
    this.plugin.getApi().getConnection()
      .on('text', (packet) => {
        if (packet.type != "chat" || packet.source_name == this.plugin.getApi().getConnection()
          .getXboxProfile().extraData.displayName || !this.plugin.getClientManager().getClient()) return
        this.plugin.getClientManager().sendMessage(`<${packet.source_name}> ${packet.message}`)
      })
    this.plugin.getClientManager().getClient()
      .on('chat', (data) => {
        this.plugin.getClientManager().sendMessage(`<${this.plugin.getClientManager().getClient().username}> ${data.message}`)
        this.plugin.getApi().getConnection()
          .sendPacket('text', {
            message: data.message,
            needs_translation: false,
            platform_chat_id: '',
            type: 'chat',
            source_name: this.plugin.getApi().getConnection()
              .getXboxProfile().extraData.displayName,
            xuid: this.plugin.getApi().getConnection()
              .getXboxProfile().extraData.XUID,
          })
      })
  }
  public onDisabled(): void {
    //
  }
}
