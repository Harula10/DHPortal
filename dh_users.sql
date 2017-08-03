-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Φιλοξενητής: 127.0.0.1
-- Χρόνος δημιουργίας: 03 Αυγ 2017 στις 20:30:20
-- Έκδοση διακομιστή: 5.6.26-log
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
('user1', 'user3'),
('user5', 'user2'),
('user2', 'user5');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `users`
--

CREATE TABLE `users` (
  `username` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `rights` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Άδειασμα δεδομένων του πίνακα `users`
--

INSERT INTO `users` (`username`, `email`, `password`, `rights`) VALUES
('user1', 'user1@live.com', 'user1', 0),
('user2', 'user2@gmail.com', 'user2', 1),
('user3', 'user3@live.com', 'user3', 0),
('user4', 'user4@live.com', 'user4', 0),
('user5', 'user5@live.com', 'user5', 0);

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
