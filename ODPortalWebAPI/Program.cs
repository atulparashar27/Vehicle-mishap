using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System.IO;
using System.Web.Http;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(s => s.AllowEmptyInputInBodyModelBinding = true);
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyHeader());
app.UseHttpsRedirection();

app.UseRouting();
app.UseExceptionHandler("/error");
app.UseSwagger();
app.UseSwaggerUI();

app.Use(async (context, next) =>
{
    await next();

    if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value))
    {
        context.Request.Path = "/index.html";
        await next();
    }
});

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(name: "DefaultApi",
        pattern: "api/{controller}/{action}/{id}",
        defaults: new { id = RouteParameter.Optional });
});

app.Run();


//namespace ODPortalWebAPI
//{
//    public class Program
//    {
//        public static void Main(string[] args)
//        {
//            CreateHostBuilder(args).Build().Run();
//        }

//        public static IHostBuilder CreateHostBuilder(string[] args) =>
//            Host.CreateDefaultBuilder(args)
//                .ConfigureWebHostDefaults(webBuilder =>
//                {
//                    webBuilder.UseStartup<Startup>();
//                });
//    }
//}
