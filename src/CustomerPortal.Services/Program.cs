global using CustomerPortal.Services.Core;
using CustomerPortal.Services.Controllers.Helper;
using CustomerPortal.Services.Controllers.Helper.Auth;
using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.Crypto;
using CustomerPortal.Services.Repositories.Auth;
using CustomerPortal.Services.Repositories.ErrorLogging;
using CustomerPortal.Services.Repositories.JobActivityRepo;
using CustomerPortal.Services.Repositories.LookUpRepo;
using CustomerPortal.Services.Repositories.UserRepo;
using CustomerPortal.Services.Services.Auth;
using CustomerPortal.Services.Services.ErrorLogging;
using CustomerPortal.Services.Services.JobActivity;
using CustomerPortal.Services.Services.LookUp;
using CustomerPortal.Services.Services.UserService;
using CustomerPortal.Services.Validations.AccountUser;
using DbUp;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using Microsoft.AspNetCore.HttpOverrides;
using System.Text;
using System.Security.Cryptography;
// using CustomerPortal.Services.Core;


using CustomerPortal.Services.Services.Reports;
using CustomerPortal.Services.Repositories.ReportsRepo;
using CustomerPortal.Services.Controllers.Helper.Reports;
using CustomerPortal.Services.Services.Configurations;
using CustomerPortal.Services.Repositories.Configurations;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Authorization;
using CustomerPortal.Services.Services;
using CustomerPortal.Services.Repositories;
using CustomerPortal.Services.Services.Turorials;

var builder = WebApplication.CreateBuilder(args);
var cipher = builder.Configuration.GetConnectionString("ConnectionString");
string key = builder.Configuration["Security:Key"];
var data = Convert.FromBase64String(cipher);
string modifiedConnectionString = "";
var obj = Configuration.GetInstance();
using (var md5 = new MD5CryptoServiceProvider())
{
    var keys = md5.ComputeHash(Encoding.UTF8.GetBytes(key));

    using (var tripDes = new TripleDESCryptoServiceProvider()
    {
        Key = keys,
        Mode = CipherMode.ECB,
        Padding = PaddingMode.PKCS7
    })
    {
        var transform = tripDes.CreateDecryptor();
        var results = transform.TransformFinalBlock(data, 0, data.Length);
        modifiedConnectionString = Encoding.UTF8.GetString(results);
        obj.SetConnectionString(modifiedConnectionString);
    }
}

builder.Services.AddDbContext<CustomerPortalDbContext>(options =>
{
    options.UseSqlServer(obj.GetConnectionString());
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
         a => a.WithOrigins("*").AllowAnyMethod()
         .AllowAnyHeader());
});
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthRepo, AuthRepo>();
builder.Services.AddScoped<ICrypto, Crypto>();
builder.Services.AddScoped<ILookUp, LookUp>();
builder.Services.AddScoped<ILookUpRepo, LookUpRepo>();
builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEditUserDataValidations, EditUserDataValidations>();
builder.Services.AddScoped<IJobActivityService, JobActivityService>();
builder.Services.AddScoped<IJobActivityRepo, JobActivityRepo>();
builder.Services.AddScoped<IAuthHelper, AuthHelper>();
builder.Services.AddScoped<IErrorLogging, ErrorLogging>();
builder.Services.AddScoped<IErrorLoggingRepo, ErrorLoggingRepo>();
builder.Services.AddScoped<ICentralHelper, CentralHelper>();
builder.Services.AddScoped<IReportHelper, ReportHelper>();
builder.Services.AddScoped<IReports, Reports>();
builder.Services.AddScoped<IReportsRepo, ReportsRepo>();
builder.Services.AddScoped<IConfigurationsRepo, ConfigurationsRepo>();
builder.Services.AddScoped<IConfigurationService, ConfigurationService>();
builder.Services.AddScoped<IGenericRepository, GenericRepository>();
builder.Services.AddScoped<IResurfacingRepo, ResurfacingRepo>();
builder.Services.AddScoped<ITutorialsService, TutorialsService>();


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Token"]))
    };
});
builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});

//Log.Logger = new LoggerConfiguration().CreateBootstrapLogger();
//builder.Host.UseSerilog((hostContext, configuration) =>
//{
//    configuration.WriteTo.MSSqlServer(connectionString, "Logs");
//});


builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});
var app = builder.Build();
app.UseHttpsRedirection();
app.UseForwardedHeaders();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAll");



app.UseAuthentication();
// app.UseSerilogRequestLogging();

app.UseAuthorization();

// app.UseStaticFiles();

//var fp = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "Videos"));
var filepath = builder.Configuration["FilePath"];
var CommonV = builder.Configuration["CommonV"];
var CommonD = builder.Configuration["CommonD"];
if (filepath != null  || filepath != "")
{
    bool folderExistsV = Directory.Exists(filepath+CommonV);
    if (!folderExistsV)
    {
        Directory.CreateDirectory(filepath + CommonV);
    }
    bool folderExistsD = Directory.Exists(filepath + CommonD);
    if (!folderExistsD)
    {
        Directory.CreateDirectory(filepath + CommonD);
    }

    obj.SetFilePath(filepath);
    app.UseFileServer(new FileServerOptions
    {
        FileProvider = new PhysicalFileProvider(filepath),
        RequestPath = "/StaticFiles",
        EnableDirectoryBrowsing = true
    });
}



app.MapControllers();

app.Run();
