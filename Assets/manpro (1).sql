-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 13, 2023 at 02:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `manpro`
--

-- --------------------------------------------------------

--
-- Table structure for table `marketing_campaign`
--

CREATE TABLE `marketing_campaign` (
  `ID` int(11) NOT NULL,
  `Year_Birth` int(11) DEFAULT NULL,
  `Education` varchar(255) DEFAULT NULL,
  `Marital_Status` varchar(255) DEFAULT NULL,
  `Income` int(11) DEFAULT NULL,
  `Kidhome` int(11) DEFAULT NULL,
  `Teenhome` int(11) DEFAULT NULL,
  `Dt_Customer` date DEFAULT NULL,
  `Recency` int(11) DEFAULT NULL,
  `MntWines` int(11) DEFAULT NULL,
  `MntFruits` int(11) DEFAULT NULL,
  `MntMeatProducts` int(11) DEFAULT NULL,
  `MntFishProducts` int(11) DEFAULT NULL,
  `MntSweetProducts` int(11) DEFAULT NULL,
  `MntGoldProds` int(11) DEFAULT NULL,
  `NumDealsPurchases` int(11) DEFAULT NULL,
  `NumWebPurchases` int(11) DEFAULT NULL,
  `NumCatalogPurchases` int(11) DEFAULT NULL,
  `NumStorePurchases` int(11) DEFAULT NULL,
  `NumWebVisitsMonth` int(11) DEFAULT NULL,
  `AcceptedCmp1` int(11) DEFAULT NULL,
  `AcceptedCmp2` int(11) DEFAULT NULL,
  `AcceptedCmp3` int(11) DEFAULT NULL,
  `AcceptedCmp4` int(11) DEFAULT NULL,
  `AcceptedCmp5` int(11) DEFAULT NULL,
  `Complain` int(11) DEFAULT NULL,
  `Z_CostContact` int(11) DEFAULT NULL,
  `Z_Revenue` int(11) DEFAULT NULL,
  `Response` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `marketing_campaign`
--
ALTER TABLE `marketing_campaign`
  ADD PRIMARY KEY (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
