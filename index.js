const express = require('express');
const db = require("./database.js");
const shortid = require('shortid');

//created the server
const server = express();


server.use(express.json())

server.get('/', (req, res) => {
    res.json({ message: " hello from your server!" });
});

server.get("/users", (req, res) => {
    const users = db.getUsers()

    if (users) {
        res.json(users);
    } else {
        res.status(500).json({
            errorMessage: "The users information could not be retrieved."
        });
    }
})

server.get("/users/:id", (req, res) => {
    //:id === req.params.id
    const userId = req.params.id;
    const user = db.getUserById(userId)

    if (user) {
        res.json(user);
    } else if (!user) {
        res.status(404).json({
            message: "The user with the specified ID does not exist."
        });
    } else {
        res.status(500).json({
            errorMessage: "The user information could not be retrieved."
        });
    }
})

server.post("/users", (req, res) => {
    //checking for name and/or bio
    if (!req.body.name || !req.body.bio) {
        return res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        });
    }
})

const newUser = db.createUser({
    id: shortid.generate(),
    name: req.body.name,
    bio: req.body.bio
})

if (newUser) {
    // returns new user document
    res.status(201).json(newUser)
} else {
    res.status(500).json({
        errorMessage: "There was an error while saving the user to the database"
    });
}

server.delete("/users/:id", (req, res) => {
    const user = db.getUserById(req.params.id);

    if (user) {
        db.deleteUser(user.id)
        res.status(204).end()
    } else if (!user) {
        res.status(404).json({
            message: "The user with the specified ID does not exist."
        });
    } else {
        res.status(500).json({
            errorMessage: "The user could not be removed"
        });
    }

})

server.put("/users/:id", (req, res) => {
    const user = db.getUserById(req.params.id);

    if (!user) {
        res.status(404).json({
            message: "The user with the specified ID does not exist."
        });
    } else if (!req.body.name || !req.body.bio) {
        res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        });
    } else if (user) {
        const updatedUser = db.updateUser(user.id, {
            name: req.body.name || user.name,
            bio: req.body.bio || user.bio
        })
        res.status(200).json(updatedUser);
    }
    else {
        res.status(500).json({
            errorMessage: "The user information could not be modified."
        })
    }
})

server.listen(5000, () => {
    console.log('server started at port 5000')
});