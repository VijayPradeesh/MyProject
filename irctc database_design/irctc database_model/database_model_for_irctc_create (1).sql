-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2020-12-13 18:04:50.675

-- tables
-- Table: Seat_details
CREATE TABLE Seat_details (
    train_data_Train_id int  NOT NULL,
    fst_Class_nos int  NOT NULL,
    Snd_class_nos int  NOT NULL,
    gn_nos int  NOT NULL,
    date date  NOT NULL,
    CONSTRAINT Seat_details_pk PRIMARY KEY  (train_data_Train_id,date)
);

-- Table: Users_detail
CREATE TABLE Users_detail (
    user_id int  NOT NULL,
    Users_table_user_name varchar(30)  NOT NULL,
    firstname varchar(20)  NOT NULL,
    lastName varchar(20)  NOT NULL,
    address varchar(100)  NOT NULL,
    Aadhar_number int  NOT NULL,
    d_o_b date  NOT NULL,
    phone_number int  NOT NULL,
    email varchar(30)  NOT NULL,
    gender varchar(10)  NOT NULL,
    CONSTRAINT Users_detail_ak_1 UNIQUE (phone_number, Aadhar_number, email),
    CONSTRAINT Users_detail_pk PRIMARY KEY  (user_id)
);

-- Table: Users_table
CREATE TABLE Users_table (
    user_name varchar(30)  NOT NULL,
    password varchar(20)  NOT NULL,
    status varchar(30)  NOT NULL DEFAULT Inactive,
    activation_code varchar(20)  NOT NULL,
    CONSTRAINT Users_table_pk PRIMARY KEY  (user_name)
);

-- Table: cancel_ticket
CREATE TABLE cancel_ticket (
    cancellation_id int  NOT NULL,
    ticket_ticket_id int  NOT NULL,
    Users_detail_user_id int  NOT NULL,
    refund int  NOT NULL DEFAULT pending,
    CONSTRAINT cancel_ticket_pk PRIMARY KEY  (cancellation_id)
);

-- Table: date_data
CREATE TABLE date_data (
    date_id int  NOT NULL,
    sunday binary(1)  NOT NULL,
    monday binary(1)  NOT NULL,
    tuesday binary(1)  NOT NULL,
    wednesday binary(1)  NOT NULL,
    thursday binary(1)  NOT NULL,
    friday binary(1)  NOT NULL,
    saturday binary(1)  NOT NULL,
    CONSTRAINT date_data_pk PRIMARY KEY  (date_id)
);

-- Table: fact_booking
CREATE TABLE fact_booking (
    Booking_id int  NOT NULL,
    train_data_Train_id int  NOT NULL,
    Users_detail_user_id int  NOT NULL,
    route_master_route_id varchar(15)  NOT NULL,
    origin varchar(30)  NOT NULL,
    destination varchar(30)  NOT NULL,
    class varchar(30)  NOT NULL,
    date date  NOT NULL,
    Price money  NOT NULL,
    seats int  NOT NULL,
    CONSTRAINT fact_booking_pk PRIMARY KEY  (Booking_id)
);

-- Table: fact_cancellation
CREATE TABLE fact_cancellation (
    Ticket_cancel_id int  NOT NULL,
    train_data_Train_id int  NOT NULL,
    Users_detail_user_id int  NOT NULL,
    route_master_route_id varchar(15)  NOT NULL,
    date date  NOT NULL,
    origin varchar(20)  NOT NULL,
    destination varchar(20)  NOT NULL,
    Seats int  NOT NULL,
    Price money  NOT NULL,
    class varchar(30)  NOT NULL,
    CONSTRAINT fact_cancellation_pk PRIMARY KEY  (Ticket_cancel_id)
);

-- Table: route_master
CREATE TABLE route_master (
    route_id varchar(15)  NOT NULL,
    origin varchar(20)  NOT NULL,
    destination varchar(20)  NOT NULL,
    ticket_price_Price_id int  NOT NULL,
    CONSTRAINT route_master_pk PRIMARY KEY  (route_id)
);

-- Table: route_train_map
CREATE TABLE route_train_map (
    route_master_route_id varchar(15)  NOT NULL,
    arrival_time time  NOT NULL,
    departure_time time  NOT NULL,
    train_data_Train_id int  NOT NULL,
    CONSTRAINT route_train_map_pk PRIMARY KEY  (route_master_route_id,train_data_Train_id)
);

-- Table: ticket
CREATE TABLE ticket (
    ticket_id int  NOT NULL,
    date date  NOT NULL,
    Seats int  NOT NULL,
    Users_detail_user_id int  NOT NULL,
    train_data_Train_id int  NOT NULL,
    Price int  NOT NULL,
    CONSTRAINT ticket_pk PRIMARY KEY  (ticket_id)
);

