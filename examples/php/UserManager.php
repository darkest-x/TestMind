<?php

/**
 * 用户管理类
 */
namespace TestMind;

class User {
    public $id;
    public $username;
    public $email;
    public $password;
    public $firstName;
    public $lastName;
    public $active;

    public function __construct($username, $email, $password, $firstName = null, $lastName = null, $active = true) {
        $this->id = null;
        $this->username = $username;
        $this->email = $email;
        $this->password = $password;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->active = $active;
    }

    public function getFullName() {
        if ($this->firstName && $this->lastName) {
            return $this->firstName . ' ' . $this->lastName;
        } elseif ($this->firstName) {
            return $this->firstName;
        } elseif ($this->lastName) {
            return $this->lastName;
        }
        return $this->username;
    }
}

class UserManager {
    private $users = [];
    private $nextId = 1;

    public function findUserById($id) {
        return isset($this->users[$id]) ? $this->users[$id] : null;
    }

    public function findAllUsers() {
        return array_values($this->users);
    }

    public function createUser($user) {
        if (empty($user->email)) {
            return null;
        }

        if (!$this->validateEmail($user->email)) {
            return null;
        }

        $user->id = $this->nextId++;
        $this->users[$user->id] = $user;
        return $user;
    }

    public function updateUser($id, $user) {
        if ($id <= 0 || !isset($this->users[$id])) {
            return null;
        }

        $user->id = $id;
        $this->users[$id] = $user;
        return $user;
    }

    public function deleteUser($id) {
        if ($id <= 0 || !isset($this->users[$id])) {
            return false;
        }

        unset($this->users[$id]);
        return true;
    }

    public function activateUser($id) {
        $user = $this->findUserById($id);
        if (!$user) {
            return false;
        }

        $user->active = true;
        return true;
    }

    public function deactivateUser($id) {
        $user = $this->findUserById($id);
        if (!$user) {
            return false;
        }

        $user->active = false;
        return true;
    }

    public function findUserByEmail($email) {
        foreach ($this->users as $user) {
            if ($user->email === $email) {
                return $user;
            }
        }
        return null;
    }

    public function findUserByUsername($username) {
        foreach ($this->users as $user) {
            if ($user->username === $username) {
                return $user;
            }
        }
        return null;
    }

    public function searchUsers($keyword, $options = []) {
        $searchUsername = !isset($options['username']) || $options['username'];
        $searchEmail = !isset($options['email']) || $options['email'];
        $searchName = !isset($options['name']) || $options['name'];

        $results = [];
        $lowerKeyword = strtolower($keyword);

        foreach ($this->users as $user) {
            $match = false;

            if ($searchUsername) {
                $match = strpos(strtolower($user->username), $lowerKeyword) !== false;
            }

            if (!$match && $searchEmail) {
                $match = strpos(strtolower($user->email), $lowerKeyword) !== false;
            }

            if (!$match && $searchName) {
                if ($user->firstName && strpos(strtolower($user->firstName), $lowerKeyword) !== false) {
                    $match = true;
                } elseif ($user->lastName && strpos(strtolower($user->lastName), $lowerKeyword) !== false) {
                    $match = true;
                }
            }

            if ($match) {
                $results[] = $user;
            }
        }

        return $results;
    }

    public function createUsersBatch($users) {
        $created = [];
        foreach ($users as $user) {
            $createdUser = $this->createUser($user);
            if ($createdUser) {
                $created[] = $createdUser;
            }
        }
        return $created;
    }

    public function deleteUsersBatch($ids) {
        $deletedCount = 0;
        foreach ($ids as $id) {
            if ($this->deleteUser($id)) {
                $deletedCount++;
            }
        }
        return $deletedCount;
    }

    public function getActiveUserCount() {
        $count = 0;
        foreach ($this->users as $user) {
            if ($user->active) {
                $count++;
            }
        }
        return $count;
    }

    public function getTotalUserCount() {
        return count($this->users);
    }

    private function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
}

?>
