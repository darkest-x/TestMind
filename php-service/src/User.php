<?php

namespace TestMind;

class User
{
    public $id;
    public $username;
    public $email;
    public $password;
    public $firstName;
    public $lastName;
    public $active;
    public $createdAt;
    public $updatedAt;

    public function __construct($username, $email, $password, $firstName = null, $lastName = null, $active = true)
    {
        $this->username = $username;
        $this->email = $email;
        $this->password = $password;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->active = $active;
    }
}
