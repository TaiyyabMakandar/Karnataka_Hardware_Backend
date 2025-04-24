const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const home = async (req, res) => {
    try {
        res.status(200).send("mern stack developer");
    } catch (error) {
        console.log(error);
    }
};

const register = async (req, res) => {
    try {
        // console.log(req.body);
        // res.status(200).json({ message: req.body });
        const { username, email, phone, password } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ msg: "email already exists" });
        }
        const userCreated = await User.create({ username, email, phone, password });
        res.status(201).json({
            msg: "registration successfull...",
            token: await userCreated.generateToken(),
            userId: userCreated._id.toString(),
        });

    } catch (error) {
        // res.status(500).json("internal server error");
        next(error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExist = await User.findOne({ email });
        console.log(userExist);

        if (!userExist) {
            return res.status(400).json({ message: "invalid credentials" });
        }
        // const user = await bcrypt.compare(password, userExist.password);
        const user = await userExist.comparePassword(password);
        if (user) {
            res.status(200).json({
                msg: "login successfully",
                token: await userExist.generateToken(),
                userId: userExist._id.toString(),
            });
        } else {
            res.status(401).json({ message: "invalid email or password" });
            // next(error);
        }
    } catch (error) {
        res.status(500).json("internal server error");
        // next(error);
    }

};

const user = async (req, res) => {
    try {
        const userData = req.user;
        console.log(userData);
        return res.status(200).json({ msg: userData });
    } catch (error) {
        console.log(`error from the user route ${error}`);
    }
}

module.exports = { home, register, login, user };