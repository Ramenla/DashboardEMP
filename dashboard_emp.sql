-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 27, 2026 at 05:36 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dashboard_emp`
--

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `position` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `issues`
--

CREATE TABLE `issues` (
  `id` varchar(50) NOT NULL,
  `projectId` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `severity` enum('HIGH','MEDIUM','LOW') DEFAULT 'MEDIUM',
  `status` enum('OPEN','IN_PROGRESS','CLOSED') DEFAULT 'OPEN',
  `impactScore` int(11) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `issues`
--

INSERT INTO `issues` (`id`, `projectId`, `title`, `severity`, `status`, `impactScore`, `created_at`) VALUES
('iss-EMP-DRI-009-0', 'EMP-DRI-009', 'Investigasi insiden keselamatan diperlukan', 'HIGH', 'OPEN', 2, '2026-02-20 09:55:48'),
('iss-EMP-DRI-011-0', 'EMP-DRI-011', 'Keterlambatan persetujuan izin dari pemerintah daerah', 'HIGH', 'OPEN', 2, '2026-02-20 09:55:48'),
('iss-EMP-DRI-016-0', 'EMP-DRI-016', 'Keterlambatan persetujuan izin dari pemerintah daerah', 'HIGH', 'OPEN', 2, '2026-02-20 09:55:48'),
('iss-EMP-DRI-016-1', 'EMP-DRI-016', 'Investigasi insiden keselamatan diperlukan', 'HIGH', 'OPEN', 3, '2026-02-20 09:55:48'),
('iss-EMP-DRI-026-0', 'EMP-DRI-026', 'Kerusakan peralatan saat operasi', 'HIGH', 'OPEN', 2, '2026-02-20 09:55:48'),
('iss-EMP-EXP-022-0', 'EMP-EXP-022', 'Cuaca buruk menghentikan aktivitas offshore', 'HIGH', 'OPEN', 4, '2026-02-20 09:55:48'),
('iss-EMP-EXP-028-0', 'EMP-EXP-028', 'Kerusakan peralatan saat operasi', 'HIGH', 'OPEN', 1, '2026-02-20 09:55:48'),
('iss-EMP-EXP-028-1', 'EMP-EXP-028', 'Gangguan rantai pasok untuk suku cadang kritis', 'HIGH', 'OPEN', 5, '2026-02-20 09:55:48'),
('iss-EMP-FAC-007-0', 'EMP-FAC-007', 'Investigasi insiden keselamatan diperlukan', 'HIGH', 'OPEN', 4, '2026-02-20 09:55:48'),
('iss-EMP-FAC-027-0', 'EMP-FAC-027', 'Sengketa pembebasan lahan dengan masyarakat lokal', 'HIGH', 'OPEN', 1, '2026-02-20 09:55:48'),
('iss-EMP-FAC-032-0', 'EMP-FAC-032', 'Keterlambatan persetujuan izin dari pemerintah daerah', 'HIGH', 'OPEN', 1, '2026-02-20 09:55:48'),
('iss-EMP-FAC-032-1', 'EMP-FAC-032', 'Temuan geologis tak terduga memerlukan revisi rencana', 'HIGH', 'OPEN', 5, '2026-02-20 09:55:48'),
('iss-EMP-FAC-034-0', 'EMP-FAC-034', 'Gangguan rantai pasok untuk suku cadang kritis', 'HIGH', 'OPEN', 2, '2026-02-20 09:55:48'),
('iss-EMP-FAC-035-0', 'EMP-FAC-035', 'Kerusakan peralatan saat operasi', 'HIGH', 'OPEN', 4, '2026-02-20 09:55:48'),
('iss-EMP-FAC-041-0', 'EMP-FAC-041', 'Kekurangan tenaga kerja kontraktor', 'HIGH', 'OPEN', 4, '2026-02-20 09:55:48'),
('iss-EMP-FAC-042-0', 'EMP-FAC-042', 'Sengketa pembebasan lahan dengan masyarakat lokal', 'HIGH', 'OPEN', 2, '2026-02-20 09:55:48'),
('iss-EMP-FAC-042-1', 'EMP-FAC-042', 'Kekurangan tenaga kerja kontraktor', 'HIGH', 'OPEN', 3, '2026-02-20 09:55:48'),
('iss-EMP-FAC-046-0', 'EMP-FAC-046', 'Investigasi insiden keselamatan diperlukan', 'HIGH', 'OPEN', 2, '2026-02-20 09:55:48'),
('iss-EMP-OPE-017-0', 'EMP-OPE-017', 'Gangguan rantai pasok untuk suku cadang kritis', 'HIGH', 'OPEN', 4, '2026-02-20 09:55:48'),
('iss-EMP-OPE-017-1', 'EMP-OPE-017', 'Cuaca buruk menghentikan aktivitas offshore', 'HIGH', 'OPEN', 1, '2026-02-20 09:55:48'),
('iss-EMP-OPE-021-0', 'EMP-OPE-021', 'Investigasi insiden keselamatan diperlukan', 'HIGH', 'OPEN', 3, '2026-02-20 09:55:48'),
('iss-EMP-OPE-036-0', 'EMP-OPE-036', 'Temuan geologis tak terduga memerlukan revisi rencana', 'HIGH', 'OPEN', 3, '2026-02-20 09:55:48'),
('iss-EMP-OPE-040-0', 'EMP-OPE-040', 'Cuaca buruk menghentikan aktivitas offshore', 'HIGH', 'OPEN', 1, '2026-02-20 09:55:48'),
('iss-EMP-OPE-040-1', 'EMP-OPE-040', 'Sengketa pembebasan lahan dengan masyarakat lokal', 'HIGH', 'OPEN', 2, '2026-02-20 09:55:48'),
('iss-EMP-OPE-048-0', 'EMP-OPE-048', 'Kekurangan tenaga kerja kontraktor', 'HIGH', 'OPEN', 3, '2026-02-20 09:55:48');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` varchar(50) NOT NULL,
  `projectCode` varchar(50) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `category` enum('EXPLORATION','DRILLING','OPERATION','FACILITY') NOT NULL,
  `priority` varchar(50) DEFAULT 'Sedang',
  `status` varchar(50) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `totalBudget` double DEFAULT 0,
  `location` varchar(255) DEFAULT NULL,
  `manager` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `projectCode`, `name`, `category`, `priority`, `status`, `startDate`, `endDate`, `totalBudget`, `location`, `manager`, `created_at`, `updated_at`) VALUES
