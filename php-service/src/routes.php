<?php

use Slim\App;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use TestMind\UserService;

return function (App $app) {

    $app->options('/{routes:.*}', function (Request $request, Response $response) {
        return $response;
    });

    $app->add(function (Request $request, Response $response, $next) {
        $response = $next($request, $response);
        return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    });

    $app->get('/api/health', function (Request $request, Response $response) {
        $data = [
            'success' => true,
            'message' => 'TestMind PHP Service is running',
            'data' => null,
            'timestamp' => time()
        ];
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->get('/api/v1/users', function (Request $request, Response $response) {
        $users = UserService::getAllUsers();
        $data = [
            'success' => true,
            'message' => 'Success',
            'data' => $users,
            'timestamp' => time()
        ];
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->get('/api/v1/users/{id}', function (Request $request, Response $response, array $args) {
        $user = UserService::getUserById($args['id']);
        if (!$user) {
            $data = [
                'success' => false,
                'message' => 'User not found',
                'data' => null,
                'timestamp' => time()
            ];
            return $response->withStatus(404)
                ->withHeader('Content-Type', 'application/json')
                ->withBody(json_encode($data));
        }
        $data = [
            'success' => true,
            'message' => 'Success',
            'data' => $user,
            'timestamp' => time()
        ];
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->get('/api/v1/users/email/{email}', function (Request $request, Response $response, array $args) {
        $user = UserService::getUserByEmail($args['email']);
        if (!$user) {
            $data = [
                'success' => false,
                'message' => 'User not found',
                'data' => null,
                'timestamp' => time()
            ];
            return $response->withStatus(404)
                ->withHeader('Content-Type', 'application/json')
                ->withBody(json_encode($data));
        }
        $data = [
            'success' => true,
            'message' => 'Success',
            'data' => $user,
            'timestamp' => time()
        ];
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->get('/api/v1/users/username/{username}', function (Request $request, Response $response, array $args) {
        $user = UserService::getUserByUsername($args['username']);
        if (!$user) {
            $data = [
                'success' => false,
                'message' => 'User not found',
                'data' => null,
                'timestamp' => time()
            ];
            return $response->withStatus(404)
                ->withHeader('Content-Type', 'application/json')
                ->withBody(json_encode($data));
        }
        $data = [
            'success' => true,
            'message' => 'Success',
            'data' => $user,
            'timestamp' => time()
        ];
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->get('/api/v1/users/search', function (Request $request, Response $response) {
        $params = $request->getQueryParams();
        $keyword = $params['keyword'] ?? '';
        $users = UserService::searchUsers($keyword);
        $data = [
            'success' => true,
            'message' => 'Success',
            'data' => $users,
            'timestamp' => time()
        ];
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->get('/api/v1/users/active', function (Request $request, Response $response) {
        $users = UserService::getActiveUsers();
        $data = [
            'success' => true,
            'message' => 'Success',
            'data' => $users,
            'timestamp' => time()
        ];
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->get('/api/v1/users/recent', function (Request $request, Response $response) {
        $users = UserService::getRecentUsers();
        $data = [
            'success' => true,
            'message' => 'Success',
            'data' => $users,
            'timestamp' => time()
        ];
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->post('/api/v1/users', function (Request $request, Response $response) {
        $data = $request->getParsedBody();
        try {
            $user = UserService::createUser(
                $data['username'],
                $data['email'],
                $data['password'],
                $data['firstName'] ?? null,
                $data['lastName'] ?? null
            );
            $data = [
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user,
                'timestamp' => time()
            ];
            return $response->withStatus(201)
                ->withHeader('Content-Type', 'application/json')
                ->withBody(json_encode($data));
        } catch (\Exception $e) {
            $data = [
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null,
                'timestamp' => time()
            ];
            return $response->withStatus(409)
                ->withHeader('Content-Type', 'application/json')
                ->withBody(json_encode($data));
        }
    });

    $app->put('/api/v1/users/{id}', function (Request $request, Response $response, array $args) {
        $data = $request->getParsedBody();
        try {
            $user = UserService::updateUser($args['id'], $data);
            $data = [
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user,
                'timestamp' => time()
            ];
            $response->getBody()->write(json_encode($data));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $status = $e->getMessage() === 'User not found' ? 404 : 409;
            $data = [
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null,
                'timestamp' => time()
            ];
            return $response->withStatus($status)
                ->withHeader('Content-Type', 'application/json')
                ->withBody(json_encode($data));
        }
    });

    $app->delete('/api/v1/users/{id}', function (Request $request, Response $response, array $args) {
        try {
            UserService::deleteUser($args['id']);
            $data = [
                'success' => true,
                'message' => 'User deleted successfully',
                'data' => null,
                'timestamp' => time()
            ];
            $response->getBody()->write(json_encode($data));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $data = [
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null,
                'timestamp' => time()
            ];
            return $response->withStatus(404)
                ->withHeader('Content-Type', 'application/json')
                ->withBody(json_encode($data));
        }
    });

    $app->patch('/api/v1/users/{id}/activate', function (Request $request, Response $response, array $args) {
        try {
            $user = UserService::activateUser($args['id']);
            $data = [
                'success' => true,
                'message' => 'User activated successfully',
                'data' => $user,
                'timestamp' => time()
            ];
            $response->getBody()->write(json_encode($data));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $data = [
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null,
                'timestamp' => time()
            ];
            return $response->withStatus(404)
                ->withHeader('Content-Type', 'application/json')
                ->withBody(json_encode($data));
        }
    });

    $app->patch('/api/v1/users/{id}/deactivate', function (Request $request, Response $response, array $args) {
        try {
            $user = UserService::deactivateUser($args['id']);
            $data = [
                'success' => true,
                'message' => 'User deactivated successfully',
                'data' => $user,
                'timestamp' => time()
            ];
            $response->getBody()->write(json_encode($data));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $data = [
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null,
                'timestamp' => time()
            ];
            return $response->withStatus(404)
                ->withHeader('Content-Type', 'application/json')
                ->withBody(json_encode($data));
        }
    });
};
