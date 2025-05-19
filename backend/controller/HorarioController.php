<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start(); // Iniciar sesión para obtener user_id

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

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
    // Obtener el user_id de la sesión
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Usuario no autenticado"]);
        exit();
    }
    $user_id = $_SESSION['user_id'];

    // Leer JSON del cuerpo de la petición
    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(["error" => "No se recibieron datos JSON válidos"]);
        exit();
    }

    $horarios = [];
    if (isset($input[0])) {
        $horarios = $input;
    } else {
        $horarios[] = $input;
    }

    $errores = [];

    foreach ($horarios as $index => $horarioData) {
        // Validar campos necesarios
        $required = ['fecha', 'hora_inicio', 'hora_fin'];
        foreach ($required as $key) {
            if (empty($horarioData[$key])) {
                $errores[] = "El campo '$key' es obligatorio en el horario índice $index";
            }
        }
        // Validar que si viene user_id en datos, coincida con sesión
        if (isset($horarioData['user_id']) && $horarioData['user_id'] != $user_id) {
            $errores[] = "No está permitido asignar horarios a otro usuario (índice $index)";
        }
    }

    if (count($errores) > 0) {
        http_response_code(400);
        echo json_encode(["error" => $errores]);
        return;
    }

    // Validar que no existan horarios duplicados antes de insertar
    foreach ($horarios as $index => $horarioData) {
        if ($this->model->existeHorario($user_id, $horarioData['fecha'], $horarioData['hora_inicio'])) {
            http_response_code(400);
            echo json_encode([
                "error" => "Ya existe disponibilidad para la fecha {$horarioData['fecha']} y hora {$horarioData['hora_inicio']} (índice $index)"
            ]);
            return; // salir para evitar inserciones duplicadas
        }
    }

    // Insertar horarios
    foreach ($horarios as $horarioData) {
        $horario = new Horario();
        $horario->setId($horarioData['id'] ?? 0);
        $horario->setUserId($user_id); // usar siempre user_id de sesión
        $horario->setFecha($horarioData['fecha']);
        $horario->setHoraInicio($horarioData['hora_inicio']);
        $horario->setHoraFin($horarioData['hora_fin']);

        if ($horario->getId() > 0) {
            $this->model->actualizar($horario);
        } else {
            $this->model->registrar($horario);
        }
    }

    echo json_encode(["status" => "success"]);
}


    public function eliminar() {
        $id = $_REQUEST['id'] ?? null;
        if ($id === null) {
            http_response_code(400);
            echo json_encode(["error" => "ID no proporcionado"]);
            return;
        }

        $this->model->eliminar($id);
        echo json_encode(["status" => "deleted"]);
    }

    public function obtener() {
        $id = $_REQUEST['id'] ?? null;
        if ($id === null) {
            http_response_code(400);
            echo json_encode(["error" => "ID no proporcionado"]);
            return;
        }

        $horario = $this->model->obtener($id);
        echo json_encode($horario);
    }

    public function obtenerPorEmpleadoYDia() {
        $empleadoId = $_GET['empleado_id'] ?? null;
        $fecha = $_GET['fecha'] ?? null;

        if (!$empleadoId || !$fecha) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan parámetros"]);
            return;
        }

        // NUEVO: validar que el empleadoId sea el del usuario logueado
        if (!isset($_SESSION['user_id']) || $empleadoId != $_SESSION['user_id']) {
            http_response_code(403);
            echo json_encode(["error" => "Acceso denegado"]);
            return;
        }

        $horarios = $this->model->obtenerPorEmpleadoYDia($empleadoId, $fecha);
        echo json_encode($horarios);
    }
}

$controller = new HorarioController();
$action = $_GET['action'] ?? $_POST['action'] ?? 'index';

switch ($action) {
    case 'index':
        $controller->index();
        break;
    case 'guardar':
        $controller->guardar();
        break;
    case 'eliminar':
        $controller->eliminar();
        break;
    case 'obtener':
        $controller->obtener();
        break;
    case 'obtenerPorEmpleadoYDia':
        $controller->obtenerPorEmpleadoYDia();
        break;
    default:
        http_response_code(400);
        echo json_encode(["error" => "Acción no válida"]);
        break;
}
