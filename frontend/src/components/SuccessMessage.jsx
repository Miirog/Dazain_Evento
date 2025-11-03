import './SuccessMessage.css'

function SuccessMessage({ onReset }) {
  return (
    <div className="success-container">
      <div className="success-icon">✓</div>
      <h2 className="success-title">Formulário enviado com sucesso!</h2>
      <p className="success-message">
        Obrigado pelo seu interesse. Entraremos em contato em breve!
      </p>
      <button onClick={onReset} className="reset-button">
        Enviar outro formulário
      </button>
    </div>
  )
}

export default SuccessMessage


