using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;
using System.Linq;
using System.Web.Http;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(s => s.AllowEmptyInputInBodyModelBinding = true);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(opt => opt.AddPolicy("ODRSA", c =>
{
    c.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
}));

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "application/json" });
});

if (builder.Environment.IsDevelopment())
{
    Environment.SetEnvironmentVariable("dataSource", $"{Environment.CurrentDirectory + $"\\App_Data\\odrsa-database.accdb"}");
}
else
{
    Environment.SetEnvironmentVariable("dataSource", "d:\\DZHosts\\LocalUser\\atulparashar0727\\www.odrsa.somee.com\\App_Data\\odrsa-database.accdb");
}

var app = builder.Build();

app.UseResponseCompression();

app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyHeader());
app.UseCors("ODRSA");
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

//public class Startup
//{
//    public Startup(IConfiguration configuration)
//    {
//        Configuration = configuration;
//    }

//    public IConfiguration Configuration { get; }

//    // This method gets called by the runtime. Use this method to add services to the container.
//    public void ConfigureServices(IServiceCollection services)
//    {
//        services.AddControllers();
//    }

//    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
//    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
//    {
//        app.UseExceptionHandler("/error");

//        loggerFactory.AddFile("Logs/ODPortal-{Date}.txt");

//        //if (!env.IsDevelopment())
//        //{
//        //    app.UseDeveloperExceptionPage();
//        //}

//        app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyHeader());
//        app.UseHttpsRedirection();

//        app.UseRouting();

//        app.UseAuthorization();

//        app.Use(async (context, next) =>
//        {
//            await next();

//            if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value))
//            {
//                context.Request.Path = "/index.html";
//                await next();
//            }
//        });

//        //if (!env.IsDevelopment())
//        //{
//        //    app.UseSpaStaticFiles();
//        //}

//        app.UseEndpoints(endpoints =>
//        {
//            endpoints.MapControllerRoute(name: "DefaultApi",
//                pattern: "api/{controller}/{action}/{id}",
//                defaults: new { id = RouteParameter.Optional });
//        });
//    }

//    //private void AddAuthentication(IServiceCollection services)
//    //{
//    //    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    //        .AddJwtBearer(options =>
//    //        {
//    //            options.TokenValidationParameters = new TokenValidationParameters
//    //            {
//    //                ValidateIssuer = true,
//    //                ValidateAudience = true,
//    //                ValidateLifetime = true,
//    //                ValidIssuer = Configuration["Jwt:Issuer"],
//    //            };
//    //        });
//    //}
//}