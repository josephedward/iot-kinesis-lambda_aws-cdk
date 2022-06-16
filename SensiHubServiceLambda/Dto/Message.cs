using System.Text.Json.Serialization;

namespace SensiHubServiceLambda.Dto
{
    public class Message
    {
        [JsonPropertyName("firmware_version")]
        public string? FirmwareVersion { get; set; }

        [JsonPropertyName("hardware_id")]
        public int HardwareId { get; set; }

        [JsonPropertyName("wifi_version")]
        public string? WifiVersion { get; set; }

        [JsonPropertyName("model_number")]
        public string? ModelNumber { get; set; }

        [JsonPropertyName("serial_number")]
        public string? SerialNumber { get; set; }

        [JsonPropertyName("bootloader_version")]
        public string? BootloaderVersion { get; set; }

        [JsonPropertyName("sub_gig_version")]
        public string? SubGigVersion { get; set; }

    }
}
