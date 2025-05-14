<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Manejar preflight
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

        $cita->getId() > 0 
            ? $this->model->actualizar($cita)
            : $this->model->registrar($cita);

        echo json_encode(["status" => "success"]);
    }

    public function eliminar() {
        $this->model->eliminar($_REQUEST['id']);
        echo json_encode(["status" => "deleted"]);
    }

    public function cambiarEstado() {
        $id = $_REQUEST['id'];
        $estado = $_REQUEST['estado'];
        $this->model->actualizarEstado($id, $estado);
        echo json_encode(["status" => "updated"]);
    }

    public function obtener() {
        $cita = $this->model->obtener($_REQUEST['id']);
        echo json_encode($cita);
    }

  public function getByUser() {
    error_log("Entrando en getByUser");
    session_start();

    // Verificar que la sesión tiene el user_id
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "No autenticado"]);
        return;
    }

    $userId = $_SESSION['user_id'];
    $citas = $this->model->listarPorUsuario($userId);

    // Log para verificar que se están devolviendo citas
    error_log('Citas devueltas: ' . print_r($citas, true));

    // Asegúrate de devolver un JSON válido
    echo json_encode($citas);
}

}

$controller = new CitaController();

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

// Combina datos JSON con $_REQUEST por compatibilidad
$_REQUEST = array_merge($_REQUEST, $data ?? []);

$action = $_REQUEST['action'] ?? 'index';


if (method_exists($controller, $action)) {
    $controller->$action();
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Acción inválida"]);
}








