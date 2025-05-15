<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../model/HorarioDAO.php';
require_once '../model/entidades/Horario.php';

class HorarioController {
    private $model;

    public function __construct() {
        $this->model = new HorarioDAO();
    }

    public function index() {
        echo json_encode($this->model->listar());
    }

    public function guardar() {
        $horario = new Horario();
        $horario->setId($_REQUEST['id'] ?? 0);
        $horario->setUserId($_REQUEST['user_id']);
        $horario->setDiaSemana($_REQUEST['dia_semana']);
        $horario->setHoraInicio($_REQUEST['hora_inicio']);
        $horario->setHoraFin($_REQUEST['hora_fin']);

        $horario->getId() > 0 
            ? $this->model->actualizar($horario)
            : $this->model->registrar($horario);

        echo json_encode(["status" => "success"]);
    }

    public function eliminar() {
        $this->model->eliminar($_REQUEST['id']);
        echo json_encode(["status" => "deleted"]);
    }

    public function obtener() {
        $horario = $this->model->obtener($_REQUEST['id']);
        echo json_encode($horario);
    }
    public function obtenerPorEmpleadoYDia() {
    $empleadoId = $_GET['empleado_id'];
    $diaSemana = $_GET['dia_semana'];
    $horarios = $this->model->obtenerPorEmpleadoYDia($empleadoId, $diaSemana);
    echo json_encode($horarios);
}

}
if ($action === 'obtenerPorEmpleadoYDia') {
    $controller->obtenerPorEmpleadoYDia();
    exit();
}
