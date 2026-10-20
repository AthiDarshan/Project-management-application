import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const projectSchema = new mongoose.Schema({
  projectName: String,
  category: String,
  description: String,
  status: String
})

const Project = mongoose.model('Project', projectSchema)

app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find()
    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' })
  }
})

app.post('/projects', async (req, res) => {
  try {
    const project = await Project.create(req.body)
    res.status(201).json(project)
  } catch (error) {
    res.status(400).json({ message: 'Error adding project' })
  }
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(5000, () => console.log('Server running on port 5000'))
  })
  .catch(error => console.log('MongoDB connection error:', error.message))
