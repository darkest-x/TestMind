<?php

namespace TestMind;

class UserService
{
    private static $users = [];
    private static $nextId = 4;

    public static function init()
    {
        self::$users[] = new User('admin', 'admin@testmind.com', 'password123', 'Admin', 'User', true);
        self::$users[0]->id = 1;
        self::$users[] = new User('johndoe', 'john@testmind.com', 'password123', 'John', 'Doe', true);
        self::$users[1]->id = 2;
        self::$users[] = new User('janedoe', 'jane@testmind.com', 'password123', 'Jane', 'Doe', false);
        self::$users[2]->id = 3;
    }

    public static function getAllUsers()
    {
        return self::$users;
    }

    public static function getUserById($id)
    {
        foreach (self::$users as $user) {
            if ($user->id == $id) {
                return $user;
            }
        }
        return null;
    }

    public static function getUserByEmail($email)
    {
        foreach (self::$users as $user) {
            if ($user->email === $email) {
                return $user;
            }
        }
        return null;
    }

    public static function getUserByUsername($username)
    {
        foreach (self::$users as $user) {
            if ($user->username === $username) {
                return $user;
            }
        }
        return null;
    }

    public static function searchUsers($keyword)
    {
        $results = [];
        $keyword = strtolower($keyword);
        foreach (self::$users as $user) {
            if (str_contains(strtolower($user->username), $keyword) ||
                str_contains(strtolower($user->email), $keyword) ||
                str_contains(strtolower($user->firstName ?? ''), $keyword) ||
                str_contains(strtolower($user->lastName ?? ''), $keyword)) {
                $results[] = $user;
            }
        }
        return $results;
    }

    public static function getActiveUsers()
    {
        return array_filter(self::$users, fn($user) => $user->active);
    }

    public static function getRecentUsers()
    {
        $count = min(count(self::$users), 10);
        return array_slice(self::$users, -$count);
    }

    public static function createUser($username, $email, $password, $firstName = null, $lastName = null)
    {
        if (self::getUserByEmail($email)) {
            throw new \Exception('Email already exists');
        }
        if (self::getUserByUsername($username)) {
            throw new \Exception('Username already exists');
        }

        $user = new User($username, $email, $password, $firstName, $lastName, true);
        $user->id = self::$nextId++;
        $user->createdAt = date('Y-m-d H:i:s');
        $user->updatedAt = date('Y-m-d H:i:s');
        self::$users[] = $user;
        return $user;
    }

    public static function updateUser($id, $data)
    {
        $user = self::getUserById($id);
        if (!$user) {
            throw new \Exception('User not found');
        }

        if (isset($data['email']) && $data['email'] !== $user->email) {
            if (self::getUserByEmail($data['email'])) {
                throw new \Exception('Email already exists');
            }
        }

        if (isset($data['username']) && $data['username'] !== $user->username) {
            if (self::getUserByUsername($data['username'])) {
                throw new \Exception('Username already exists');
            }
        }

        if (isset($data['username'])) {
            $user->username = $data['username'];
        }
        if (isset($data['email'])) {
            $user->email = $data['email'];
        }
        if (isset($data['firstName'])) {
            $user->firstName = $data['firstName'];
        }
        if (isset($data['lastName'])) {
            $user->lastName = $data['lastName'];
        }
        if (isset($data['active'])) {
            $user->active = $data['active'];
        }
        $user->updatedAt = date('Y-m-d H:i:s');
        return $user;
    }

    public static function deleteUser($id)
    {
        $user = self::getUserById($id);
        if (!$user) {
            throw new \Exception('User not found');
        }

        $index = array_search($user, self::$users, true);
        array_splice(self::$users, $index, 1);
        return true;
    }

    public static function activateUser($id)
    {
        $user = self::getUserById($id);
        if (!$user) {
            throw new \Exception('User not found');
        }
        $user->active = true;
        $user->updatedAt = date('Y-m-d H:i:s');
        return $user;
    }

    public static function deactivateUser($id)
    {
        $user = self::getUserById($id);
        if (!$user) {
            throw new \Exception('User not found');
        }
        $user->active = false;
        $user->updatedAt = date('Y-m-d H:i:s');
        return $user;
    }
}

UserService::init();
