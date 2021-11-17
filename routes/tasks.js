const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const { csrfProtection, asyncHandler } = require('./utils')
const { User, List, Task } = require('../db/models');

const { requireAuth } = require('../auth');

router.use(requireAuth);

const taskValidator = [
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Please enter a description for your task')
        .isLength({ max: 255 })
        .withMessage('Description length must not exceed 255 characters'),
    // check('hours')
    //     .optional({ checkFalsy: true })
    //     .isNumeric({ min: 0, max: 24 })
    //     .withMessage('Hours must be between 0 and 24'),
    // check('minutes')
    //     .optional({ checkFalsy: true })
    //     .isNumeric({ min: 0, max: 60 })
    //     .withMessage('Minutes must be between 0 and 60')
]
// add a validator for importance

router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
    const task = await Task.findByPk(parseInt(req.params.id, 10));
    res.json({ task });
}))

router.post('/', taskValidator, asyncHandler(async (req, res) => {
    // add csrf
    let {
        description, listId, dueDate, estimatedTime, importance
    } = req.body;

    const list = await List.findByPk(listId)
    const userId = list.userId
    //got user id in back end by querying db

    if (!dueDate) dueDate = null;
    if (!estimatedTime) estimatedTime = null;
    if (!importance) importance = 0;

    const task = await Task.build({
        description, userId, listId, dueDate, estimatedTime, importance, completed: false, deleted: false
    })


    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        await task.save();
        return res.json(task);
    } else {
        const errors = validatorErrors.array().map(err => err.msg);
        return res.json({ errors });
    }
}))

router.delete('/:id(\\d+)', asyncHandler(async (req, res) => {
    const taskId = parseInt(req.params.id, 10)
    const task = await Task.findByPk(taskId)

    await task.destroy()

    res.json({ message: "Task successfully deleted" })
}))

router.put('/:id(\\d+)', taskValidator, asyncHandler(async (req, res) => {
    // add csrf
    const taskId = parseInt(req.params.id, 10)
    const task = await Task.findByPk(taskId)
    const {
        description, listId, dueDate, estimatedTime, importance, deleted, completed
    } = req.body;

    await task.update({
        description,
        listId,
        dueDate,
        estimatedTime,
        completed,
        deleted,
        importance
    })

    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {

        await task.save()
        res.json(task)
    } else {
        const hours = Math.floor(estimatedTime / 60);
        const minutes = estimatedTime % 60;
        const errors = validatorErrors.array().map((error) => error.msg);
        res.json({ errors, task, hours, minutes })
    }
}))

module.exports = router;
