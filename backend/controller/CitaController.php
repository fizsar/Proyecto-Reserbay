<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../model/CitaDAO.php';
require_once '../model/entidades/Cita.php';

class CitaController {
    private $model;

    public function __construct() {
        $this->model = new CitaDAO();
    }

    public function index() {
        echo json_encode($this->model->listar());
    }

    public function guardar() {
        $cita = new Cita();
        $cita->setId($_REQUEST['id'] ?? 0);
        $cita->setUserId($_REQUEST['user_id']);
        $cita->setServicioId($_REQUEST['servicio_id']);
        $cita->setPersonalId($_REQUEST['personal_id']);
        $cita->setFecha($_REQUEST['fecha']);
        $cita->setHora($_REQUEST['hora']);
        $cita->setEstado($_REQUEST['estado'] ?? 'pendiente');

        if ($cita->getId() == 0) {
            $disponible = $this->model->estaDisponible(
                $cita->getPersonalId(),
                $cita->getFecha(),
                $cita->getHora()
            );

            if (!$disponible) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Este horario ya está reservado para este personal."
                ]);
                return;
            }

            $this->model->registrar($cita);
        } else {
            $this->model->actualizar($cita);
        }

        echo json_encode(["status" => "success"]);
    }

    public function eliminar() {
        $this->model->eliminar($_REQUEST['id']);
        echo json_encode(["status" => "deleted"]);
    }

    public function cambiarEstado() {
    // Lee datos JSON del body
    $input = json_decode(file_get_contents('php://input'), true);

    $id = $input['id'] ?? null;
    $estado = $input['estado'] ?? null;

    if (!$id || !$estado) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Parámetros faltantes']);
        return;
    }

    $this->model->actualizarEstado($id, $estado);
    echo json_encode(['status' => 'updated']);
}

    public function obtener() {
        $cita = $this->model->obtener($_REQUEST['id']);
        echo json_encode($cita);
    }

    public function getByUser() {
    session_start();

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "No autenticado"]);
        return;
    }

    $userId = $_SESSION['user_id'];
    $citas = $this->model->listarPorUsuario($userId);
    echo json_encode($citas);
}


    public function obtenerHorasOcupadas() {
        $empleadoId = $_GET['empleado_id'];
        $fecha = $_GET['fecha'];
        $horas = $this->model->obtenerHorasReservadas($empleadoId, $fecha);
        echo json_encode(array_values($horas));
    }

    public function horas_disponibles() {
        $personal_id = $_GET['personal_id'] ?? null;
        $fecha = $_GET['fecha'] ?? null;

        if (!$personal_id || !$fecha) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Parámetros insuficientes"]);
            return;
        }

        $horas = $this->model->getHorasDisponibles($personal_id, $fecha);
        echo json_encode($horas);
    }
     public function getByEmpleado() {
        session_start();
        if (!isset($_SESSION['user_id']) || $_SESSION['rol'] !== 'personal') {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'No autorizado']);
            return;
        }

        $empleadoId = $_SESSION['user_id'];
        $citas = $this->model->listarPorEmpleado($empleadoId);

        echo json_encode($citas);
    }

}

$controller = new CitaController();

// Unifica datos JSON con $_REQUEST
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$_REQUEST = array_merge($_REQUEST, $data ?? []);

// Ejecuta acción
$action = $_REQUEST['action'] ?? 'index';

if (method_exists($controller, $action)) {
    $controller->$action();
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Acción inválida"]);
}
