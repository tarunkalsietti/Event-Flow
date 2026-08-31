create extension if not exists "uuid-ossp";

CREATE TABLE IF NOT EXISTS users(
    id uuid primary key default uuid_generate_v4(),
    name varchar(100) not null,
    email varchar(255) unique not null,
    password_hash varchar(255) not null,
    created_at timestamp with time zone default current_timestamp
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS accounts (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references users(id) on delete cascade,
    name varchar(100) not null, --workspace name
    api_key_hash varchar(64) unique not null,
--token for thier shop server )every users can have multipele acounts 
-- and evey account will have thier own apikey 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions(
    id uuid primary key uuid_generate_v4(),
    user_id uuid not null references on users(id),
    account_id uuid not null references on accounts(id)
    on delete cascade,
    event_type varchar(100) not null,
    endpoint_url text not null,
    Hmac_secret varchar(100) not null,
    active boolean default true not null
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)

create index if not exists idx_sub_acc_event on subscriptions(account_id,event_type)