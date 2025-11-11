import { useState, useEffect } from 'react'
import '../App.css'
import Form from '../components/Form'
import MedalHub from '../components/MedalHub'

function Home() {
  const [submitted, setSubmitted] = useState(false)
  const [userPhone, setUserPhone] = useState(null)

  // Verificar se há dados salvos no localStorage
  useEffect(() => {
    const savedPhone = localStorage.getItem('dazain_user_phone')
    const savedSubmitted = localStorage.getItem('dazain_user_submitted')
    
    if (savedPhone && savedSubmitted === 'true') {
      setUserPhone(savedPhone)
      setSubmitted(true)
    }
  }, [])

  const handleSubmit = (telefone) => {
    setSubmitted(true)
    setUserPhone(telefone)
    
    // Salvar no localStorage
    localStorage.setItem('dazain_user_phone', telefone)
    localStorage.setItem('dazain_user_submitted', 'true')
  }

  return (
    <div className="app">
      <div className="container">
        <div className="logo-container">
          <img 
            src="/logo-dazain-icon-04.svg" 
            alt="Logo Dazain" 
            className="logo"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextElementSibling.style.display = 'block'
            }}
          />
          <div className="logo-placeholder" style={{ display: 'none' }}>
            DAZAIN
          </div>
        </div>
        
        {submitted && userPhone ? (
          <MedalHub telefone={userPhone} />
        ) : (
          <>
            <h1 className="title">Bem-vindo à Dazain</h1>
            <p className="subtitle">Preencha o formulário abaixo e entraremos em contato!</p>
            <Form onSubmit={handleSubmit} />
          </>
        )}
      </div>
    </div>
  )
}

export default Home


