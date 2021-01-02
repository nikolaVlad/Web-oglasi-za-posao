-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 02, 2021 at 01:55 AM
-- Server version: 8.0.22
-- PHP Version: 7.3.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wop`
--

-- --------------------------------------------------------

--
-- Table structure for table `kategorije`
--

CREATE TABLE `kategorije` (
  `id` int NOT NULL,
  `naziv` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `kratak_opis` text,
  `slika` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `kategorije`
--

INSERT INTO `kategorije` (`id`, `naziv`, `kratak_opis`, `slika`) VALUES
(17, 'k1', '', NULL),
(18, 'kategorija 2', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `korisnici`
--

CREATE TABLE `korisnici` (
  `id` int NOT NULL,
  `ime` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `prezime` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `lozinka` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `slika` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `br_prijavljenih` int DEFAULT NULL COMMENT 'Upisuje se broj poslova na koliko se je korisnik prijavio. Pocetna vrednost je 0. Vrednost se dobija iz tabele "prijave".',
  `br_postavljenih` int DEFAULT NULL COMMENT 'Upisuje se broj oglasa za posao koliko je dati korisnik postavio. Pocetna vrednost je 0. Vrednost se dobija iz tabele "poslovi".',
  `rola` varchar(40) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `korisnici`
--

INSERT INTO `korisnici` (`id`, `ime`, `prezime`, `email`, `lozinka`, `slika`, `br_prijavljenih`, `br_postavljenih`, `rola`) VALUES
(34, 'admin', 'admin', 'admin@mail.com', '$2b$04$BNIF1LbFBGVHMEm0/OKbkumRIIaoclSObiykbqE4td1W682nw6KZi', '', 0, 0, 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `poslovi`
--

CREATE TABLE `poslovi` (
  `id` int NOT NULL,
  `naziv` varchar(100) NOT NULL,
  `kratak_opis` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `pun_opis` text NOT NULL,
  `potrebne_vestine` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'Opis onih tehnologija i vestina koje se podrazumaeva da kandidat poseduje.',
  `pozeljne_vestine` text CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT 'Vestine koje nisu neophodne, ali je pozeljno posedovati ih.',
  `datum` datetime NOT NULL,
  `kategorija_id` int NOT NULL COMMENT 'Predstavlja kategoriju u kojoj pripada ovaj posao.',
  `korisnik_id` int DEFAULT NULL COMMENT 'Predstavlja onog korisnika koji je postavio ovaj oglas za posao.',
  `br_prijava` int DEFAULT NULL COMMENT 'Predstavlja broj kandidata koji su se prijavili za ovaj posao. Podatak se vuce iz tabele "prijave".'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `poslovi`
--

INSERT INTO `poslovi` (`id`, `naziv`, `kratak_opis`, `pun_opis`, `potrebne_vestine`, `pozeljne_vestine`, `datum`, `kategorija_id`, `korisnik_id`, `br_prijava`) VALUES
(52, 'admin poslao', 'posaloa admina', 'admin posao', 'admin oisai', 'oisai admin\r\n', '2020-12-30 15:14:23', 17, 34, 0);

-- --------------------------------------------------------

--
-- Table structure for table `prijave`
--

CREATE TABLE `prijave` (
  `id` int NOT NULL,
  `korisnik_id` int NOT NULL,
  `posao_id` int NOT NULL,
  `datum` date NOT NULL,
  `status` varchar(25) NOT NULL DEFAULT 'na_cekanju' COMMENT 'Ovo polje predstavlja povratnu informaciju kandidatu koji se prijavio za odredjeni posao. Moze biti : prihvatio, na_cekanju ili odbio.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Vezu izmedju tabela : "korisnici" i "poslovi"';

--
-- Dumping data for table `prijave`
--

INSERT INTO `prijave` (`id`, `korisnik_id`, `posao_id`, `datum`, `status`) VALUES
(27, 34, 53, '2021-01-01', 'odbijen'),
(31, 35, 52, '2021-01-01', 'prihvaćen');

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE `test` (
  `ime` varchar(11) COLLATE utf8mb4_general_ci NOT NULL,
  `prezime` varchar(11) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `test`
--

INSERT INTO `test` (`ime`, `prezime`) VALUES
('Jovan', 'Markovi'),
('Jovan', 'Markovi'),
('Ilija', 'Ivkovi'),
('Ana', 'Cajic'),
('Ilija', 'Ivkovi'),
('Ana', 'Cajic'),
('Ratko', 'Ratkovic');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kategorije`
--
ALTER TABLE `kategorije`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `korisnici`
--
ALTER TABLE `korisnici`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `poslovi`
--
ALTER TABLE `poslovi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prijave`
--
ALTER TABLE `prijave`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `test`
--
ALTER TABLE `test` ADD FULLTEXT KEY `SEARCH` (`ime`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kategorije`
--
ALTER TABLE `kategorije`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `korisnici`
--
ALTER TABLE `korisnici`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `poslovi`
--
ALTER TABLE `poslovi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `prijave`
--
ALTER TABLE `prijave`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
