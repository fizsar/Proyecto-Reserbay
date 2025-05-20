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
    // Leer JSON del cuerpo
    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(["error" => "Datos JSON inválidos"]);
        exit();
    }

    // Validar campos obligatorios
    $required = ['nombre', 'email', 'password', 'rol'];
    foreach ($required as $campo) {
        if (empty($input[$campo])) {
            http_response_code(400);
            echo json_encode(["error" => "El campo '$campo' es obligatorio"]);
            exit();
        }
    }

    // Validar rol válido
    if (!in_array($input['rol'], ['cliente', 'personal'])) {
        http_response_code(400);
        echo json_encode(["error" => "Rol inválido"]);
        exit();
    }

    // Validar que email no esté registrado
    $existente = $this->model->getByEmail($input['email']);
    if ($existente && (!$input['id'] || $existente->getId() != $input['id'])) {
        http_response_code(409);
        echo json_encode(["error" => "El email ya está registrado"]);
        exit();
    }

    $user = new User();
    $user->setId($input['id'] ?? 0);
    $user->setNombre($input['nombre']);
    $user->setEmail($input['email']);
    // Si viene id y password vacío no se actualiza la contraseña
    if (!empty($input['password'])) {
        $user->setPassword(password_hash($input['password'], PASSWORD_DEFAULT));
    } else if ($user->getId() > 0) {
        // En edición sin password, mantener actual
        $userActual = $this->model->obtener($user->getId());
        $user->setPassword($userActual->getPassword());
    } else {
        http_response_code(400);
        echo json_encode(["error" => "La contraseña es obligatoria"]);
        exit();
    }
    $user->setRol($input['rol']);

    if ($user->getId() > 0) {
        $this->model->actualizar($user);
    } else {
        $this->model->registrar($user);
    }

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