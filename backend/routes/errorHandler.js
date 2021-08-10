import express from 'express';

const jsonErrorHandler = async (err, req, res, next) => {
    res.status(500).json({ message: err.message });
}

export default jsonErrorHandler;