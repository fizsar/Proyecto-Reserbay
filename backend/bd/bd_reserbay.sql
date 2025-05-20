reserbay_db-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-05-2025 a las 12:59:17
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `reserbay_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `servicio_id` int(11) NOT NULL,
  `personal_id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` enum('pendiente','aceptada','cancelada') NOT NULL DEFAULT 'pendiente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`id`, `user_id`, `servicio_id`, `personal_id`, `fecha`, `hora`, `estado`, `created_at`, `updated_at`) VALUES
(12, 1, 1, 3, '2025-05-16', '16:00:00', 'aceptada', NULL, NULL),
(13, 1, 1, 3, '2024-12-01', '10:00:00', 'cancelada', NULL, NULL),
(15, 1, 1, 3, '2025-05-16', '17:00:00', 'cancelada', NULL, NULL),
(16, 1, 1, 3, '2025-05-16', '14:00:00', 'aceptada', NULL, NULL),
(17, 1, 1, 3, '2025-05-20', '10:00:00', 'aceptada', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios`
--

CREATE TABLE `horarios` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `horarios`
--

INSERT INTO `horarios` (`id`, `user_id`, `fecha`, `hora_inicio`, `hora_fin`, `created_at`, `updated_at`) VALUES
(1, 3, NULL, '09:00:00', '13:00:00', '2025-05-13 11:08:27', '2025-05-13 11:08:27'),
(2, 3, NULL, '14:00:00', '18:00:00', '2025-05-13 11:08:27', '2025-05-13 11:08:27'),
(3, 4, NULL, '10:00:00', '15:00:00', '2025-05-13 11:08:27', '2025-05-13 11:08:27'),
(4, 4, NULL, '10:00:00', '15:00:00', '2025-05-13 11:08:27', '2025-05-13 11:08:27'),
(5, 3, '2025-05-15', '09:00:00', '13:00:00', NULL, NULL),
(6, 3, '2025-05-16', '14:00:00', '18:00:00', NULL, NULL),
(7, 3, '2025-05-20', '10:00:00', '15:00:00', NULL, NULL),
(8, 3, '2025-05-21', '09:00:00', '10:00:00', NULL, NULL),
(9, 3, '2025-05-21', '10:00:00', '11:00:00', NULL, NULL),
(10, 3, '2025-05-21', '11:00:00', '12:00:00', NULL, NULL),
(11, 3, '2025-05-21', '12:00:00', '13:00:00', NULL, NULL),
(12, 3, '2025-05-21', '10:00:00', '11:00:00', NULL, NULL),
(13, 3, '2025-05-21', '09:00:00', '10:00:00', NULL, NULL),
(14, 3, '2025-05-21', '09:00:00', '10:00:00', NULL, NULL),
(15, 3, '2025-05-21', '09:00:00', '10:00:00', NULL, NULL),
(16, 3, '2025-05-20', '09:00:00', '10:00:00', NULL, NULL),
(17, 3, '2025-05-20', '11:00:00', '12:00:00', NULL, NULL),
(18, 3, '2025-05-20', '12:00:00', '13:00:00', NULL, NULL),
(19, 3, '2025-05-20', '13:00:00', '14:00:00', NULL, NULL),
(20, 3, '2025-05-20', '14:00:00', '15:00:00', NULL, NULL),
(21, 3, '2025-05-20', '15:00:00', '16:00:00', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `duracion` int(11) NOT NULL,
  `precio` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id`, `nombre`, `duracion`, `precio`, `created_at`, `updated_at`) VALUES
(1, 'Corte de Cabello', 30, 15.00, '2025-05-13 11:08:26', '2025-05-13 11:08:26'),
(2, 'Manicura', 45, 20.00, '2025-05-13 11:08:26', '2025-05-13 11:08:26'),
(3, 'Masaje Relajante', 60, 50.00, '2025-05-13 11:08:26', '2025-05-13 11:08:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('cliente','personal') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nombre`, `email`, `password`, `rol`, `created_at`, `updated_at`) VALUES
(1, 'Juan Pérez', 'juan@example.com', '$2a$12$lcy4mO3FzLhrTH4gIpMJTOxoql3Ax1BIf15QyS0nZ4IsQn.WuTbD2', 'cliente', '2025-05-13 11:08:26', '2025-05-13 11:08:26'),
(2, 'Ana García', 'ana@example.com', '$2a$12$UYO7g8kEYzgs4oWrHFLISewUaSi2Fk7LndaN4m0zC9fCur3ssOvyy', 'cliente', '2025-05-13 11:08:26', '2025-05-13 11:08:26'),
(3, 'Carlos Ruiz', 'carlos@example.com', '$2a$12$ysO2UOunaI87y7SFVCX21u2x2fJQ8JGEtQB5lVPsegSem4m6MMjCm', 'personal', '2025-05-13 11:08:26', '2025-05-13 11:08:26'),
(4, 'Lucía Torres', 'lucia@example.com', '$2a$12$SJrZRgecnIpYA3oyMzA2QO8mKIVlTOw5OO0hoioXinPGmwmMtIYW2', 'personal', '2025-05-13 11:08:26', '2025-05-13 11:08:26'),
(5, 'juan rodriguez', 'juanr@example.com', '$2y$10$6dLM9Bu3rsYhbeXFG5Vqd.v9WlEKz3pwnC4HBZHe8mhZMYGgL4iCa', 'personal', NULL, NULL),
(6, 'jose', 'jose@example.com', '$2y$10$dd33sTsz4LFx4KeJ5Qj2A.z9yc2cH7Ame95E6Gmq6.HxdRm14dYxK', 'cliente', NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_citas_user` (`user_id`),
  ADD KEY `fk_citas_servicio` (`servicio_id`),
  ADD KEY `fk_citas_personal` (`personal_id`);

--
-- Indices de la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_horarios_user` (`user_id`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `fk_citas_personal` FOREIGN KEY (`personal_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_citas_servicio` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_citas_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD CONSTRAINT `fk_horarios_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
