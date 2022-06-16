using Amazon.IoT;
using Microsoft.Extensions.DependencyInjection;
using SensiHubServiceLambda.Interfaces;
using SensiHubServiceLambda.Services;
using System;

namespace SensiHubServiceLambda.Config
{
    public static class ServerlessConfig
    {
        public static IServiceProvider Services { get; private set; }

        public static void ConfigureServices()
        {
            var serviceCollection = new ServiceCollection();

            serviceCollection.AddSingleton<AmazonIoTClient>();
            serviceCollection.AddTransient<IEvents, Events>();

            Services = serviceCollection.BuildServiceProvider();
        }
    }
}
