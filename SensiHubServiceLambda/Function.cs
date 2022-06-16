using System;
using System.IO;
using System.Text;
using System.Text.Json;
using Amazon.Lambda.Core;
using Amazon.Lambda.KinesisEvents;
using Microsoft.Extensions.DependencyInjection;
using SensiHubServiceLambda.Config;
using SensiHubServiceLambda.Dto;
using SensiHubServiceLambda.Interfaces;




// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace SensiHubServiceLambda
{
    public class Function
    {
        private readonly IEvents _eventService;

        public Function()
        {
            ServerlessConfig.ConfigureServices();
            _eventService = ServerlessConfig.Services.GetRequiredService<IEvents>();
        }

        public void FunctionHandler(KinesisEvent kinesisEvent, ILambdaContext context)
        {
            foreach (var record in kinesisEvent.Records)
            {
                try
                {
                    string recordData = GetRecordContents(record.Kinesis);
                    var message = JsonSerializer.Deserialize<MainMessage>(recordData) ?? throw new Exception($"Failed to deserialize: {recordData}");
                    var response = _eventService.ProcessEvent(message, context);
                    context.Logger.Log(JsonSerializer.Serialize(response));
                }
                catch (Exception ex)
                {
                    context.Logger.Log($"Failed to process message: {ex.Message}");
                }
            }
        }

        private string GetRecordContents(KinesisEvent.Record streamRecord)
        {
            using (var reader = new StreamReader(streamRecord.Data, Encoding.ASCII))
            {
                return reader.ReadToEnd();
            }
        }
    }
}