import { useState } from 'react'
import './App.css'
import Form from './components/Form'
import MedalHub from './components/MedalHub'

function App() {
  const [submitted, setSubmitted] = useState(false)
  const [userPhone, setUserPhone] = useState(null)

  const handleSubmit = (telefone) => {
    setSubmitted(true)
    setUserPhone(telefone)
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Bem-vindo à Dazain</h1>
        <p className="subtitle">Preencha o formulário abaixo e entraremos em contato!</p>
        
        {submitted && userPhone ? (
          <MedalHub telefone={userPhone} />
        ) : (
          <Form onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  )
}

export default App


