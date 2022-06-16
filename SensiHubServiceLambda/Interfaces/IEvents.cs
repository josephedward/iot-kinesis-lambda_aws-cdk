using Amazon.IoT.Model;
using Amazon.Lambda.Core;
using SensiHubServiceLambda.Dto;

namespace SensiHubServiceLambda.Interfaces
{
    public interface IEvents
    {
        UpdateThingResponse ProcessEvent(MainMessage mainMessage, ILambdaContext context);
    }
}
