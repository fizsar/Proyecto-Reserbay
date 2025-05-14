<?php
// Mostrar errores (solo en desarrollo)
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

require_once '../model/UserDAO.php';
require_once '../model/entidades/User.php';

class AuthController
{
    private $userDAO;

    public function __construct()
    {
        session_start();
        $this->userDAO = new UserDAO();
    }

    public function login()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['email']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Faltan campos"]);
            return;
        }

        $email = $data['email'];
        $password = $data['password'];

        $user = $this->userDAO->getByEmail($email);

        if ($user && password_verify($password, $user->getPassword())) {
            $_SESSION['user_id'] = $user->getId();
            $_SESSION['nombre'] = $user->getNombre();
            $_SESSION['rol'] = $user->getRol();

            echo json_encode([
                "status" => "success",
                "message" => "Login exitoso",
                "user" => [
                    "id" => $user->getId(),
                    "nombre" => $user->getNombre(),
                    "rol" => $user->getRol()
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Credenciales incorrectas"]);
        }
    }

    public function logout()
    {
        session_unset();
        session_destroy();
        echo json_encode(["status" => "success", "message" => "Sesión cerrada"]);
    }

    public function checkSession()
    {
        if (isset($_SESSION['user_id'])) {
            echo json_encode([
                "status" => "active",
                "user" => [
                    "id" => $_SESSION['user_id'],
                    "nombre" => $_SESSION['nombre'],
                    "rol" => $_SESSION['rol']
                ]
            ]);
        } else {
            echo json_encode(["status" => "inactive"]);
        }
    }
}

// Enrutamiento manual
$controller = new AuthController();
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        $controller->login();
        break;
    case 'logout':
        $controller->logout();
        break;
    case 'checkSession':
        $controller->checkSession();
        break;
    default:
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Acción no válida"]);
        break;
}
