import React, { useState } from 'react';
import { render } from 'react-dom';
import './style.css';
import * as CryptoJS from 'crypto-js';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const cfg = {
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
};

const App = () => {
  const [encryptedBase64, setEncryptedBase64] = useState('');
  const [text, setText] = useState('');
  const [encryptKey, setEncryptKey] = useState('');
  const [decryptKey, setDecryptKey] = useState('');
  const [outputText, setOutputText] = useState('');
  const [encryptOutput, setEncryptOutput] = useState('');

  const algorithm = 'aes-256-cbc';
  const iv = CryptoJS.enc.Utf8.parse('hash_ww_core_iv'.padEnd(16, '0'));

  const encrypt = (text, keyInput) => {
    try {
      const key = CryptoJS.enc.Utf8.parse(keyInput.padEnd(32, '0'));
      const encrypted = CryptoJS.AES.encrypt(text, key, {
        iv: iv,
        ...cfg,
      });
      return encrypted.toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return 'error';
    }
  };

  const decrypt = (text, keyInput) => {
    try {
      const key = CryptoJS.enc.Utf8.parse(keyInput.padEnd(32, '0'));
      const encryptedText = CryptoJS.enc.Base64.parse(text);
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encryptedText },
        key,
        {
          iv: iv,
          ...cfg,
        }
      );
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      return 'error';
    }
  };

  const handleEncryptClick = () => {
    if (text && encryptKey) {
      const encryptText = encrypt(text, encryptKey);
      setEncryptOutput(encryptText);
    } else {
      setEncryptOutput('N/A');
    }
  };

  const handleDecryptClick = () => {
    if (encryptedBase64 && decryptKey) {
      const decryptedText = decrypt(encryptedBase64, decryptKey);
      setOutputText(decryptedText);
    } else {
      setOutputText('N/A');
    }
  };

  const handleCopyClick = (textToCopy) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert('Text copied to clipboard!');
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  };

  return (
    <Container fluid className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} className="mb-4">
          <Container className="p-4 border rounded shadow">
            <h1 className="text-center mb-4">WW Performance - Mã hóa</h1>
            <Card body>
              <Form>
                <Form.Group controlId="text" className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Nhập chuỗi muốn mã hóa"
                  />
                </Form.Group>
                <Form.Group controlId="encryptKey" className="mb-3">
                  <Form.Control
                    type="text"
                    value={encryptKey}
                    onChange={(e) => setEncryptKey(e.target.value)}
                    placeholder="Nhập key"
                  />
                </Form.Group>
                <div className="d-flex justify-content-center mt-3">
                  <Button variant="primary" onClick={handleEncryptClick}>
                    Mã hóa
                  </Button>
                </div>
              </Form>
            </Card>
            <Card body className="mt-3">
              <div className="bg-light border p-3 rounded output-container d-flex justify-content-between align-items-start">
                <pre className="output mb-0">
                  <code className="font-weight-bold text-dark">
                    {encryptOutput}
                  </code>
                </pre>
                <Button
                  variant="secondary"
                  className="mt-2"
                  onClick={() => handleCopyClick(encryptOutput)}
                >
                  Copy
                </Button>
              </div>
            </Card>
          </Container>
        </Col>
        <Col md={6} className="mb-4">
          <Container className="p-4 border rounded shadow">
            <h1 className="text-center mb-4">WW Performance - Giải mã</h1>
            <Card body>
              <Form>
                <Form.Group controlId="encryptedBase64" className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={encryptedBase64}
                    onChange={(e) => setEncryptedBase64(e.target.value)}
                    placeholder="Nhập chuối đã mã hóa"
                  />
                </Form.Group>
                <Form.Group controlId="decryptKey" className="mb-3">
                  <Form.Control
                    type="text"
                    value={decryptKey}
                    onChange={(e) => setDecryptKey(e.target.value)}
                    placeholder="Nhập key"
                  />
                </Form.Group>
                <div className="d-flex justify-content-center mt-3">
                  <Button variant="primary" onClick={handleDecryptClick}>
                    Giải mã
                  </Button>
                </div>
              </Form>
            </Card>
            <Card body className="mt-3">
              <div className="bg-light border p-3 rounded output-container d-flex justify-content-between align-items-start">
                <pre className="output mb-0">
                  <code className="font-weight-bold text-dark">
                    {outputText}
                  </code>
                </pre>
                <Button
                  variant="secondary"
                  className="mt-2"
                  onClick={() => handleCopyClick(outputText)}
                >
                  Copy
                </Button>
              </div>
            </Card>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

render(<App />, document.getElementById('root'));
