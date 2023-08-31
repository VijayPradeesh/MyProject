create table temp_table
(    
[sl_no]	int primary key,
[name]	varchar(20) not null,
[date of birth] date not null
);

insert into temp_table
values
('1','Vijay','02/21/1997'),
('2','Santhosh','05/23/1998'),
('3','Abhishek','03/13/1996');

select * from temp_table
--inline sql queries
declare @date date
set @date = '02/21/1997'
declare @age int
set @age = DATEDIFF(YEAR,@date,GETDATE());
print @age

--user defined function
create function calculate_age(@dob date)
returns int
as
begin
		declare @age int
		set @age = DATEDIFF(year, @dob, GETDATE()) --datediff-built in function to calculate the difference 
		return @age
end

--calling user defined function
declare @age_age int
set @age_age=sqlAssessments.dbo.calculate_age('02/21/1997')
print  concat('age is ',@age_age )
--print 'age is '+ cast(@age as varchar(20)) -- type casting


select * from temp_table

select sl_no,name, [date of birth],[sqlAssessments].dbo.calculate_age([date of birth]) as age from temp_table
where sqlAssessments.dbo.calculate_age([date of birth])>23


alter table temp_table
add last_name varchar(20)

select * from temp_table

select last_name from temp_table

update temp_table
--set last_name='pradeesh'
--where name='vijay'
--set last_name ='durga'
--where name='abhishek'
set last_name='kumar'
where name='santhosh'

select * from temp_table

create function fullname(@name varchar(20),@last_name varchar(20))
returns varchar(50)
as 
begin
		declare @f_name varchar(50)
		set @f_name=concat(@name,' ',@last_name)
		return @f_name

end

declare @f_name varchar(40)
set @f_name=[sqlAssessments].dbo.fullname('vijay','pradeesh')
print @f_name

select sl_no,name,last_name,[date of birth],[sqlAssessments].[dbo].[calculate_age]([date of birth]) as age,[sqlAssessments].[dbo].fullname(name,last_name) as full_name
from temp_table



create function age_table(@age int)
returns table 
as 
	
		return 
		(select sl_no,name,last_name,  [sqlAssessments].dbo.fullname(name,last_name) as full_name
		from temp_table
		where [sqlAssessments].dbo.calculate_age([date of birth])> @age)

		--inline table valued function

		select * from [sqlAssessments].dbo.age_table(20) 
	