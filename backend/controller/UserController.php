<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

require_once '../model/UserDAO.php';
require_once '../model/entidades/User.php';

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class UserController {
    private $model;

    public function __construct() {
        $this->model = new UserDAO();
    }

    public function index() {
        echo json_encode($this->model->listar());
    }

    public function guardar() {
        $user = new User();
        $user->setId($_REQUEST['id'] ?? 0);
        $user->setNombre($_REQUEST['nombre']);
        $user->setEmail($_REQUEST['email']);
        $user->setPassword(password_hash($_REQUEST['password'], PASSWORD_DEFAULT));
        $user->setRol($_REQUEST['rol']);

        $user->getId() > 0 
            ? $this->model->actualizar($user)
            : $this->model->registrar($user);

        echo json_encode(["status" => "success"]);
    }

    public function eliminar() {
        $this->model->eliminar($_REQUEST['id']);
        echo json_encode(["status" => "deleted"]);
    }

    public function obtener() {
        $user = $this->model->obtener($_REQUEST['id']);
        echo json_encode($user);
    }

    public function empleados() {
    $empleados = $this->model->listarEmpleados();
    echo json_encode($empleados);
}

}
$controller = new UserController();

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