import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ConfirmationModal({ show, onHide, onConfirm }) {
  return (
        <>
          <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Link another page</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you want to link anoother page, then please use Ink annotation!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => {
          onConfirm();
          onHide();
        }}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
        </>
  )
}

export default ConfirmationModal
