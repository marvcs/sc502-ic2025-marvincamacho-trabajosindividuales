<?php
require('db.php');
session_start();

header('Content-Type: application/json');

function getJsonInput()
{
    return json_decode(file_get_contents("php://input"), true);
}

function validateCommentInput($input)
{
    return isset($input['comment']) && isset($input['task_id']);
}

function createComment($comment, $task_id)
{
    global $pdo;
    try {
        $sql = "INSERT INTO comments (comment, task_id) VALUES (:comment, :task_id)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'comment' => $comment,
            'task_id' => $task_id
        ]);
        return $pdo->lastInsertId();
    } catch (Exception $e) {
        echo $e->getMessage();
        return 0;
    }
}

function getCommentsByTask($taskId)
{
    global $pdo;
    try {
        $sql = "SELECT * FROM comments WHERE task_id = :task_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['task_id' => $taskId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        echo $e->getMessage();
        return [];
    }
}

function updateComment($id, $comment) //id del comentario a editar, y el nuevo comentario
{
    global $pdo;
    try {
        $sql = "UPDATE comments SET comment = :comment WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'comment' => $comment,
            'id' => $id
        ]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        echo $e->getMessage();
        return false;
    }
}

function deleteComment($id)
{
    global $pdo;
    try {
        $sql = "DELETE FROM comments WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        echo $e->getMessage();
        return false;
    }
}

// Check session
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "Sesión no activa"]);
    exit;
}

// Handle methods
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            if (isset($_GET['task_id'])) {
                $comments = getCommentsByTask($_GET['task_id']);
                echo json_encode($comments);
            } else {
                http_response_code(400);
                echo json_encode(['error' => "task_id no proporcionado"]);
            }
            break;

        case 'POST':
            $input = getJsonInput();
            if (validateCommentInput($input)) {
                $commentId = createComment($input['comment'], task_id: $input['task_id']);
                if ($commentId > 0) {
                    http_response_code(201);
                    echo json_encode(["message" => "Comentario creado", "id" => $commentId]);
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Error al crear el comentario"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        case 'PUT':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => "ID del comentario no proporcionado"]);
                break;
            }
            $input = getJsonInput();
            if (isset($input['comment'])) {
                if (updateComment($_GET['id'], $input['comment'])) {
                    echo json_encode(["message" => "Comentario actualizado"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "No se pudo actualizar el comentario"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Campo 'comment' requerido"]);
            }
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => "ID del comentario no proporcionado"]);
                break;
            }
            if (deleteComment($_GET['id'])) {
                echo json_encode(["message" => "Comentario eliminado"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "No se pudo eliminar el comentario"]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Método no permitido"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error en el servidor"]);
}
