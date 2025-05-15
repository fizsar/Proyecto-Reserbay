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
require_once '../model/ServicioDAO.php';
require_once '../model/entidades/Servicio.php';

class ServicioController {
    private $model;

    public function __construct() {
        $this->model = new ServicioDAO();
    }

    public function index() {
        echo json_encode($this->model->listar());
    }

    public function guardar() {
        $servicio = new Servicio();
        $servicio->setId($_REQUEST['id'] ?? 0);
        $servicio->setNombre($_REQUEST['nombre']);
        $servicio->setDuracion($_REQUEST['duracion']);
        $servicio->setPrecio($_REQUEST['precio']);

        $servicio->getId() > 0 
            ? $this->model->actualizar($servicio)
            : $this->model->registrar($servicio);

        echo json_encode(["status" => "success"]);
    }

    public function eliminar() {
        $this->model->eliminar($_REQUEST['id']);
        echo json_encode(["status" => "deleted"]);
    }

    public function obtener() {
        $servicio = $this->model->obtener($_REQUEST['id']);
        echo json_encode($servicio);
    }
}
$controller = new ServicioController();

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$_REQUEST = array_merge($_REQUEST, $data ?? []);

$action = $_REQUEST['action'] ?? 'index';

if (method_exists($controller, $action)) {
    $controller->$action();
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Acción inválida"]);
}