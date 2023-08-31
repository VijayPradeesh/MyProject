sp_help [fact_booking];
alter table [dbo].[fact_booking]
add constraint fk_route_id_fact_bking foreign key (route_id)
references [dbo].[route_master] (route_id)

sp_help fact_cancel;

alter table fact_cancel
add constraint fk_train_id_cancell foreign key (train_id)
references [dbo].[Train_data] (train_id)

alter table fact_cancel
add constraint fk_user_id_cancell foreign key(user_id)
references [dbo].[User_details] (user_id)

alter table fact_cancel
add constraint fk_route_id_cancell foreign key (route_id)
references [dbo].[route_master] (route_id)

