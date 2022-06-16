using Amazon.IoT;
using Amazon.IoT.Model;
using SensiHubServiceLambda.Dto;
using SensiHubServiceLambda.Interfaces;
using System.Collections.Generic;
using System;
using Amazon.Lambda.Core;

namespace SensiHubServiceLambda.Services
{
    public class Events : IEvents
    {
        private readonly AmazonIoTClient _iotClient;

        public Events(AmazonIoTClient iotClient)
        {
            _iotClient = iotClient;
        }

        public UpdateThingResponse ProcessEvent(MainMessage mainMessage, ILambdaContext context)
        {
            var localTime = IoTTimeStampToDateTime((double)mainMessage.Timestamp).ToShortDateString();
            var attributes = new Dictionary<string, string>();
            attributes.Add("firmware_version", mainMessage.Message.FirmwareVersion);
            attributes.Add("hardware_id", mainMessage.Message.HardwareId.ToString());
            attributes.Add("wifi_version", mainMessage.Message.WifiVersion);
            attributes.Add("model_number", mainMessage.Message.ModelNumber);
            attributes.Add("serial_number", mainMessage.Message.SerialNumber);
            attributes.Add("bootloader_version", mainMessage.Message.BootloaderVersion);
            attributes.Add("sub_gig_version", mainMessage.Message.SubGigVersion);
            attributes.Add("last_updated", localTime);

            var request = new UpdateThingRequest
            {
                ThingName = mainMessage.MacAddress,
                AttributePayload = new AttributePayload
                {
                    Attributes = attributes,
                    Merge = true
                }
            };
            
            UpdateThingResponse response = new UpdateThingResponse();
            response = _iotClient.UpdateThingAsync(request).Result;
            return response;
        }

        public static DateTime IoTTimeStampToDateTime(double unixTimeStamp = 0)
        {
            // Unix timestamp is seconds past epoch
            DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            var seconds = TimeSpan.FromMilliseconds(unixTimeStamp).TotalSeconds;
            dtDateTime = dtDateTime.AddSeconds(seconds).ToUniversalTime();
            return dtDateTime;
        }
    }
}
