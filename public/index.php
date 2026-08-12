<?php

// #region 1.
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Autent-Type, Access-Control-Allow-Header, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    http_response_code(200);
    exit;
}
// #endregion


// #region 2. 
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../src/Services/BrapiServices.php';
require_once __DIR__ . '/../src/Controllers/AlertController.php';

$method = $_SERVER['REQUEST_METHOD'];
$path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
// #endregion

// #region 3. Instanciação dos Controllers
$alertController = new AlertController($pdo);
$brapiService     = new BrapiService();
// #endregion

// #region --- ROTAS ---

// GET /api/cotacao?ticker=PETR4
if ($method === 'GET' && $path === '/api/cotacao') {
    $ticker = $_GET['ticker'] ?? 'PETR4'; //?? é o operador de coalescência nula  tipo if/else
    $dados  = $brapiService->buscarCotacao($ticker);
    echo json_encode($dados);
    exit;
}

// GET /api/alertas
if ($method === 'GET' && $path === '/api/alertas') {
    $alertController->listar();
    exit;
}

// POST /api/alertas
if ($method === 'POST' && $path === '/api/alertas') {
    $alertController->criar();
    exit;
}

// DELETE /api/alertas OU /api/alertas/{id}
if ($method === 'DELETE' && strpos($path, '/api/alertas') === 0) {

    // 1. Tenta pegar o ID direto do caminho (/api/alertas/{id})
    $partes = explode('/', trim($path, '/'));
    $id = end($partes);

    // 2. Se o último elemento não for numérico, tenta pegar do $_GET (?id=3)
    if (!is_numeric($id)) {
        $id = $_GET['id'] ?? null;
    }

    if ($id && is_numeric($id)) {
        $alertController->deletar((int)$id);
    } else {
        http_response_code(400);
        echo json_encode(['sucesso' => false, 'mensagem' => 'ID do alerta não fornecido ou inválido.']);
    }
    exit;
}

// Rota não encontrada
http_response_code(404);
echo json_encode(['sucesso' => false, 'mensagem' => 'Rota não encontrada.']);

// #endregion