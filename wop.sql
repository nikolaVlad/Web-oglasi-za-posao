-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 25, 2021 at 11:39 PM
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
(39, 'Web dev', '', NULL),
(40, 'Mobile dev', '', NULL),
(41, 'Softver dev', '', NULL),
(42, 'Web dizajn', '', NULL),
(43, 'Administriranje', '', NULL),
(44, 'Analiza podataka', '', NULL),
(46, 'Hardver', '', NULL),
(47, 'Menadžement', '', NULL),
(48, 'Sajber bezbednost', '', NULL),
(49, 'Softversko inženjerstvo', '', NULL),
(50, 'IT podrška', '', NULL),
(51, 'Arhitektura', '', NULL);

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
(101, 'admin', 'admin', 'admin@mail.com', '$2b$04$srCbTuSH2QzSstmA7ANupuHwWEtcRlqFIhuIUwH.812UT3D3it0Va', '1610642109010admin.jpg', 0, 0, 'admin'),
(112, 'Andrej', 'Jovanovic', 'andrej@mail.com', '$2b$04$BbIwMf.EliW.4CP6n3voM.R5RIE6bQ/ugPgv2l6AQLS7lORe75.6m', '1610066837257Pr (5).jpg', 2, 0, 'korisnik'),
(113, 'Marija', 'Jovkovic', 'marija@mail.com', '$2b$04$ASZBfXnWSxWh/xJE2lGWCuSOX1YT34ai.p3Y8SlxZCqXLoGxJ8nTO', '1610066875341Pr (2).jpg', 2, 0, 'korisnik'),
(115, 'Igor', 'Pekić', 'igor@mail.com', '$2b$04$HDcFhXSRlmnrp/t7SXHlOeN8TYEvMg/.GeL7w3YySe6D/7jp1cdFi', '1610066967525Pr (2).png', 0, 5, 'korisnik'),
(116, 'Miloš', 'Milutinović', 'milos@mail.com', '$2b$04$K49WqkyNrbrAicaMu/cT7uapbpwsPl3b0/JTcjmVQ8H.dBYeUgmW.', '1610067000115Pr (3).jpg', 3, 4, 'korisnik'),
(117, 'Milan', 'Mitić', 'milan@mail.com', '$2b$04$FqFpYXExz19U4yLcumg8ju4RyBecnZ.t4gThnDD7dYI5HVjyqhvqq', '1610067045571Pr (1).png', 10, 2, 'korisnik'),
(119, 'Majkić', 'Photos ', 'majkic@mail.com', '$2b$04$C15HsOA0ZwpWU8NNJErlYe6k7XRjDyvVoYgoam59Hy99XVOoZ2DTW', '1610067594356Pr (4).jpg', 1, 1, 'korisnik'),
(120, 'Tijana', 'Janjic', 'tijana@mail.com', '$2b$04$bXBivLOXzPuTYrtRGPO42uUoRSMCHr0dWxBg.gS8DK/LrIcSeGd7i', '1610210320787Pr (4).jpg', 2, 1, 'korisnik'),
(121, 'Novak', 'Novković', 'novak@mail.com', '$2b$04$WV9JbpLhBRN0eae3vH68c.Qfn3Q2kWHYLN2cDZwC5/TDtxruuhJAq', '', 1, 0, 'korisnik');

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
(111, 'Junior Web Dizajner', 'U potražnji smo za web dizajnera za kreiranje ikonica za web aplikacije.', 'Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! ', ' Adobe Photoshop, Adobe Illustrator, CSS', 'Rad sa ostalim Adobe programima', '2021-01-09 16:53:09', 42, 119, 5),
(113, 'Održavanje baze podataka za sajt', 'Potreban čovek koji može da održava (CRUD) bazu podataka za sajt prodavnice. Potrebno 2 ili više godina iskustva.', 'Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! ', 'MySql, MariaDb, phpMyAdmin, MS Access', 'Rad sa multi-query-ima.', '2021-01-09 17:05:17', 43, 115, 2),
(114, 'Kalkulator za složene mat. operacije', 'Potreban radnik za sklapanje hardverskih delova za kalkulatore.', 'Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! ', 'Sklapanje hardvera', '', '2021-01-09 17:08:51', 46, 115, 1),
(115, 'Testiranje sajtova', 'Potrebni testeri za testiranje bezbednosti sajtova. Iskustvo obavezno.  ', 'Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! ', 'Php, nodejs, NESSUS, Linux, MySql', 'Poznavanje arhitekture operativnog sistema, poznavanje mreža.', '2021-01-09 17:13:43', 48, 115, 0),
(116, 'Kreiranje mini operativnih sistema', 'Kreiranje mini operativnih sistema radi edukacije i vežbanja.', 'Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! ', 'c, c++', 'Tehnike OOP programiranje', '2021-01-09 17:15:23', 51, 115, 1),
(117, 'Izrada MS widnows aplikacija', 'Potrebni senior softver dev, za izradu složenih MS windows aplikacija. ', 'Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! ', 'c#, OOP, .net Core', '.net framework', '2021-01-09 17:17:39', 41, 115, 3),
(118, 'Pronalazak ranjivosti mreže', 'Potrebni sistem administratori za testiranje i pronalaska ranjivosti mreže. Glavni alat NESSUS.', 'Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! \r\n\r\nHong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! ', 'Nessus, SiteLock, Tines', 'Log360', '2021-01-09 17:20:20', 43, 116, 1),
(119, 'Izrada statičkih sajtova ', 'Potreban senior web dev za izrade statičkih sajtova. ', 'Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! \r\nHong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! ', 'htmls, css, sass', 'javaScript', '2021-01-09 17:21:52', 39, 116, 2),
(120, 'Otkrivanje obrazaca u veliki skupovima podataka', 'Potrebni programeri za rad sa velikim skupovima podataka.', 'Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! \r\nHong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! ', 'AI, statistika, Python', 'Rudarenje podataka', '2021-01-09 17:24:33', 44, 116, 1),
(121, 'Kreiranje logIn formi', 'Potrebni php developeri za kreiranje i testiranje logIn formi u php programskom jeziku.', 'Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! \r\n\r\nHong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! \r\nHong Kong Phooey, number one super guy. ', 'php, mySql, mariaDb', 'Java programiranje, server side tehnologije.', '2021-01-09 17:26:29', 39, 116, 1),
(122, 'Seo optimizacija', 'Full seo optimizacija sajtova.', 'Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! \r\nHong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! ', 'wordpress', 'php', '2021-01-09 17:31:26', 39, 117, 0),
(123, 'Optimizacija android aplikacija', 'Full optimizacija android aplikacija.', 'Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! \r\nHong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! ', 'Android, Java', 'Android studio', '2021-01-21 17:07:29', 40, 117, 3),
(124, 'Dizajn ikocina za PC', 'Potrebni pomoćnici za kreitranje i dizajniranje ikocina za desktop računare.\r\n', 'Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! \r\nHong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’t stop. When the going gets tough, he’s really rough, with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong Phooey, he’s fan-riffic! ', 'photoshop, illustrator', '', '2021-01-09 17:42:03', 42, 120, 1);

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
(91, 116, 113, '2021-01-09', 'na cekanju'),
(92, 116, 117, '2021-01-09', 'na cekanju'),
(93, 116, 111, '2021-01-09', 'na cekanju'),
(108, 113, 111, '2021-01-09', 'na cekanju'),
(109, 113, 117, '2021-01-09', 'na cekanju'),
(110, 120, 111, '2021-01-09', 'na cekanju'),
(113, 120, 123, '2021-01-21', 'odbijen'),
(114, 121, 119, '2021-01-09', 'na cekanju'),
(115, 112, 111, '2021-01-20', 'prihvaćen'),
(123, 117, 119, '2021-01-20', 'na cekanju'),
(124, 117, 111, '2021-01-20', 'prihvaćen'),
(130, 117, 118, '2021-01-20', 'na cekanju'),
(131, 117, 120, '2021-01-20', 'na cekanju'),
(132, 117, 121, '2021-01-20', 'na cekanju'),
(133, 117, 124, '2021-01-20', 'na cekanju'),
(134, 117, 117, '2021-01-21', 'odbijen'),
(135, 117, 113, '2021-01-21', 'na cekanju'),
(136, 117, 114, '2021-01-21', 'na cekanju'),
(137, 117, 116, '2021-01-21', 'odbijen'),
(138, 112, 123, '2021-01-21', 'prihvaćen'),
(139, 119, 123, '2021-01-21', 'na cekanju');

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kategorije`
--
ALTER TABLE `kategorije`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `korisnici`
--
ALTER TABLE `korisnici`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `poslovi`
--
ALTER TABLE `poslovi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- AUTO_INCREMENT for table `prijave`
--
ALTER TABLE `prijave`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
