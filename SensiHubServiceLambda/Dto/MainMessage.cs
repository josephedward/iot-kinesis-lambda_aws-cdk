using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace SensiHubServiceLambda.Dto
{
    public class MainMessage
    {
        [JsonPropertyName("message")]
        public Message? Message { get; set; }

        [JsonPropertyName("topic")]
        public string? Topic { get; set; }

        [JsonPropertyName("messageType")]
        public string? MessageType { get; set; }

        [JsonPropertyName("version")]
        public string? Version { get; set; }

        [JsonPropertyName("mac_address")]
        public string? MacAddress { get; set; }

        [JsonPropertyName("traceID")]
        public string? TraceID { get; set; }

        [JsonPropertyName("timestamp")]
        public double? Timestamp { get; set; }
    }
}
