import JavaLink from "src"
import { defaultPackets } from './packets/index'

export class PacketHandler {
  private plugin: JavaLink
  private packets = new Map<string, any>()

  constructor(plugin: JavaLink) {
    this.plugin = plugin
  }
  public onEnabled(): void {
    this.plugin.getServerManager().on('ClientConnected', () => this._loadPackets())
  }
  public onDisabled(): void {
    for (const [, packet] of this.packets) {
      packet.onDisabled()
    }
  }
  private _loadPackets(): void {
    for (const packet of defaultPackets) {
      const newPacket = new packet(this.plugin)
      newPacket.onEnabled()
      this.packets.set(newPacket.packetName, newPacket)
    }
  }
}