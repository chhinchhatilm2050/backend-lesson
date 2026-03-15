import express from 'express';
import router from './src/route/index.js';
const app = express();
app.use(express.json());
const PORT = 3000;
app.use('/api', router);

const logRequest = (req, res, next) => {
    console.log(req.ip);
    next();
}
app.use(logRequest);


// const logger = (req, res, next) => {
//   console.log(`${req.method} ${req.path}`);
//   next();
// };

// const validator = (req, res, next) => {
//     if(req.body.name) {
//         next()
//     } else {
//         res.status(400).json({error: 'name is require'});
//     };
// }
// const createUser = (req, res) => {
//     const { name, email, age } = req.body;
  
//     console.log('Request body:', req.body);
    
//     res.status(201).json({
//         message: 'User created',
//         user: { name, email, age }
//     });
// }

// app.post('/users',[logger, validator], createUser );
app.listen(PORT,'127.0.0.1', () => {
    console.log(`Server is running on port${PORT}`);
})