('EMP-DRI-002', 'EMP-DRI-002', 'Bentu Block - Workover Well #5', 'DRILLING', 'Sedang', 'Berjalan', '2026-06-04 07:12:50', '2026-10-04 00:12:50', 698722592716, 'Bentu Block (Sumatra)', 'Andi Hidayat', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-DRI-003', 'EMP-DRI-003', 'Siak Block - Workover Well #1', 'DRILLING', 'Sedang', 'Berjalan', '2026-11-14 19:37:00', '2027-03-14 12:37:00', 283865148778, 'Siak Block (Sumatra)', 'Rina Wati', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-DRI-009', 'EMP-DRI-009', '\'B\' Block - Infill Drilling #2', 'DRILLING', 'Tinggi', 'Tertunda', '2026-03-16 18:20:31', '2026-08-16 11:20:31', 461849509892, '\'B\' Block (Sumatra)', 'Andi Hidayat', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-DRI-011', 'EMP-DRI-011', 'Buzi EPCC - Development Well Drilling #1', 'DRILLING', 'Sedang', 'Beresiko', '2026-05-22 15:17:48', '2026-11-22 08:17:48', 867543064454, 'Buzi EPCC (Mozambique)', 'Siti Aminah', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-DRI-016', 'EMP-DRI-016', 'South CPP Block - Infill Drilling #2', 'DRILLING', 'Rendah', 'Berjalan', '2026-01-22 14:41:26', '2026-03-22 07:41:26', 573717209656, 'South CPP Block (Sumatra)', 'Agus Setiawan', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-DRI-024', 'EMP-DRI-024', 'Sengkang Block - Development Well Drilling #3', 'DRILLING', 'Sedang', 'Berjalan', '2026-12-27 16:37:06', '2027-06-27 09:37:06', 1282987944439, 'Sengkang Block (Sulawesi)', 'Joko Widodo', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-DRI-026', 'EMP-DRI-026', '\'B\' Block - Rig Mobilization #3', 'DRILLING', 'Sedang', 'Tertunda', '2026-12-30 20:36:44', '2027-06-30 13:36:44', 353690645154, '\'B\' Block (Sumatra)', 'Siti Aminah', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-DRI-037', 'EMP-DRI-037', '\'B\' Block - Infill Drilling #1', 'DRILLING', 'Sedang', 'Berjalan', '2026-07-16 14:12:12', '2027-01-16 07:12:12', 219270047481, '\'B\' Block (Sumatra)', 'Rina Wati', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-DRI-045', 'EMP-DRI-045', 'Gebang Block - Infill Drilling #1', 'DRILLING', 'Tinggi', 'Berjalan', '2026-04-07 13:02:37', '2026-10-07 06:02:37', 1019587567368, 'Gebang Block (Sumatra)', 'Eko Prasetyo', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-EXP-004', 'EMP-EXP-004', 'Gebang Block - Geological Study #5', 'EXPLORATION', 'Rendah', 'Berjalan', '2026-03-09 20:10:28', '2026-08-09 13:10:28', 311492339569, 'Gebang Block (Sumatra)', 'Eko Prasetyo', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-EXP-010', 'EMP-EXP-010', 'Sengkang Block - Seismic 2D Acquisition #3', 'EXPLORATION', 'Tinggi', 'Berjalan', '2026-03-05 04:54:15', '2026-09-04 21:54:15', 231315487327, 'Sengkang Block (Sulawesi)', 'Rina Wati', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-EXP-012', 'EMP-EXP-012', 'Sengkang Block - Exploration Well Drilling #3', 'EXPLORATION', 'Tinggi', 'Selesai', '2026-05-09 05:41:52', '2027-02-08 22:41:52', 193028940253, 'Sengkang Block (Sulawesi)', 'Joko Widodo', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-EXP-018', 'EMP-EXP-018', '\'B\' Block - Geological Study #1', 'EXPLORATION', 'Sedang', 'Selesai', '2026-04-29 08:46:23', '2026-06-29 01:46:23', 233103248619, '\'B\' Block (Sumatra)', 'Andi Hidayat', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-EXP-022', 'EMP-EXP-022', 'Kangean Block - Seismic 2D Acquisition #3', 'EXPLORATION', 'Sedang', 'Tertunda', '2026-01-03 07:42:48', '2026-07-03 00:42:48', 363112077281, 'Kangean Block (Jawa)', 'Joko Widodo', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-EXP-023', 'EMP-EXP-023', 'Bentu Block - Seismic 2D Acquisition #3', 'EXPLORATION', 'Sedang', 'Berjalan', '2026-07-28 17:44:22', '2026-12-28 10:44:22', 99075229382, 'Bentu Block (Sumatra)', 'Andi Hidayat', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-EXP-028', 'EMP-EXP-028', 'Tonga Block - Seismic 2D Acquisition #1', 'EXPLORATION', 'Rendah', 'Beresiko', '2026-11-20 10:24:44', '2027-03-20 03:24:44', 34475782813, 'Tonga Block (Sumatra)', 'Andi Hidayat', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-EXP-030', 'EMP-EXP-030', 'Bireun-Sigli Block - G&G Analysis #5', 'EXPLORATION', 'Sedang', 'Selesai', '2026-05-13 05:25:03', '2026-12-12 22:25:03', 121013436828, 'Bireun-Sigli Block (Sumatra)', 'Eko Prasetyo', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-EXP-038', 'EMP-EXP-038', 'Korinci Baru Block - Seismic 2D Acquisition #3', 'EXPLORATION', 'Sedang', 'Selesai', '2026-03-06 10:15:49', '2026-09-06 03:15:49', 194413678474, 'Korinci Baru Block (Sumatra)', 'Eko Prasetyo', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-EXP-043', 'EMP-EXP-043', 'Kangean Block - Geological Study #3', 'EXPLORATION', 'Sedang', 'Berjalan', '2026-04-24 20:21:56', '2026-12-24 13:21:56', 29407248255, 'Kangean Block (Jawa)', 'Rina Wati', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-EXP-044', 'EMP-EXP-044', 'Sengkang Block - Geological Study #4', 'EXPLORATION', 'Sedang', 'Berjalan', '2026-03-29 12:44:07', '2026-11-29 05:44:07', 206761428286, 'Sengkang Block (Sulawesi)', 'Joko Widodo', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-006', 'EMP-FAC-006', 'Bireun-Sigli Block - Flowline Replacement #1', 'FACILITY', 'Tinggi', 'Berjalan', '2026-05-06 00:10:09', '2026-07-05 17:10:09', 6765990767, 'Bireun-Sigli Block (Sumatra)', 'Andi Hidayat', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-007', 'EMP-FAC-007', 'Tonga Block - Storage Tank Repair #4', 'FACILITY', 'Sedang', 'Berjalan', '2026-03-15 08:20:23', '2026-09-15 01:20:23', 35868079585, 'Tonga Block (Sumatra)', 'Eko Prasetyo', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-014', 'EMP-FAC-014', 'Malacca Strait Block - New Separator Installation #3', 'FACILITY', 'Sedang', 'Selesai', '2026-09-16 07:24:40', '2027-01-16 00:24:40', 29125385951, 'Malacca Strait Block (Sumatra)', 'Dewi Lestari', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-015', 'EMP-FAC-015', 'Tonga Block - New Separator Installation #1', 'FACILITY', 'Sedang', 'Berjalan', '2026-06-13 01:01:01', '2027-01-12 18:01:01', 128652432310, 'Tonga Block (Sumatra)', 'Joko Widodo', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-020', 'EMP-FAC-020', 'Gebang Block - Control Room Upgrade #2', 'FACILITY', 'Tinggi', 'Berjalan', '2026-08-07 06:00:57', '2026-10-06 23:00:57', 56750355449, 'Gebang Block (Sumatra)', 'Rina Wati', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-025', 'EMP-FAC-025', 'Kangean Block - Control Room Upgrade #3', 'FACILITY', 'Tinggi', 'Berjalan', '2026-01-20 17:22:00', '2026-06-20 10:22:00', 94287092694, 'Kangean Block (Jawa)', 'Dewi Lestari', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-027', 'EMP-FAC-027', 'Kangean Block - Control Room Upgrade #1', 'FACILITY', 'Sedang', 'Tertunda', '2026-02-09 18:30:50', '2026-06-09 11:30:50', 29468876787, 'Kangean Block (Jawa)', 'Agus Setiawan', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-029', 'EMP-FAC-029', '\'B\' Block - Flowline Replacement #2', 'FACILITY', 'Tinggi', 'Berjalan', '2026-01-30 16:30:37', '2026-08-30 09:30:37', 54319474258, '\'B\' Block (Sumatra)', 'Eko Prasetyo', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-031', 'EMP-FAC-031', 'Kampar Block - Storage Tank Repair #2', 'FACILITY', 'Sedang', 'Selesai', '2026-06-03 17:01:46', '2026-10-03 10:01:46', 73799660762, 'Kampar Block (Sumatra)', 'Agus Setiawan', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-032', 'EMP-FAC-032', 'Korinci Baru Block - Storage Tank Repair #3', 'FACILITY', 'Rendah', 'Berjalan', '2026-06-21 05:36:31', '2026-11-20 22:36:31', 126045532813, 'Korinci Baru Block (Sumatra)', 'Agus Setiawan', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-034', 'EMP-FAC-034', 'Kangean Block - Storage Tank Repair #5', 'FACILITY', 'Sedang', 'Tertunda', '2026-08-14 06:18:51', '2026-12-13 23:18:51', 108410068334, 'Kangean Block (Jawa)', 'Siti Aminah', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-035', 'EMP-FAC-035', 'Korinci Baru Block - Control Room Upgrade #4', 'FACILITY', 'Sedang', 'Berjalan', '2026-01-02 21:38:05', '2026-10-02 14:38:05', 68280160105, 'Korinci Baru Block (Sumatra)', 'Siti Aminah', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-039', 'EMP-FAC-039', 'Tonga Block - HSE Equipment Upgrade #5', 'FACILITY', 'Rendah', 'Berjalan', '2026-01-09 10:31:21', '2026-10-09 03:31:21', 135471843997, 'Tonga Block (Sumatra)', 'Budi Santoso', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-041', 'EMP-FAC-041', '\'B\' Block - Flowline Replacement #4', 'FACILITY', 'Rendah', 'Beresiko', '2026-09-16 01:15:10', '2027-01-15 18:15:10', 141665154712, '\'B\' Block (Sumatra)', 'Rina Wati', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-042', 'EMP-FAC-042', 'Gebang Block - Control Room Upgrade #5', 'FACILITY', 'Tinggi', 'Tertunda', '2026-09-28 13:36:50', '2027-04-28 06:36:50', 83359431052, 'Gebang Block (Sumatra)', 'Rina Wati', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-046', 'EMP-FAC-046', 'Kampar Block - Control Room Upgrade #2', 'FACILITY', 'Tinggi', 'Tertunda', '2026-01-10 22:35:44', '2026-08-10 15:35:44', 186074254206, 'Kampar Block (Sumatra)', 'Dewi Lestari', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-047', 'EMP-FAC-047', 'Kampar Block - New Separator Installation #2', 'FACILITY', 'Rendah', 'Selesai', '2026-08-08 07:51:46', '2027-03-08 00:51:46', 191937835863, 'Kampar Block (Sumatra)', 'Joko Widodo', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-049', 'EMP-FAC-049', 'Korinci Baru Block - New Separator Installation #1', 'FACILITY', 'Sedang', 'Selesai', '2026-03-26 13:27:47', '2026-06-26 06:27:47', 75931393689, 'Korinci Baru Block (Sumatra)', 'Agus Setiawan', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-FAC-050', 'EMP-FAC-050', 'Kampar Block - Storage Tank Repair #1', 'FACILITY', 'Rendah', 'Berjalan', '2026-10-07 22:13:11', '2027-05-07 15:13:11', 117909276101, 'Kampar Block (Sumatra)', 'Rina Wati', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-OPE-001', 'EMP-OPE-001', 'Kangean Block - Pump Replacement #4', 'OPERATION', 'Rendah', 'Berjalan', '2026-06-11 01:46:54', '2026-08-10 18:46:54', 86899272800, 'Kangean Block (Jawa)', 'Joko Widodo', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-OPE-005', 'EMP-OPE-005', 'Siak Block - Production Optimization #3', 'OPERATION', 'Rendah', 'Berjalan', '2026-04-07 06:01:18', '2026-07-06 23:01:18', 53988340403, 'Siak Block (Sumatra)', 'Agus Setiawan', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-OPE-008', 'EMP-OPE-008', 'Kampar Block - Well Maintenance #4', 'OPERATION', 'Sedang', 'Berjalan', '2026-05-05 23:53:57', '2026-07-05 16:53:57', 93253802516, 'Kampar Block (Sumatra)', 'Rina Wati', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-OPE-013', 'EMP-OPE-013', 'Siak Block - Well Maintenance #4', 'OPERATION', 'Sedang', 'Berjalan', '2026-05-30 06:54:39', '2026-12-29 23:54:39', 41773663655, 'Siak Block (Sumatra)', 'Eko Prasetyo', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-OPE-017', 'EMP-OPE-017', 'Malacca Strait Block - Gas Compressor Overhaul #2', 'OPERATION', 'Rendah', 'Beresiko', '2026-09-27 10:36:02', '2027-01-27 03:36:02', 83720993037, 'Malacca Strait Block (Sumatra)', 'Rina Wati', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-OPE-019', 'EMP-OPE-019', 'Tonga Block - Pump Replacement #3', 'OPERATION', 'Tinggi', 'Berjalan', '2026-10-25 09:51:10', '2027-07-25 02:51:10', 7708241804, 'Tonga Block (Sumatra)', 'Joko Widodo', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-OPE-021', 'EMP-OPE-021', 'Korinci Baru Block - Well Maintenance #4', 'OPERATION', 'Tinggi', 'Tertunda', '2026-06-09 01:42:58', '2026-12-08 18:42:58', 80002130010, 'Korinci Baru Block (Sumatra)', 'Dewi Lestari', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-OPE-033', 'EMP-OPE-033', 'Kampar Block - Well Maintenance #4', 'OPERATION', 'Tinggi', 'Berjalan', '2026-11-05 20:26:34', '2027-05-05 13:26:34', 44062694701, 'Kampar Block (Sumatra)', 'Agus Setiawan', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-OPE-036', 'EMP-OPE-036', 'Bentu Block - Well Maintenance #4', 'OPERATION', 'Tinggi', 'Selesai', '2026-07-02 17:41:50', '2027-04-02 10:41:50', 31885149947, 'Bentu Block (Sumatra)', 'Andi Hidayat', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-OPE-040', 'EMP-OPE-040', '\'B\' Block - Production Optimization #2', 'OPERATION', 'Rendah', 'Beresiko', '2026-08-22 19:18:33', '2027-04-22 12:18:33', 45543774773, '\'B\' Block (Sumatra)', 'Dewi Lestari', '2026-02-20 09:55:48', '2026-02-20 09:55:48'),
('EMP-OPE-048', 'EMP-OPE-048', 'Bireun-Sigli Block - Well Maintenance #4', 'OPERATION', 'Sedang', 'Tertunda', '2026-03-13 23:59:12', '2026-07-13 16:59:12', 96559592509, 'Bireun-Sigli Block (Sumatra)', 'Rina Wati', '2026-02-20 09:55:48', '2026-02-20 09:55:48');

-- --------------------------------------------------------

--
-- Table structure for table `project_members`
--

CREATE TABLE `project_members` (
  `id` varchar(50) NOT NULL,
  `projectId` varchar(50) NOT NULL,
  `employeeId` varchar(50) NOT NULL,
  `role` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_metrics`
--

CREATE TABLE `project_metrics` (
  `id` varchar(50) NOT NULL,
  `projectId` varchar(50) NOT NULL,
  `recordDate` datetime NOT NULL,
  `actualCost` double DEFAULT 0,
  `actualProgress` float DEFAULT 0,
  `plannedValue` double DEFAULT 0,
  `earnedValue` double DEFAULT 0,
  `scheduleVariance` double DEFAULT 0,
  `costVariance` double DEFAULT 0,
  `spi` float DEFAULT 1,
  `cpi` float DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_metrics`
--

INSERT INTO `project_metrics` (`id`, `projectId`, `recordDate`, `actualCost`, `actualProgress`, `plannedValue`, `earnedValue`, `scheduleVariance`, `costVariance`, `spi`, `cpi`) VALUES
('met-EMP-DRI-002', 'EMP-DRI-002', '2026-02-20 09:55:48', 286765932566.76404, 41, 319991173509.1381, 286476263013.56, 0, 0, 0.9, 1),
('met-EMP-DRI-003', 'EMP-DRI-003', '2026-02-20 09:55:48', 174090633805.3738, 57, 144707025368.90472, 161803134803.46, 0, 0, 1.12, 0.93),
('met-EMP-DRI-009', 'EMP-DRI-009', '2026-02-20 09:55:48', 404088954737.61475, 73, 298977595795.6804, 337150142221.16, 0, 0, 1.13, 0.83),
('met-EMP-DRI-011', 'EMP-DRI-011', '2026-02-20 09:55:48', 725925244566.9437, 86, 794862881030.2705, 746087035430.44, 0, 0, 0.94, 1.03),
('met-EMP-DRI-016', 'EMP-DRI-016', '2026-02-20 09:55:48', 250172629376.9905, 54, 267891934464.56357, 309807293214.24, 0, 0, 1.16, 1.24),
('met-EMP-DRI-024', 'EMP-DRI-024', '2026-02-20 09:55:48', 1095491989507.0623, 78, 1124056231793.38, 1000730596662.42, 0, 0, 0.89, 0.91),
('met-EMP-DRI-026', 'EMP-DRI-026', '2026-02-20 09:55:48', 264772781015.44205, 70, 266606086687.71414, 247583451607.8, 0, 0, 0.93, 0.94),
('met-EMP-DRI-037', 'EMP-DRI-037', '2026-02-20 09:55:48', 145907115669.76398, 73, 181709215233.5443, 160067134661.13, 0, 0, 0.88, 1.1),
('met-EMP-DRI-045', 'EMP-DRI-045', '2026-02-20 09:55:48', 234733173872.6811, 23, 133886286517.71242, 234505140494.64, 0, 0, 1.75, 1),
('met-EMP-EXP-004', 'EMP-EXP-004', '2026-02-20 09:55:48', 231355587680.92917, 74, 229551208027.9668, 230504331281.06, 0, 0, 1, 1),
('met-EMP-EXP-010', 'EMP-EXP-010', '2026-02-20 09:55:48', 110823505433.77058, 54, 141537211312.8522, 124910363156.58, 0, 0, 0.88, 1.13),
('met-EMP-EXP-012', 'EMP-EXP-012', '2026-02-20 09:55:48', 214107302336.2774, 100, 183147095474.82455, 193028940253, 0, 0, 1.05, 0.9),
('met-EMP-EXP-018', 'EMP-EXP-018', '2026-02-20 09:55:48', 256081621531.9058, 100, 233103248619, 233103248619, 0, 0, 1, 0.91),
('met-EMP-EXP-022', 'EMP-EXP-022', '2026-02-20 09:55:48', 233919842278.97388, 58, 201087459904.12875, 210605004822.97998, 0, 0, 1.05, 0.9),
('met-EMP-EXP-023', 'EMP-EXP-023', '2026-02-20 09:55:48', 7223129617.254154, 7, 14047973388.023947, 6935266056.740001, 0, 0, 0.49, 0.96),
('met-EMP-EXP-028', 'EMP-EXP-028', '2026-02-20 09:55:48', 4267683931.9305787, 11, 6560002488.232029, 3792336109.43, 0, 0, 0.58, 0.89),
('met-EMP-EXP-030', 'EMP-EXP-030', '2026-02-20 09:55:48', 112323054368.87915, 100, 111634132304.6117, 121013436828, 0, 0, 1.08, 1.08),
('met-EMP-EXP-038', 'EMP-EXP-038', '2026-02-20 09:55:48', 187958747070.80322, 100, 194413678474, 194413678474, 0, 0, 1, 1.03),
('met-EMP-EXP-043', 'EMP-EXP-043', '2026-02-20 09:55:48', 17710640215.34525, 61, 17820723189.540154, 17938421435.55, 0, 0, 1.01, 1.01),
('met-EMP-EXP-044', 'EMP-EXP-044', '2026-02-20 09:55:48', 27016428545.345463, 12, 14286712095.820723, 24811371394.32, 0, 0, 1.74, 0.92),
('met-EMP-FAC-006', 'EMP-FAC-006', '2026-02-20 09:55:48', 3570014763.5331497, 45, 2869309378.3738394, 3044695845.15, 0, 0, 1.06, 0.85),
('met-EMP-FAC-007', 'EMP-FAC-007', '2026-02-20 09:55:48', 2612150979.367684, 8, 0, 2869446366.8, 0, 0, 1, 1.1),
('met-EMP-FAC-014', 'EMP-FAC-014', '2026-02-20 09:55:48', 23436866053.39703, 100, 29125385951, 29125385951, 0, 0, 1, 1.24),
('met-EMP-FAC-015', 'EMP-FAC-015', '2026-02-20 09:55:48', 96241411467.32295, 71, 100917818028.23842, 91343226940.09999, 0, 0, 0.91, 0.95),
('met-EMP-FAC-020', 'EMP-FAC-020', '2026-02-20 09:55:48', 23010327925.230648, 42, 22365086179.659164, 23835149288.579998, 0, 0, 1.07, 1.04),
('met-EMP-FAC-025', 'EMP-FAC-025', '2026-02-20 09:55:48', 13845454714.248785, 14, 6424132264.109287, 13200192977.160002, 0, 0, 2.05, 0.95),
('met-EMP-FAC-027', 'EMP-FAC-027', '2026-02-20 09:55:48', 11153402330.372587, 45, 12879758415.328825, 13260994554.15, 0, 0, 1.03, 1.19),
('met-EMP-FAC-029', 'EMP-FAC-029', '2026-02-20 09:55:48', 10293154859.440163, 19, 6577654662.282353, 10320700109.02, 0, 0, 1.57, 1),
('met-EMP-FAC-031', 'EMP-FAC-031', '2026-02-20 09:55:48', 68498627718.05035, 100, 73799660762, 73799660762, 0, 0, 1, 1.08),
('met-EMP-FAC-032', 'EMP-FAC-032', '2026-02-20 09:55:48', 26133436820.1479, 20, 15446250214.757833, 25209106562.600002, 0, 0, 1.63, 0.96),
('met-EMP-FAC-034', 'EMP-FAC-034', '2026-02-20 09:55:48', 9746203322.238632, 11, 10816910911.219921, 11925107516.74, 0, 0, 1.1, 1.22),
('met-EMP-FAC-035', 'EMP-FAC-035', '2026-02-20 09:55:48', 27018754104.80109, 41, 21503343323.588303, 27994865643.05, 0, 0, 1.3, 1.04),
('met-EMP-FAC-039', 'EMP-FAC-039', '2026-02-20 09:55:48', 43804664128.344795, 40, 58639410274.150635, 54188737598.8, 0, 0, 0.92, 1.24),
('met-EMP-FAC-041', 'EMP-FAC-041', '2026-02-20 09:55:48', 1177589199.13564, 1, 0, 1416651547.1200001, 0, 0, 1, 1.2),
('met-EMP-FAC-042', 'EMP-FAC-042', '2026-02-20 09:55:48', 50112245003.55086, 56, 38570304610.19892, 46681281389.12, 0, 0, 1.21, 0.93),
('met-EMP-FAC-046', 'EMP-FAC-046', '2026-02-20 09:55:48', 47814596531.25354, 32, 43065588985.18119, 59543761345.92, 0, 0, 1.38, 1.25),
('met-EMP-FAC-047', 'EMP-FAC-047', '2026-02-20 09:55:48', 214274440065.02567, 100, 191937835863, 191937835863, 0, 0, 1, 0.9),
('met-EMP-FAC-049', 'EMP-FAC-049', '2026-02-20 09:55:48', 87272178941.16689, 100, 73417311148.96736, 75931393689, 0, 0, 1.03, 0.87),
('met-EMP-FAC-050', 'EMP-FAC-050', '2026-02-20 09:55:48', 17353594793.371605, 18, 30554980130.636127, 21223669698.18, 0, 0, 0.69, 1.22),
('met-EMP-OPE-001', 'EMP-OPE-001', '2026-02-20 09:55:48', 11664667312.22451, 14, 6793677734.280616, 12165898192.000002, 0, 0, 1.79, 1.04),
('met-EMP-OPE-005', 'EMP-OPE-005', '2026-02-20 09:55:48', 46093080834.41222, 83, 42958954639.584496, 44810322534.49, 0, 0, 1.04, 0.97),
('met-EMP-OPE-008', 'EMP-OPE-008', '2026-02-20 09:55:48', 77952195956.83527, 85, 73321210481.73914, 79265732138.59999, 0, 0, 1.08, 1.02),
('met-EMP-OPE-013', 'EMP-OPE-013', '2026-02-20 09:55:48', 11611418951.621693, 24, 13181895598.109812, 10025679277.199999, 0, 0, 0.76, 0.86),
('met-EMP-OPE-017', 'EMP-OPE-017', '2026-02-20 09:55:48', 23313036033.489574, 31, 21210509238.60524, 25953507841.47, 0, 0, 1.22, 1.11),
('met-EMP-OPE-019', 'EMP-OPE-019', '2026-02-20 09:55:48', 3524320471.4843755, 41, 2583745095.7912345, 3160379139.64, 0, 0, 1.22, 0.9),
('met-EMP-OPE-021', 'EMP-OPE-021', '2026-02-20 09:55:48', 74034248025.09682, 78, 61158344024.572075, 62401661407.8, 0, 0, 1.02, 0.84),
('met-EMP-OPE-033', 'EMP-OPE-033', '2026-02-20 09:55:48', 4007773376.583083, 11, 8605355156.594864, 4846896417.11, 0, 0, 0.56, 1.21),
('met-EMP-OPE-036', 'EMP-OPE-036', '2026-02-20 09:55:48', 27508656946.233875, 100, 31885149947, 31885149947, 0, 0, 1, 1.16),
('met-EMP-OPE-040', 'EMP-OPE-040', '2026-02-20 09:55:48', 11066448674.850937, 27, 15386388149.4033, 12296819188.710001, 0, 0, 0.8, 1.11),
('met-EMP-OPE-048', 'EMP-OPE-048', '2026-02-20 09:55:48', 24297774712.772076, 30, 36821947332.29024, 28967877752.7, 0, 0, 0.79, 1.19);

-- --------------------------------------------------------

--
-- Table structure for table `task_milestones`
--

CREATE TABLE `task_milestones` (
  `id` varchar(50) NOT NULL,
  `timelineEventId` varchar(50) NOT NULL,
  `milestoneName` varchar(255) NOT NULL,
  `progressContribution` float DEFAULT 0,
  `isCompleted` tinyint(1) DEFAULT 0,
  `completedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `timeline_events`
--

CREATE TABLE `timeline_events` (
  `id` varchar(50) NOT NULL,
  `projectId` varchar(50) NOT NULL,
  `eventName` varchar(255) NOT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `taskBudget` double DEFAULT 0,
  `calculatedProgress` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `timeline_events`
--

INSERT INTO `timeline_events` (`id`, `projectId`, `eventName`, `startDate`, `endDate`, `taskBudget`, `calculatedProgress`) VALUES
('evt-EMP-DRI-002-0', 'EMP-DRI-002', 'Preparation', '2026-06-04 07:12:50', '2026-07-04 00:12:50', 232907530905.33334, 4),
('evt-EMP-DRI-002-1', 'EMP-DRI-002', 'Execution', '2026-07-04 00:12:50', '2026-08-03 17:12:50', 232907530905.33334, 88),
('evt-EMP-DRI-002-2', 'EMP-DRI-002', 'Reporting', '2026-08-03 17:12:50', '2026-09-03 10:12:50', 232907530905.33334, 81),
('evt-EMP-DRI-003-0', 'EMP-DRI-003', 'Preparation', '2026-11-14 19:37:00', '2026-12-14 12:37:00', 94621716259.33333, 7),
('evt-EMP-DRI-003-1', 'EMP-DRI-003', 'Execution', '2026-12-14 12:37:00', '2027-01-14 05:37:00', 94621716259.33333, 81),
('evt-EMP-DRI-003-2', 'EMP-DRI-003', 'Reporting', '2027-01-14 05:37:00', '2027-02-13 22:37:00', 94621716259.33333, 62),
('evt-EMP-DRI-009-0', 'EMP-DRI-009', 'Preparation', '2026-03-16 18:20:31', '2026-04-16 11:20:31', 153949836630.66666, 51),
('evt-EMP-DRI-009-1', 'EMP-DRI-009', 'Execution', '2026-04-16 11:20:31', '2026-05-16 04:20:31', 153949836630.66666, 54),
('evt-EMP-DRI-009-2', 'EMP-DRI-009', 'Reporting', '2026-05-16 04:20:31', '2026-06-15 21:20:31', 153949836630.66666, 91),
('evt-EMP-DRI-011-0', 'EMP-DRI-011', 'Preparation', '2026-05-22 15:17:48', '2026-07-22 08:17:48', 289181021484.6667, 93),
('evt-EMP-DRI-011-1', 'EMP-DRI-011', 'Execution', '2026-07-22 08:17:48', '2026-09-22 01:17:48', 289181021484.6667, 63),
('evt-EMP-DRI-011-2', 'EMP-DRI-011', 'Reporting', '2026-09-22 01:17:48', '2026-11-21 18:17:48', 289181021484.6667, 78),
('evt-EMP-DRI-016-0', 'EMP-DRI-016', 'Preparation', '2026-01-22 14:41:26', '2026-02-22 07:41:26', 191239069885.33334, 46),
('evt-EMP-DRI-016-1', 'EMP-DRI-016', 'Execution', '2026-02-22 07:41:26', '2026-03-22 00:41:26', 191239069885.33334, 84),
('evt-EMP-DRI-016-2', 'EMP-DRI-016', 'Reporting', '2026-03-22 00:41:26', '2026-04-21 17:41:26', 191239069885.33334, 48),
('evt-EMP-DRI-024-0', 'EMP-DRI-024', 'Preparation', '2026-12-27 16:37:06', '2027-02-27 09:37:06', 427662648146.3333, 56),
('evt-EMP-DRI-024-1', 'EMP-DRI-024', 'Execution', '2027-02-27 09:37:06', '2027-04-27 02:37:06', 427662648146.3333, 65),
('evt-EMP-DRI-024-2', 'EMP-DRI-024', 'Reporting', '2027-04-27 02:37:06', '2027-06-26 19:37:06', 427662648146.3333, 15),
('evt-EMP-DRI-026-0', 'EMP-DRI-026', 'Preparation', '2026-12-30 20:36:44', '2027-03-02 13:36:44', 117896881718, 59),
('evt-EMP-DRI-026-1', 'EMP-DRI-026', 'Execution', '2027-03-02 13:36:44', '2027-05-02 06:36:44', 117896881718, 64),
('evt-EMP-DRI-026-2', 'EMP-DRI-026', 'Reporting', '2027-05-02 06:36:44', '2027-07-01 23:36:44', 117896881718, 35),
('evt-EMP-DRI-037-0', 'EMP-DRI-037', 'Preparation', '2026-07-16 14:12:12', '2026-09-16 07:12:12', 73090015827, 17),
('evt-EMP-DRI-037-1', 'EMP-DRI-037', 'Execution', '2026-09-16 07:12:12', '2026-11-16 00:12:12', 73090015827, 54),
('evt-EMP-DRI-037-2', 'EMP-DRI-037', 'Reporting', '2026-11-16 00:12:12', '2027-01-15 17:12:12', 73090015827, 27),
('evt-EMP-DRI-045-0', 'EMP-DRI-045', 'Preparation', '2026-04-07 13:02:37', '2026-06-07 06:02:37', 339862522456, 96),
('evt-EMP-DRI-045-1', 'EMP-DRI-045', 'Execution', '2026-06-07 06:02:37', '2026-08-06 23:02:37', 339862522456, 95),
('evt-EMP-DRI-045-2', 'EMP-DRI-045', 'Reporting', '2026-08-06 23:02:37', '2026-10-06 16:02:37', 339862522456, 31),
('evt-EMP-EXP-004-0', 'EMP-EXP-004', 'Preparation', '2026-03-09 20:10:28', '2026-04-09 13:10:28', 103830779856.33333, 51),
('evt-EMP-EXP-004-1', 'EMP-EXP-004', 'Execution', '2026-04-09 13:10:28', '2026-05-09 06:10:28', 103830779856.33333, 52),
('evt-EMP-EXP-004-2', 'EMP-EXP-004', 'Reporting', '2026-05-09 06:10:28', '2026-06-08 23:10:28', 103830779856.33333, 70),
('evt-EMP-EXP-010-0', 'EMP-EXP-010', 'Preparation', '2026-03-05 04:54:15', '2026-05-04 21:54:15', 77105162442.33333, 72),
('evt-EMP-EXP-010-1', 'EMP-EXP-010', 'Execution', '2026-05-04 21:54:15', '2026-07-04 14:54:15', 77105162442.33333, 64),
('evt-EMP-EXP-010-2', 'EMP-EXP-010', 'Reporting', '2026-07-04 14:54:15', '2026-09-04 07:54:15', 77105162442.33333, 35),
('evt-EMP-EXP-012-0', 'EMP-EXP-012', 'Preparation', '2026-05-09 05:41:52', '2026-08-08 22:41:52', 64342980084.333336, 100),
('evt-EMP-EXP-012-1', 'EMP-EXP-012', 'Execution', '2026-08-08 22:41:52', '2026-11-08 15:41:52', 64342980084.333336, 100),
('evt-EMP-EXP-012-2', 'EMP-EXP-012', 'Reporting', '2026-11-08 15:41:52', '2027-02-08 08:41:52', 64342980084.333336, 100),
('evt-EMP-EXP-018-0', 'EMP-EXP-018', 'Preparation', '2026-04-29 08:46:23', '2026-05-29 01:46:23', 77701082873, 100),
('evt-EMP-EXP-018-1', 'EMP-EXP-018', 'Execution', '2026-05-29 01:46:23', '2026-06-28 18:46:23', 77701082873, 100),
('evt-EMP-EXP-018-2', 'EMP-EXP-018', 'Reporting', '2026-06-28 18:46:23', '2026-07-28 11:46:23', 77701082873, 100),
('evt-EMP-EXP-022-0', 'EMP-EXP-022', 'Preparation', '2026-01-03 07:42:48', '2026-03-03 00:42:48', 121037359093.66667, 16),
('evt-EMP-EXP-022-1', 'EMP-EXP-022', 'Execution', '2026-03-03 00:42:48', '2026-05-02 17:42:48', 121037359093.66667, 55),
('evt-EMP-EXP-022-2', 'EMP-EXP-022', 'Reporting', '2026-05-02 17:42:48', '2026-07-02 10:42:48', 121037359093.66667, 24),
('evt-EMP-EXP-023-0', 'EMP-EXP-023', 'Preparation', '2026-07-28 17:44:22', '2026-08-28 10:44:22', 33025076460.666668, 17),
('evt-EMP-EXP-023-1', 'EMP-EXP-023', 'Execution', '2026-08-28 10:44:22', '2026-09-28 03:44:22', 33025076460.666668, 37),
('evt-EMP-EXP-023-2', 'EMP-EXP-023', 'Reporting', '2026-09-28 03:44:22', '2026-10-27 20:44:22', 33025076460.666668, 20),
('evt-EMP-EXP-028-0', 'EMP-EXP-028', 'Preparation', '2026-11-20 10:24:44', '2026-12-20 03:24:44', 11491927604.333334, 90),
('evt-EMP-EXP-028-1', 'EMP-EXP-028', 'Execution', '2026-12-20 03:24:44', '2027-01-19 20:24:44', 11491927604.333334, 7),
('evt-EMP-EXP-028-2', 'EMP-EXP-028', 'Reporting', '2027-01-19 20:24:44', '2027-02-19 13:24:44', 11491927604.333334, 87),
('evt-EMP-EXP-030-0', 'EMP-EXP-030', 'Preparation', '2026-05-13 05:25:03', '2026-07-12 22:25:03', 40337812276, 100),
('evt-EMP-EXP-030-1', 'EMP-EXP-030', 'Execution', '2026-07-12 22:25:03', '2026-09-12 15:25:03', 40337812276, 100),
('evt-EMP-EXP-030-2', 'EMP-EXP-030', 'Reporting', '2026-09-12 15:25:03', '2026-11-12 08:25:03', 40337812276, 100),
('evt-EMP-EXP-038-0', 'EMP-EXP-038', 'Preparation', '2026-03-06 10:15:49', '2026-05-06 03:15:49', 64804559491.333336, 100),
('evt-EMP-EXP-038-1', 'EMP-EXP-038', 'Execution', '2026-05-06 03:15:49', '2026-07-05 20:15:49', 64804559491.333336, 100),
('evt-EMP-EXP-038-2', 'EMP-EXP-038', 'Reporting', '2026-07-05 20:15:49', '2026-09-05 13:15:49', 64804559491.333336, 100),
('evt-EMP-EXP-043-0', 'EMP-EXP-043', 'Preparation', '2026-04-24 20:21:56', '2026-06-24 13:21:56', 9802416085, 24),
('evt-EMP-EXP-043-1', 'EMP-EXP-043', 'Execution', '2026-06-24 13:21:56', '2026-08-24 06:21:56', 9802416085, 39),
('evt-EMP-EXP-043-2', 'EMP-EXP-043', 'Reporting', '2026-08-24 06:21:56', '2026-10-23 23:21:56', 9802416085, 8),
('evt-EMP-EXP-044-0', 'EMP-EXP-044', 'Preparation', '2026-03-29 12:44:07', '2026-05-29 05:44:07', 68920476095.33333, 56),
('evt-EMP-EXP-044-1', 'EMP-EXP-044', 'Execution', '2026-05-29 05:44:07', '2026-07-28 22:44:07', 68920476095.33333, 28),
('evt-EMP-EXP-044-2', 'EMP-EXP-044', 'Reporting', '2026-07-28 22:44:07', '2026-09-28 15:44:07', 68920476095.33333, 11),
('evt-EMP-FAC-006-0', 'EMP-FAC-006', 'Preparation', '2026-05-06 00:10:09', '2026-06-05 17:10:09', 2255330255.6666665, 86),
('evt-EMP-FAC-006-1', 'EMP-FAC-006', 'Execution', '2026-06-05 17:10:09', '2026-07-05 10:10:09', 2255330255.6666665, 1),
('evt-EMP-FAC-006-2', 'EMP-FAC-006', 'Reporting', '2026-07-05 10:10:09', '2026-08-05 03:10:09', 2255330255.6666665, 65),
('evt-EMP-FAC-007-0', 'EMP-FAC-007', 'Preparation', '2026-03-15 08:20:23', '2026-05-15 01:20:23', 11956026528.333334, 69),
('evt-EMP-FAC-007-1', 'EMP-FAC-007', 'Execution', '2026-05-15 01:20:23', '2026-07-14 18:20:23', 11956026528.333334, 82),
('evt-EMP-FAC-007-2', 'EMP-FAC-007', 'Reporting', '2026-07-14 18:20:23', '2026-09-14 11:20:23', 11956026528.333334, 8),
('evt-EMP-FAC-014-0', 'EMP-FAC-014', 'Preparation', '2026-09-16 07:24:40', '2026-10-16 00:24:40', 9708461983.666666, 100),
('evt-EMP-FAC-014-1', 'EMP-FAC-014', 'Execution', '2026-10-16 00:24:40', '2026-11-15 17:24:40', 9708461983.666666, 100),
('evt-EMP-FAC-014-2', 'EMP-FAC-014', 'Reporting', '2026-11-15 17:24:40', '2026-12-15 10:24:40', 9708461983.666666, 100),
('evt-EMP-FAC-015-0', 'EMP-FAC-015', 'Preparation', '2026-06-13 01:01:01', '2026-08-12 18:01:01', 42884144103.333336, 25),
('evt-EMP-FAC-015-1', 'EMP-FAC-015', 'Execution', '2026-08-12 18:01:01', '2026-10-12 11:01:01', 42884144103.333336, 5),
('evt-EMP-FAC-015-2', 'EMP-FAC-015', 'Reporting', '2026-10-12 11:01:01', '2026-12-12 04:01:01', 42884144103.333336, 39),
('evt-EMP-FAC-020-0', 'EMP-FAC-020', 'Preparation', '2026-08-07 06:00:57', '2026-09-06 23:00:57', 18916785149.666668, 76),
('evt-EMP-FAC-020-1', 'EMP-FAC-020', 'Execution', '2026-09-06 23:00:57', '2026-10-06 16:00:57', 18916785149.666668, 87),
('evt-EMP-FAC-020-2', 'EMP-FAC-020', 'Reporting', '2026-10-06 16:00:57', '2026-11-06 09:00:57', 18916785149.666668, 58),
('evt-EMP-FAC-025-0', 'EMP-FAC-025', 'Preparation', '2026-01-20 17:22:00', '2026-02-20 10:22:00', 31429030898, 72),
('evt-EMP-FAC-025-1', 'EMP-FAC-025', 'Execution', '2026-02-20 10:22:00', '2026-03-20 03:22:00', 31429030898, 30),
('evt-EMP-FAC-025-2', 'EMP-FAC-025', 'Reporting', '2026-03-20 03:22:00', '2026-04-19 20:22:00', 31429030898, 50),
('evt-EMP-FAC-027-0', 'EMP-FAC-027', 'Preparation', '2026-02-09 18:30:50', '2026-03-09 11:30:50', 9822958929, 74),
('evt-EMP-FAC-027-1', 'EMP-FAC-027', 'Execution', '2026-03-09 11:30:50', '2026-04-09 04:30:50', 9822958929, 93),
('evt-EMP-FAC-027-2', 'EMP-FAC-027', 'Reporting', '2026-04-09 04:30:50', '2026-05-08 21:30:50', 9822958929, 29),
('evt-EMP-FAC-029-0', 'EMP-FAC-029', 'Preparation', '2026-01-30 16:30:37', '2026-03-30 09:30:37', 18106491419.333332, 92),
('evt-EMP-FAC-029-1', 'EMP-FAC-029', 'Execution', '2026-03-30 09:30:37', '2026-05-30 02:30:37', 18106491419.333332, 63),
('evt-EMP-FAC-029-2', 'EMP-FAC-029', 'Reporting', '2026-05-30 02:30:37', '2026-07-29 19:30:37', 18106491419.333332, 82),
('evt-EMP-FAC-031-0', 'EMP-FAC-031', 'Preparation', '2026-06-03 17:01:46', '2026-07-03 10:01:46', 24599886920.666668, 100),
('evt-EMP-FAC-031-1', 'EMP-FAC-031', 'Execution', '2026-07-03 10:01:46', '2026-08-03 03:01:46', 24599886920.666668, 100),
('evt-EMP-FAC-031-2', 'EMP-FAC-031', 'Reporting', '2026-08-03 03:01:46', '2026-09-02 20:01:46', 24599886920.666668, 100),
('evt-EMP-FAC-032-0', 'EMP-FAC-032', 'Preparation', '2026-06-21 05:36:31', '2026-07-20 22:36:31', 42015177604.333336, 18),
('evt-EMP-FAC-032-1', 'EMP-FAC-032', 'Execution', '2026-07-20 22:36:31', '2026-08-20 15:36:31', 42015177604.333336, 65),
('evt-EMP-FAC-032-2', 'EMP-FAC-032', 'Reporting', '2026-08-20 15:36:31', '2026-09-20 08:36:31', 42015177604.333336, 28),
('evt-EMP-FAC-034-0', 'EMP-FAC-034', 'Preparation', '2026-08-14 06:18:51', '2026-09-13 23:18:51', 36136689444.666664, 57),
('evt-EMP-FAC-034-1', 'EMP-FAC-034', 'Execution', '2026-09-13 23:18:51', '2026-10-13 16:18:51', 36136689444.666664, 0),
('evt-EMP-FAC-034-2', 'EMP-FAC-034', 'Reporting', '2026-10-13 16:18:51', '2026-11-13 09:18:51', 36136689444.666664, 26),
('evt-EMP-FAC-035-0', 'EMP-FAC-035', 'Preparation', '2026-01-02 21:38:05', '2026-04-02 14:38:05', 22760053368.333332, 5),
('evt-EMP-FAC-035-1', 'EMP-FAC-035', 'Execution', '2026-04-02 14:38:05', '2026-07-02 07:38:05', 22760053368.333332, 39),
('evt-EMP-FAC-035-2', 'EMP-FAC-035', 'Reporting', '2026-07-02 07:38:05', '2026-10-02 00:38:05', 22760053368.333332, 87),
('evt-EMP-FAC-039-0', 'EMP-FAC-039', 'Preparation', '2026-01-09 10:31:21', '2026-04-09 03:31:21', 45157281332.333336, 15),
('evt-EMP-FAC-039-1', 'EMP-FAC-039', 'Execution', '2026-04-09 03:31:21', '2026-07-08 20:31:21', 45157281332.333336, 97),
('evt-EMP-FAC-039-2', 'EMP-FAC-039', 'Reporting', '2026-07-08 20:31:21', '2026-10-08 13:31:21', 45157281332.333336, 24),
('evt-EMP-FAC-041-0', 'EMP-FAC-041', 'Preparation', '2026-09-16 01:15:10', '2026-10-15 18:15:10', 47221718237.333336, 96),
('evt-EMP-FAC-041-1', 'EMP-FAC-041', 'Execution', '2026-10-15 18:15:10', '2026-11-15 11:15:10', 47221718237.333336, 1),
('evt-EMP-FAC-041-2', 'EMP-FAC-041', 'Reporting', '2026-11-15 11:15:10', '2026-12-15 04:15:10', 47221718237.333336, 58),
('evt-EMP-FAC-042-0', 'EMP-FAC-042', 'Preparation', '2026-09-28 13:36:50', '2026-11-28 06:36:50', 27786477017.333332, 7),
('evt-EMP-FAC-042-1', 'EMP-FAC-042', 'Execution', '2026-11-28 06:36:50', '2027-01-27 23:36:50', 27786477017.333332, 36),
('evt-EMP-FAC-042-2', 'EMP-FAC-042', 'Reporting', '2027-01-27 23:36:50', '2027-03-27 16:36:50', 27786477017.333332, 53),
('evt-EMP-FAC-046-0', 'EMP-FAC-046', 'Preparation', '2026-01-10 22:35:44', '2026-03-10 15:35:44', 62024751402, 21),
('evt-EMP-FAC-046-1', 'EMP-FAC-046', 'Execution', '2026-03-10 15:35:44', '2026-05-10 08:35:44', 62024751402, 56),
('evt-EMP-FAC-046-2', 'EMP-FAC-046', 'Reporting', '2026-05-10 08:35:44', '2026-07-10 01:35:44', 62024751402, 30),
('evt-EMP-FAC-047-0', 'EMP-FAC-047', 'Preparation', '2026-08-08 07:51:46', '2026-10-08 00:51:46', 63979278621, 100),
('evt-EMP-FAC-047-1', 'EMP-FAC-047', 'Execution', '2026-10-08 00:51:46', '2026-12-07 17:51:46', 63979278621, 100),
('evt-EMP-FAC-047-2', 'EMP-FAC-047', 'Reporting', '2026-12-07 17:51:46', '2027-02-07 10:51:46', 63979278621, 100),
('evt-EMP-FAC-049-0', 'EMP-FAC-049', 'Preparation', '2026-03-26 13:27:47', '2026-04-26 06:27:47', 25310464563, 100),
('evt-EMP-FAC-049-1', 'EMP-FAC-049', 'Execution', '2026-04-26 06:27:47', '2026-05-25 23:27:47', 25310464563, 100),
('evt-EMP-FAC-049-2', 'EMP-FAC-049', 'Reporting', '2026-05-25 23:27:47', '2026-06-25 16:27:47', 25310464563, 100),
('evt-EMP-FAC-050-0', 'EMP-FAC-050', 'Preparation', '2026-10-07 22:13:11', '2026-12-07 15:13:11', 39303092033.666664, 60),
('evt-EMP-FAC-050-1', 'EMP-FAC-050', 'Execution', '2026-12-07 15:13:11', '2027-02-07 08:13:11', 39303092033.666664, 97),
('evt-EMP-FAC-050-2', 'EMP-FAC-050', 'Reporting', '2027-02-07 08:13:11', '2027-04-07 01:13:11', 39303092033.666664, 78),
('evt-EMP-OPE-001-0', 'EMP-OPE-001', 'Preparation', '2026-06-11 01:46:54', '2026-07-10 18:46:54', 28966424266.666668, 44),
('evt-EMP-OPE-001-1', 'EMP-OPE-001', 'Execution', '2026-07-10 18:46:54', '2026-08-10 11:46:54', 28966424266.666668, 88),
('evt-EMP-OPE-001-2', 'EMP-OPE-001', 'Reporting', '2026-08-10 11:46:54', '2026-09-10 04:46:54', 28966424266.666668, 41),
('evt-EMP-OPE-005-0', 'EMP-OPE-005', 'Preparation', '2026-04-07 06:01:18', '2026-05-06 23:01:18', 17996113467.666668, 8),
('evt-EMP-OPE-005-1', 'EMP-OPE-005', 'Execution', '2026-05-06 23:01:18', '2026-06-06 16:01:18', 17996113467.666668, 28),
('evt-EMP-OPE-005-2', 'EMP-OPE-005', 'Reporting', '2026-06-06 16:01:18', '2026-07-06 09:01:18', 17996113467.666668, 43),
('evt-EMP-OPE-008-0', 'EMP-OPE-008', 'Preparation', '2026-05-05 23:53:57', '2026-06-05 16:53:57', 31084600838.666668, 94),
('evt-EMP-OPE-008-1', 'EMP-OPE-008', 'Execution', '2026-06-05 16:53:57', '2026-07-05 09:53:57', 31084600838.666668, 18),
('evt-EMP-OPE-008-2', 'EMP-OPE-008', 'Reporting', '2026-07-05 09:53:57', '2026-08-05 02:53:57', 31084600838.666668, 44),
('evt-EMP-OPE-013-0', 'EMP-OPE-013', 'Preparation', '2026-05-30 06:54:39', '2026-07-29 23:54:39', 13924554551.666666, 20),
('evt-EMP-OPE-013-1', 'EMP-OPE-013', 'Execution', '2026-07-29 23:54:39', '2026-09-29 16:54:39', 13924554551.666666, 27),
('evt-EMP-OPE-013-2', 'EMP-OPE-013', 'Reporting', '2026-09-29 16:54:39', '2026-11-29 09:54:39', 13924554551.666666, 0),
('evt-EMP-OPE-017-0', 'EMP-OPE-017', 'Preparation', '2026-09-27 10:36:02', '2026-10-27 03:36:02', 27906997679, 2),
('evt-EMP-OPE-017-1', 'EMP-OPE-017', 'Execution', '2026-10-27 03:36:02', '2026-11-26 20:36:02', 27906997679, 79),
('evt-EMP-OPE-017-2', 'EMP-OPE-017', 'Reporting', '2026-11-26 20:36:02', '2026-12-26 13:36:02', 27906997679, 33),
('evt-EMP-OPE-019-0', 'EMP-OPE-019', 'Preparation', '2026-10-25 09:51:10', '2027-01-25 02:51:10', 2569413934.6666665, 69),
('evt-EMP-OPE-019-1', 'EMP-OPE-019', 'Execution', '2027-01-25 02:51:10', '2027-04-24 19:51:10', 2569413934.6666665, 29),
('evt-EMP-OPE-019-2', 'EMP-OPE-019', 'Reporting', '2027-04-24 19:51:10', '2027-07-24 12:51:10', 2569413934.6666665, 18),
('evt-EMP-OPE-021-0', 'EMP-OPE-021', 'Preparation', '2026-06-09 01:42:58', '2026-08-08 18:42:58', 26667376670, 10),
('evt-EMP-OPE-021-1', 'EMP-OPE-021', 'Execution', '2026-08-08 18:42:58', '2026-10-08 11:42:58', 26667376670, 51),
('evt-EMP-OPE-021-2', 'EMP-OPE-021', 'Reporting', '2026-10-08 11:42:58', '2026-12-08 04:42:58', 26667376670, 82),
('evt-EMP-OPE-033-0', 'EMP-OPE-033', 'Preparation', '2026-11-05 20:26:34', '2027-01-05 13:26:34', 14687564900.333334, 26),
('evt-EMP-OPE-033-1', 'EMP-OPE-033', 'Execution', '2027-01-05 13:26:34', '2027-03-05 06:26:34', 14687564900.333334, 32),
('evt-EMP-OPE-033-2', 'EMP-OPE-033', 'Reporting', '2027-03-05 06:26:34', '2027-05-04 23:26:34', 14687564900.333334, 12),
('evt-EMP-OPE-036-0', 'EMP-OPE-036', 'Preparation', '2026-07-02 17:41:50', '2026-10-02 10:41:50', 10628383315.666666, 100),
('evt-EMP-OPE-036-1', 'EMP-OPE-036', 'Execution', '2026-10-02 10:41:50', '2027-01-02 03:41:50', 10628383315.666666, 100),
('evt-EMP-OPE-036-2', 'EMP-OPE-036', 'Reporting', '2027-01-02 03:41:50', '2027-04-01 20:41:50', 10628383315.666666, 100),
('evt-EMP-OPE-040-0', 'EMP-OPE-040', 'Preparation', '2026-08-22 19:18:33', '2026-10-22 12:18:33', 15181258257.666666, 81),
('evt-EMP-OPE-040-1', 'EMP-OPE-040', 'Execution', '2026-10-22 12:18:33', '2026-12-22 05:18:33', 15181258257.666666, 98),
('evt-EMP-OPE-040-2', 'EMP-OPE-040', 'Reporting', '2026-12-22 05:18:33', '2027-02-21 22:18:33', 15181258257.666666, 81),
('evt-EMP-OPE-048-0', 'EMP-OPE-048', 'Preparation', '2026-03-13 23:59:12', '2026-04-13 16:59:12', 32186530836.333332, 19),
('evt-EMP-OPE-048-1', 'EMP-OPE-048', 'Execution', '2026-04-13 16:59:12', '2026-05-13 09:59:12', 32186530836.333332, 29),
('evt-EMP-OPE-048-2', 'EMP-OPE-048', 'Reporting', '2026-05-13 09:59:12', '2026-06-13 02:59:12', 32186530836.333332, 42);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `issues`
--
ALTER TABLE `issues`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projectId` (`projectId`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `projectCode` (`projectCode`);

--
-- Indexes for table `project_members`
--
ALTER TABLE `project_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projectId` (`projectId`),
  ADD KEY `employeeId` (`employeeId`);

--
-- Indexes for table `project_metrics`
--
ALTER TABLE `project_metrics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projectId` (`projectId`);

--
-- Indexes for table `task_milestones`
--
ALTER TABLE `task_milestones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `timelineEventId` (`timelineEventId`);

--
-- Indexes for table `timeline_events`
--
ALTER TABLE `timeline_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projectId` (`projectId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `issues`
--
ALTER TABLE `issues`
  ADD CONSTRAINT `issues_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_members`
--
ALTER TABLE `project_members`
  ADD CONSTRAINT `project_members_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_members_ibfk_2` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_metrics`
--
ALTER TABLE `project_metrics`
  ADD CONSTRAINT `project_metrics_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `task_milestones`
--
ALTER TABLE `task_milestones`
  ADD CONSTRAINT `task_milestones_ibfk_1` FOREIGN KEY (`timelineEventId`) REFERENCES `timeline_events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `timeline_events`
--
ALTER TABLE `timeline_events`
  ADD CONSTRAINT `timeline_events_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
