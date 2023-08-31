sp_help [User_details];

alter table User_details
add constraint fk_users_details Foreign key (user_name)
references dbo.Users(user_name)
on delete cascade
on update cascade;

alter table train_data
add constraint fk_date	foreign key (date_id)
references [dbo].[date_data_master](date_id)
on update cascade
on delete cascade;


alter table seat_details
add constraint fk_train_id foreign key (train_id)
references train_data (train_id)

sp_help route_master;

alter table train_route_map
add constraint fk_train_id_fk foreign key (route_id)
references train_data (train_id)


alter table route_master
add constraint fk_price_id foreign key (price_id)
references [dbo].[ticket_price_master] (price_id)

alter table ticket
add constraint fk_user_id_ticket foreign key (user_id)
references user_details (user_id)

alter table ticket
add constraint fk_train_id_ticket foreign key (train_id)
references train_data (train_id)
sp_help ticket;

sp_help ticket_cancel;


alter table cancel_ticket
add constraint fk_ticket_id_cancel foreign key (ticket_id)
references ticket (ticket_id)

alter table cancel_ticket
add constraint fk_user_id_cancel foreign key (user_id)
references user_details (user_id)

sp_help cancel_ticket;

