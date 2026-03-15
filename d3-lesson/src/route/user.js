import express from 'express';
const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  res.json({ message: 'Get all users' });
});


userRouter.get('/:id', (req, res) => {
  res.json({ message: 'Get user', id: req.params.id });
});


userRouter.post('/', (req, res) => {
  res.status(201).json({ message: 'Create user', data: req.body });
});


userRouter.put('/:id', (req, res) => {
  res.json({ message: 'Update user', id: req.params.id });
});

userRouter.delete('/:id', (req, res) => {
  res.status(204).send();
});

export default userRouter;