import { useState } from "react"
import { Modal, Button, InputGroup, FormControl } from "react-bootstrap"
import style from './BuyDlg.css'

function BuyDlg({show, handleClose, handleSubmit, price}) {
    const [value, setValue] = useState('');
    const [value1, setValue1] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
        setValue1(event.target.value / price * 10000);
    }

    const handleChangeCNT = (event) => {
        setValue(event.target.value * price / 10000);
        setValue1(event.target.value);
    }

    const handleConfirm = () => {
        handleSubmit(value);
    }

    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title><h3 className="dlg_title">Buy Crinet</h3></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5 style={{marginLeft: '8px', opacity: '.7'}}>BUSD</h5>
            <InputGroup className="mb-3">
                <FormControl type="number" onChange={handleChange} value={value}/>
            </InputGroup>
            <h5 style={{marginLeft: '8px', opacity: '.7'}}>CNT</h5>
            <InputGroup className="mb-3">
                <FormControl type="number" onChange={handleChangeCNT} value={value1}/>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  export default BuyDlg;