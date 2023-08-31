alter trigger tr_update
on temp_table
for insert
as 
begin
	declare @name varchar(30)
	select @name=name from inserted
	print 'a new record is inserted ith name: '+@name 

end

insert into temp_table
values ('6','vijay','01/03/1998','raja')

select * from temp_table

delete temp_table
where sl_no=6

alter trigger tr_delete
on temp_table
for delete 
as 
begin
	declare @name varchar(30)
	select @name=name from deleted
	print ' record with name: '+@name + ' is deleted successfylly'
end

insert into temp_table
values(6,'vijay','03/02/1998','shree')

begin transaction
delete temp_table
where sl_no=6
go

rollback transaction 
go

select * from temp_table

alter trigger tr_insert_update
on temp_table
for update
as
begin
	declare @last_name_1 varchar(30)
	declare @last_name_2 varchar(30)
	select @last_name_1 = last_name from deleted
	select @last_name_2=last_name from inserted
	
	--select * from inserted
	--select * from deleted
	--print 'updated successfully'
	print 'the last name is updated from '+@last_name_1+' to '+@last_name_2
end

update temp_table 
set last_name='raj'
where sl_no=4

select * from temp_table
	

	