-- Table: ticket_price
CREATE TABLE ticket_price (
    Price_id int  NOT NULL,
    fare_gn money  NOT NULL,
    fare_1 money  NOT NULL,
    fare_2 money  NOT NULL,
    CONSTRAINT ticket_price_pk PRIMARY KEY  (Price_id)
);

-- Table: train_data
CREATE TABLE train_data (
    Train_id int  NOT NULL,
    name varchar(30)  NOT NULL,
    status varchar(20)  NOT NULL,
    origin varchar(30)  NOT NULL,
    destination varchar(30)  NOT NULL,
    date_data_date_id int  NOT NULL,
    CONSTRAINT train_data_pk PRIMARY KEY  (Train_id)
);

-- foreign keys
-- Reference: Seat_details_train_data (table: Seat_details)
ALTER TABLE Seat_details ADD CONSTRAINT Seat_details_train_data
    FOREIGN KEY (train_data_Train_id)
    REFERENCES train_data (Train_id);

-- Reference: Users_detail_Users_table (table: Users_detail)
ALTER TABLE Users_detail ADD CONSTRAINT Users_detail_Users_table
    FOREIGN KEY (Users_table_user_name)
    REFERENCES Users_table (user_name);

-- Reference: cancel_ticket_Users_detail (table: cancel_ticket)
ALTER TABLE cancel_ticket ADD CONSTRAINT cancel_ticket_Users_detail
    FOREIGN KEY (Users_detail_user_id)
    REFERENCES Users_detail (user_id);

-- Reference: cancel_ticket_ticket (table: cancel_ticket)
ALTER TABLE cancel_ticket ADD CONSTRAINT cancel_ticket_ticket
    FOREIGN KEY (ticket_ticket_id)
    REFERENCES ticket (ticket_id);

-- Reference: fact_booking_Users_detail (table: fact_booking)
ALTER TABLE fact_booking ADD CONSTRAINT fact_booking_Users_detail
    FOREIGN KEY (Users_detail_user_id)
    REFERENCES Users_detail (user_id);

-- Reference: fact_booking_route_master (table: fact_booking)
ALTER TABLE fact_booking ADD CONSTRAINT fact_booking_route_master
    FOREIGN KEY (route_master_route_id)
    REFERENCES route_master (route_id);

-- Reference: fact_booking_train_data (table: fact_booking)
ALTER TABLE fact_booking ADD CONSTRAINT fact_booking_train_data
    FOREIGN KEY (train_data_Train_id)
    REFERENCES train_data (Train_id);

-- Reference: fact_cancellation_Users_detail (table: fact_cancellation)
ALTER TABLE fact_cancellation ADD CONSTRAINT fact_cancellation_Users_detail
    FOREIGN KEY (Users_detail_user_id)
    REFERENCES Users_detail (user_id);

-- Reference: fact_cancellation_route_master (table: fact_cancellation)
ALTER TABLE fact_cancellation ADD CONSTRAINT fact_cancellation_route_master
    FOREIGN KEY (route_master_route_id)
    REFERENCES route_master (route_id);

-- Reference: fact_cancellation_train_data (table: fact_cancellation)
ALTER TABLE fact_cancellation ADD CONSTRAINT fact_cancellation_train_data
    FOREIGN KEY (train_data_Train_id)
    REFERENCES train_data (Train_id);

-- Reference: route_master_ticket_price (table: route_master)
ALTER TABLE route_master ADD CONSTRAINT route_master_ticket_price
    FOREIGN KEY (ticket_price_Price_id)
    REFERENCES ticket_price (Price_id);

-- Reference: route_train_map_route_info (table: route_train_map)
ALTER TABLE route_train_map ADD CONSTRAINT route_train_map_route_info
    FOREIGN KEY (route_master_route_id)
    REFERENCES route_master (route_id);

-- Reference: route_train_map_train_data (table: route_train_map)
ALTER TABLE route_train_map ADD CONSTRAINT route_train_map_train_data
    FOREIGN KEY (train_data_Train_id)
    REFERENCES train_data (Train_id);

-- Reference: ticket_Users_detail (table: ticket)
ALTER TABLE ticket ADD CONSTRAINT ticket_Users_detail
    FOREIGN KEY (Users_detail_user_id)
    REFERENCES Users_detail (user_id);

-- Reference: ticket_train_data (table: ticket)
ALTER TABLE ticket ADD CONSTRAINT ticket_train_data
    FOREIGN KEY (train_data_Train_id)
    REFERENCES train_data (Train_id);

-- Reference: train_data_date_data (table: train_data)
ALTER TABLE train_data ADD CONSTRAINT train_data_date_data
    FOREIGN KEY (date_data_date_id)
    REFERENCES date_data (date_id);

-- End of file.

