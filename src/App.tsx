import { useState } from 'react'
import './App.css'
import TodoList from './components/TodoList'
import CategoryList from './components/CategoryList'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <header>
        <div className="header-inner">
          <h1>GCS Todo | Julio Graham</h1>
        </div>
      </header>
      <div className="mobile-toolbar">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen((s) => !s)} aria-label="Toggle categories">☰</button>
      </div>
      <main>
        <aside className={sidebarOpen ? 'open' : ''}>
          <CategoryList />
        </aside>
        <section>
          <TodoList />
        </section>
      </main>
    </div>
  )
}
