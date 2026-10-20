
import { useState, useEffect } from 'react'
import './App.css'

function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <h3>{project.projectName}</h3>
      <p>Category: {project.category}</p>
      <p>Description: {project.description}</p>
      <p>Status: {project.status}</p>
    </div>
  )
}

function App() {
  const [projects, setProjects] = useState([])
  const [projectName, setProjectName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Pending')
  const [filter, setFilter] = useState('All')

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.log('Error fetching projects')
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const createProject = async (e) => {
    e.preventDefault()

    const project = {
      projectName,
      category,
      description,
      status
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
      })

      if (response.ok) {
        setProjectName('')
        setCategory('')
        setDescription('')
        setStatus('Pending')
        fetchProjects()
        alert('Project created successfully')
      } else {
        alert('Project creation failed')
      }
    } catch (error) {
      alert('Cannot connect to backend')
    }
  }

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(project => project.category === filter)

  return (
    <div>
      <h1>Project Management Application</h1>

      <h2>Create Project</h2>

      <form onSubmit={createProject}>
        <input
          placeholder="Project Name"
          value={projectName}
          onChange={e => setProjectName(e.target.value)}
          required
        />
        <br /><br />

        <input
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        />
        <br /><br />

        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <br /><br />

        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <br /><br />

        <button type="submit">Create Project</button>
      </form>

      <h2>Project List</h2>

      <select
        value={filter}
        onChange={e => setFilter(e.target.value)}
      >
        <option>All</option>
        {[...new Set(projects.map(project => project.category))].map(category => (
          <option key={category}>{category}</option>
        ))}
      </select>

      {filteredProjects.map(project => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  )
}

export default App
