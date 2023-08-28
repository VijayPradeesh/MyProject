using CustomerPortal.Services.Controllers.Helper.Auth;
using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.Crypto;
using CustomerPortal.Services.Repositories.Auth;
using CustomerPortal.Services.Repositories.JobActivityRepo;
using CustomerPortal.Services.Repositories.LookUpRepo;
using CustomerPortal.Services.Repositories.UserRepo;
using CustomerPortal.Services.Services.Auth;
using CustomerPortal.Services.Services.JobActivity;
using CustomerPortal.Services.Services.LookUp;
using CustomerPortal.Services.Services.UserService;
using CustomerPortal.Services.Validations.AccountUser;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("ConnectionString");
builder.Services.AddDbContext<CustomerPortalDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        a => a.AllowAnyMethod()
        .AllowAnyHeader()
        .AllowAnyOrigin());
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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
