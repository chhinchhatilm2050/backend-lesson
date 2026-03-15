import 'dotenv/config';
import express from 'express';
import { connectDB, client } from './db.js';
import { ObjectId } from 'mongodb';
const app = express();
app.use(express.json());
await connectDB();
const db = client.db('chhat-fullstack');
const userCollection = db.collection('users');

const checkObjectId = (req, res, next) => {
    if (req.params.userId.length != 24) {
        return res.status(400).json({
            success: false,
            message: 'Invalid objectid'
        });
    }
    next()
}

app.post('/api/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const result = await userCollection.insertOne({
            name,
            email,
            age,
            createdAt: new Date()
        });
        return res.json({
            success: true,
            data: result
        })
    } catch (err) {
        
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', async (req, res) => {
  try {
    const body = req.body;
    const users = Array.isArray(body) ? body : [body];
    console.log(users)
    const result = await userCollection.insertMany(users);
    res.json({
      success: true,
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
    try{
        const users = await userCollection.find({}).toArray();
        return res.json({
            success: true,
            data: users
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
});

app.get('/api/users/:userId', checkObjectId, async(req, res) => {
    try{
        const user = await userCollection.findOne({_id: new ObjectId(req.params.userId)});
        if(!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            })
        }
        return res.json({
            success: true,
            data: user
        })
    }catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
} );

app.patch('/api/users/:id', async (req, res) => {
    try{
        const {name, email, age} = req.body;
        if(!name && !email & !age) {
            return res.status(400).json({
                success: false,
                message: 'name and email and age are require'
            })
        }
        const result = await userCollection.updateOne(
            {_id: new ObjectId(req.params.id)},
            {$set: {name,  email,  age}}
        );
        console.log(result)
        
        return res.json({
            success: true,
            data: result
        })
    } catch {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

app.delete('/api/users/:userId', async (req, res) => {
    try {
        const id = req.params.userId;
        const deleteUser = await userCollection.deleteOne({
            _id: new ObjectId(id)
        });
        if(deleteUser.deletedCount == 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            })
        }
        return res.json({
            success: true,
            message: 'Delete user successfully!'
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

  