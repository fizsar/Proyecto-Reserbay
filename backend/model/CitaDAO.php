<?php

require_once '../bd/database.php';
require_once '../model/entidades/Cita.php';

class CitaDAO {
    private $pdo;

    public function __construct() {
        try{
        $this->pdo = Database::connect();}
        catch (Exception $ex) {
            die($ex->getMessage());
        }
    }

    public function listar() {
        $stm = $this->pdo->prepare("SELECT * FROM citas");
        $stm->execute();
        return $stm->fetchAll(PDO::FETCH_CLASS, "Cita");
    }

    public function obtener($id) {
        $stm = $this->pdo->prepare("SELECT * FROM citas WHERE id = ?");
        $stm->execute([$id]);
        return $stm->fetchObject("Cita");
    }

    public function registrar(Cita $cita) {
        $sql = "INSERT INTO citas (user_id, servicio_id, personal_id, fecha, hora, estado) VALUES (?, ?, ?, ?, ?, ?)";
        $this->pdo->prepare($sql)->execute([
            $cita->getUserId(),
            $cita->getServicioId(),
            $cita->getPersonalId(),
            $cita->getFecha(),
            $cita->getHora(),
            $cita->getEstado()
        ]);
    }

    public function actualizar(Cita $cita) {
        $sql = "UPDATE citas SET user_id = ?, servicio_id = ?, personal_id = ?, fecha = ?, hora = ?, estado = ? WHERE id = ?";
        $this->pdo->prepare($sql)->execute([
            $cita->getUserId(),
            $cita->getServicioId(),
            $cita->getPersonalId(),
            $cita->getFecha(),
            $cita->getHora(),
            $cita->getEstado(),
            $cita->getId()
        ]);
    }

    public function eliminar($id) {
        $stm = $this->pdo->prepare("DELETE FROM citas WHERE id = ?");
        $stm->execute([$id]);
    }

    public function actualizarEstado($id, $estado)
{
    try {
        $sql = "UPDATE citas SET estado = ? WHERE id = ?";
        $this->pdo->prepare($sql)
                  ->execute([$estado, $id]);
    } catch (Exception $e) {
        die($e->getMessage());
    }
}

  public function listarPorUsuario($userId) {
    $stmt = $this->pdo->prepare("
        SELECT 
            c.id,
            s.nombre AS servicio,
            s.precio,
            c.fecha,
            c.hora,
            c.estado,
            u.nombre AS empleado
        FROM citas c
        INNER JOIN servicios s ON c.servicio_id = s.id
        INNER JOIN users u ON c.personal_id = u.id
        WHERE c.user_id = ?
        ORDER BY c.fecha DESC, c.hora DESC
    ");
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}



public function estaDisponible($personalId, $fecha, $hora) {
    $sql = "SELECT COUNT(*) FROM citas 
            WHERE personal_id = ? 
              AND fecha = ? 
              AND hora = ? 
              AND estado != 'cancelada'";
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute([$personalId, $fecha, $hora]);
    return $stmt->fetchColumn() == 0; // true si está disponible
}

    public function obtenerHorasReservadas($empleadoId, $fecha) {
    $sql = "SELECT hora FROM citas 
            WHERE personal_id = ? AND fecha = ?";
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute([$empleadoId, $fecha]);
    return $stmt->fetchAll(PDO::FETCH_COLUMN);
}

public function getHorasDisponibles($personal_id, $fecha) {
    $stmt = $this->pdo->prepare("SELECT hora_inicio, hora_fin FROM horarios WHERE user_id = ? AND fecha = ?");
    $stmt->execute([$personal_id, $fecha]);
    $horario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$horario) {
        return []; // No hay disponibilidad ese día
    }

    $horaInicio = new DateTime($horario['hora_inicio']);
    $horaFin = new DateTime($horario['hora_fin']);
    $intervalo = new DateInterval('PT1H');
    $periodo = new DatePeriod($horaInicio, $intervalo, $horaFin);

    $horas = [];
    foreach ($periodo as $hora) {
        $horas[] = $hora->format('H:i');
    }

    $ocupadas = $this->obtenerHorasReservadas($personal_id, $fecha);
    return array_values(array_filter($horas, fn($h) => !in_array($h, $ocupadas)));
}


}
