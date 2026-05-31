CREATE DATABASE IF NOT EXISTS wad_restaurant;
USE wad_restaurant;

-- ============================================================
-- Users (customer / shipper — admin stays env-password based)
-- ============================================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer'
);

-- ============================================================
-- Foods
-- ============================================================
CREATE TABLE foods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT NULL,
  image VARCHAR(500) NULL,
  category VARCHAR(100) NULL
);

-- ============================================================
-- Cart Items
-- ============================================================
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  food_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,

  CONSTRAINT fk_cart_items_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_cart_items_food
    FOREIGN KEY (food_id)
    REFERENCES foods(id)
    ON DELETE CASCADE
);

-- ============================================================
-- Bookings
-- ============================================================
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(10) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  people INT NOT NULL DEFAULT 1,
  `tables` INT NOT NULL DEFAULT 1,
  note TEXT NULL,

  CONSTRAINT fk_bookings_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);

-- ============================================================
-- Bill Status (orders)
-- ============================================================
CREATE TABLE bill_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  shipper_id INT NULL,
  status ENUM(
    'cancelled',
    'pending',
    'confirmed',
    'preparing',
    'checking',
    'delivering',
    'delivered',
    'completed',
    'paid'
  ) NOT NULL DEFAULT 'confirmed',
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  phone VARCHAR(20) NOT NULL DEFAULT '',
  address TEXT NULL,
  payment_method VARCHAR(20) NOT NULL DEFAULT 'cash',
  paid TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_bill_status_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_bill_status_shipper
    FOREIGN KEY (shipper_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);

-- ============================================================
-- Bill Details (order line items)
-- ============================================================
CREATE TABLE bill_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bill_status_id INT NOT NULL,
  food_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,

  CONSTRAINT fk_bill_details_bill_status
    FOREIGN KEY (bill_status_id)
    REFERENCES bill_status(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_bill_details_food
    FOREIGN KEY (food_id)
    REFERENCES foods(id)
    ON DELETE CASCADE
);
