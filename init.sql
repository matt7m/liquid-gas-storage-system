-- Init database tables --

-- Gas types of density --
CREATE TABLE gas_types(
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL UNIQUE,
    density FLOAT NOT NULL
);

-- Gas depot list --
CREATE TABLE gas_depots(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    capacity BIGINT NOT NULL,
    current_status BIGINT NOT NULL,
    gas_type_id INT REFERENCES gas_types(id)
);

-- Gas tanks/trucks list --
CREATE TABLE gas_tanks(
    id SERIAL PRIMARY KEY,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    capacity BIGINT NOT NULL
);

-- Main table to manage import/export documents --
CREATE TABLE gas_managements(
    id SERIAL PRIMARY KEY,
    arc_code VARCHAR(12) NOT NULL UNIQUE,
    date DATE NOT NULL,
    operation VARCHAR(12) NOT NULL,
    tank_id INT NOT NULL REFERENCES gas_tanks(id),
    depot_id INT NOT NULL REFERENCES gas_depots(id),
    amount BIGINT NOT NULL,
    op_description VARCHAR(150),
    CONSTRAINT chk_operation CHECK (
        operation IN ('import', 'export_eAD', 'export_eDD', 'export_WZ', 'export_ORLEN')
    ),
    CONSTRAINT chk_arc_code CHECK (LENGTH(arc_code) >= 10)
);

-- Data for user authorization --
-- CREATE TABLE worker(
--     id SERIAL PRIMARY KEY,
--     first_name VARCHAR(50) NOT NULL,
--     last_name VARCHAR(50) NOT NULL,
--     email VARCHAR(150) UNIQUE NOT NULL,
--     username VARCHAR(50) UNIQUE NOT NULL,
--     password VARCHAR(50) NOT NULL
-- );

-- CREATE TABLE position (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(50) NOT NULL UNIQUE
-- );

-- CREATE TABLE worker_position(
--     worker_id INT REFERENCES worker(id) ON UPDATE CASCADE ON DELETE CASCADE,
--     position_id INT REFERENCES position(id) ON UPDATE CASCADE,
--     CONSTRAINT worker_position_pkey PRIMARY KEY (worker_id, position_id)
-- );


-- Insert permanent data to db --

INSERT INTO gas_types(id, type, density)
VALUES 
(1, 'PROPAN', 0.495),
(2, 'MIX 80', 0.520),
(3, 'MIX 60', 0.535),
(4, 'MIX 50', 0.545),
(5, 'BUTLOWKA', 0.560);

INSERT INTO gas_depots(id, name, capacity, current_status, gas_type_id)
VALUES 
(1, 'Tank 1', 22000, 21000, 2),
(2, 'Tank 2', 22000, 5000, 2),
(3, 'Tank 3', 85000, 45000, 3),
(4, 'Tank 4', 85000, 85000, 4),
(5, 'Railway tank', 22500, 20000, 1),
(6, 'Container tank 1', 22500, 20000, 5),
(7, 'Container tank 2', 22500, 20000, 5),
(8, 'Reserve tank', 10000, 0, 3);

INSERT INTO gas_tanks(id, license_number, capacity)
VALUES 
(1, 'WSZ 4517H', 21500),
(2, 'WSZ 4518H', 21000),
(3, 'WSZ 4519H', 21000),
(4, 'WSZ 80SK', 22500),
(5, 'WR 456FS', 21500),
(6, 'WSZ 79XE', 22500),
(7, 'WSZ 1A36', 11000),
(8, 'WSZ 27AJ', 8000),
(9, 'OTHER TRANSPORT', 25000);

INSERT INTO gas_managements(id, arc_code, date, operation, tank_id, depot_id, amount, op_description)
VALUES
(1, '24PL06001210', '2024-08-17', 'import', 2, 3, 19700, 'TRANSGAZ'),
(2, '24PL08111002', '2024-08-20', 'import', 1, 3, 20100, 'PHUB TRASA'),
(3, '25PL000120', '2025-01-05', 'export_eDD', 9, 1, 10240, 'export centrum gaz'),
(4, '25PL00120259', '2025-01-06', 'export_eAD', 2, 6, 8100, 'zaladunek na kielgaz 8t'),
(5, '017/25/LPG', '2025-01-11', 'export_WZ', 3, 3, 19980, 'wz- stacje'),
(6, '019/25/LPG', '2025-01-11', 'export_WZ', 9, 3, 20200, 'wz- kajca'),
(7, '25PL06000091', '2025-01-17', 'import', 3, 3, 19720, 'GLOB-TERMINAL braniewo');