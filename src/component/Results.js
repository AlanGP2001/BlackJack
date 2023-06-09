import React, {useState, useEffect} from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from 'axios';

import "../App.css";
import PrimaryButton from "./PrimaryButton";

export default function Results(props) {
  
const [pulseAnimation, setPulse] = useState("");
const [showSaveButton, setShowSaveButton] = useState(false);
const [playerName, setPlayerName] = useState("");

useEffect(() => {
  setTimeout(() => {
    setPulse("")
  }, 1000);
});

const saveUserToScoreboard = () => {    
  const url = "api/addname"
  axios.post(url,{"playerName":playerName, "bank":props.money});  
  setShowSaveButton(false)
}

  return (
    <Container className="resultsBackgroundColor  primaryColor center whiteSpaceUnderNav">
      {props.gameResults === "win" && (
        <Row>
          <Col>
            <h1>¡¡¡GANASTE!!!</h1>
          </Col>
        </Row>
      )}
      {props.gameResults === "lose" && (
        <Row>
          <Col>
            <h1>¡¡¡Tú pierdes!!!</h1>
          </Col>
        </Row>
      )}
      {props.gameResults === "push" && (
        <Row className="whiteSpaceBetweenElements">
          <Col>
            <h1>Fue un empate</h1>
          </Col>
        </Row>
      )}
      <Row>
        <Col >
          <h5>Dealer: {props.dealerTotal}</h5>
        </Col>
        <Col >
          <h5>Player: {props.playerTotal}</h5>
        </Col>
      </Row>
      {props.money > 0 &&
        <div>
          <Row className="whiteSpaceBetweenElements">
            <Col
              className={`smallRedCheque primaryColor ${pulseAnimation}`}
              onClick={() => {
                props.addToBet();
                setPulse("pulseWhenClicked");
              }}
              xs={{ span: 9, offset: 1 }}
              sm={{ span: 8, offset: 2 }}
              md={{ span: 6, offset: 3 }}
              lg={{ span: 6, offset: 3 }}
              xl={{ span: 6, offset: 3 }}
            >
              ${props.bet}
            </Col>
          </Row>
          <Row className="center whiteSpaceBetweenElements">
            <Col xs={12} className="instructionText">
            en incrementos de $5, hasta su límite de fondosen incrementos de $5, hasta su límite de fondos de ${props.money}
            </Col>
          </Row>
          <Row className="whiteSpaceBetweenElements">
            <Col>
              <Link to="/play">
                <PrimaryButton
                  size="largeButtonSize"
                  title="Vamos a jugar"
                  action={props.start}
                />
              </Link>
            </Col>
          </Row>
          <Row className="whiteSpaceBetweenElements">
            <Col>
              <PrimaryButton
                size="largeButtonSize"
                title="Restablecer cantidad de apuesta"
                action={props.resetBet}
              />
            </Col>
          </Row>
          <Row className="whiteSpaceBetweenElements">
            <Col>
                <PrimaryButton
                  size="largeButtonSize"
                  title="Guardar en el marcador"
                  action={() => setShowSaveButton(true)}
                />
            </Col>
          </Row>
        </div>
      }
      <Row className="whiteSpaceBetweenElements">
        <Col>
          <Link to="/">
            <PrimaryButton
              size="largeButtonSize"
              title="Fin del juego"
              action={props.playerLeave}
            />
          </Link>
        </Col>
      </Row>
      <Modal show={showSaveButton} onHide={() => setShowSaveButton(false)} className="scoreboardBackground" >
          <Modal.Header closeButton>
            <Modal.Title>Añade tu nombre al marcador</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type="text" value={playerName}  onChange={e => setPlayerName(e.target.value)} />
          </Modal.Body>
          <Modal.Footer>
            <PrimaryButton
              size="largeButtonSize"
              title="Guardar en el marcador"
              action={() => saveUserToScoreboard()}
            />
          </Modal.Footer>
      </Modal>
    </Container>
  );
}
