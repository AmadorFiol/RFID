import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

export default function FormModal({ open, onClose, title, onSubmit, onDelete, children, submitLabel = 'Guardar' }) {
    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit()
    }

    return (
        <Popup open={open} onClose={onClose} modal closeOnDocumentClick={false}>
            <div className="popup-overlay" onClick={onClose}>
                <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                    <p className="popup-title">{title}</p>
                    <form onSubmit={handleSubmit}>
                        {children}
                        <div className="form-actions">
                            {onDelete &&
                            <button type="button" className="btn btn-del" onClick={()=>onDelete({id: children[0].props.value})}>
                                Eliminar
                            </button>
                            }
                            <button type="button" className="btn btn-cancel" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {submitLabel}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Popup>
    )
}
