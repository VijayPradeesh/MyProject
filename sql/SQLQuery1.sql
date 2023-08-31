create table Dummy1
(
[ID] int identity not null,
[Name] varchar(20) not null,
[Address] varchar(30),
constraint dummy_pk primary key
([ID],[Name]
)
);
select * from [dbo].[Dummy1]

insert into [dbo].[Dummy1] ([Name],[Address]) values ('Vijay','Pondcherry');

select * from [dbo].[Dummy1]

insert into dbo.Dummy1 ([Name],[Address]) values ('Santhosh','Chennai'),('Abhishek','Chennai');

select * from [dbo].[Dummy1]

update dbo.Dummy1 set [Address] ='Pondicherry'
where [Name]='Vijay';

update dbo.Dummy1 set [Address]='Chennai'
where [Name]='Abhishek' or [Name]='Santhosh'

select *from dbo.Dummy1;

alter table dbo.Dummy1 add [Interest] varchar(30) not null default 'c#' with values;

select * from dbo.Dummy1;

select count([Interest])  as total_interest from dbo.Dummy1
where [Interest]='c#';

select * from dbo.Dummy1
where [Address] like 'che%';

create table demoRecord
(
[Brand] varchar(20),
[category] varchar(40),
[totalSales] money,
[perYear TotalSales] money
);

select [Brand], sum([perYear TotalSales]) as pyts from dbo.demoRecord
group by [Brand];

select [brand], sum([totalSales]) as tts from dbo.demoRecord
group by [brand];

select [Brand] from dbo.demoRecord
where [brand] is not null;

select [Brand] from dbo.demoRecord
where [perYear TotalSales] is not null; 

select [Brand],sum([totalSales]) from dbo.demoRecord
where [Brand]!=''
group by [Brand];

exec sp_help demoRecord;

delete dbo.demoRecord
where [Brand]='';

select * from dbo.demoRecord;

delete dbo.demoRecord
where [totalSales] is null or [perYear TotalSales] is null;

select * from dbo.demoRecord;

select * from dbo.demoRecord
where [category]='cosmetics' or [category]='fragrances';

select [Brand],sum([totalSales]) from dbo.demoRecord
group by[Brand];

select DISTINCT [Brand] from dbo.demoRecord;



