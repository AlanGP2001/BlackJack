import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import "../App.css";
import CardArea from "./CardArea";
import PrimaryButton from "./PrimaryButton";

function ButtonChoice(props) {
  return (
    <Row>
      <Col xs={4}>
        <PrimaryButton
          size="smallButtonSize"
          title={props.title}
          action={props.action}
        />
      </Col>
      <Col xs={8}>
        <p className="instructionText">{props.text}</p>
      </Col>
    </Row>
  );
}

export default function PlayArea(props) {
  return (
    <Container className="appBackgroundColor">
      <Row>
        <Col 
          xs={{span:12}}
          sm={{span:8, offset:2}}
        >
          <CardArea
            bgColor="dealerAreaColor"
            cardsGiven={props.dealerCards}
            total={props.dealerTotal}
            tableTitle="Dealer"
          />
          <CardArea
            bgColor="playerAreaColor"
            cardsGiven={props.playerCards}
            total={props.playerTotal}
            tableTitle="Player"
          />
        </Col>
      </Row>
      <Row>
        <Col
          xs={{span:12}}
          sm={{span:8, offset:2}}        
        >
          {props.playerTotal < 17 && (
            <ButtonChoice
              title="Golpear"
              action={props.hit}
              text={"Consigue otra tarjeta. Si su nuevo total es superior a 21, ¡usted pierde!"}
            />
          )}

          <ButtonChoice
            title="Plantarse"
            action={props.stand}
            text={"Haz clic para finalizar tu turno. ¡El crupier comienza a sacar cartas!"}
          />

          {props.playerTotal >= 17 && props.dealerCards.length <3 && props.playerCards.length === 2 && (
            <p className="primaryColor whiteSpaceUnderNav">Debes plantarte si tu total es mayor a 17.</p>
          )

          }

          {props.playerTotal < 17 && (
            <ButtonChoice
              title={"Doblar"}
              action={props.doubleDown}
              text={"¡Doble su apuesta, obtenga una carta y comienza el turno del crupier!"}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
