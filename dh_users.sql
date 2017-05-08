-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Φιλοξενητής: 127.0.0.1
-- Χρόνος δημιουργίας: 08 Μάη 2017 στις 15:09:22
-- Έκδοση διακομιστή: 10.1.13-MariaDB
-- Έκδοση PHP: 7.0.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `dh_users`
--

CREATE DATABASE IF NOT EXISTS `dh_users` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `dh_users`;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `friendships`
--

CREATE TABLE `friendships` (
  `from_user` varchar(15) NOT NULL,
  `to_user` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Άδειασμα δεδομένων του πίνακα `friendships`
--

INSERT INTO `friendships` (`from_user`, `to_user`) VALUES
('user2', 'user1'),
('user3', 'user2'),
('user1', 'user2'),
('user1', 'user4'),
('user4', 'user1'),
('user3', 'user1'),
('user1', 'user3');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `users`
--

CREATE TABLE `users` (
  `username` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Άδειασμα δεδομένων του πίνακα `users`
--

INSERT INTO `users` (`username`, `email`, `password`) VALUES
('user1', 'user1@live.com', 'user1'),
('user2', 'user2@gmail.com', 'user2'),
('user3', 'user3@live.com', 'user3'),
('user4', 'user4@live.com', 'user4'),
('user5', 'user5@live.com', 'user5'),
('user6', 'user6@live.com', 'user6');

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
