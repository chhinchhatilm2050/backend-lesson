import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
const app = express();
app.use(express.json());
app.use(morgan('combined'));
app.use(helmet());
const PORT = 3000;
app.get('/', (req, res) => {
  res.json({
    success: true,
    msg: 'from mogan'
  })
});

const users = [
  { id: 1, name: 'Admin User', role: 'admin', token: 'admin-token' },
  { id: 2, name: 'Regular User', role: 'user', token: 'user-token' }
];
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      error: 'No token provided'
    });
  }
  
  const user = users.find(u => u.token === token);
  
  if (!user) {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }
  
  req.user = user;
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Not authenticated'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions'
      });
    }
    next();
  };
};

app.get('/api/public', (req, res) => {
  res.json({ message: 'Public data' });
});
// Protected route - any authenticated user
app.get('/api/profile', authenticate, (req, res) => {
  res.json({
    user: req.user
  });
});

// Admin only route
app.get('/api/admin', authenticate, authorize('admin'), (req, res) => {
  res.json({
    message: 'Admin panel',
    users: users
  });
});

// Admin or moderator route
app.delete('/api/posts/:id',
  authenticate,
  authorize('admin', 'moderator'),
  (req, res) => {
    res.json({
      message: 'Post deleted',
      id: req.params.id
    });
  }
);


app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    error: err.message
  });
});
app.listen(PORT, () => {
  console.log(`Application listen on port ${PORT}`);
})