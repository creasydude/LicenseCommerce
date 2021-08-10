import express from 'express';
const Router = express.Router();

Router.get('/', (req, res) => {
    res.status(404).json({ message: "404 Not Found!" })
});
Router.post('/', (req, res) => {
    res.status(404).json({ message: "404 Not Found!" })
});
Router.delete('/', (req, res) => {
    res.status(404).json({ message: "404 Not Found!" })
});
Router.put('/', (req, res) => {
    res.status(404).json({ message: "404 Not Found!" })
});

export default Router;