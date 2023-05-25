import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import "../App.css";

export default function LetsPlayButton(props) {
  return (
    <Container>
      <Row>
        <Col>
          <button className="buttonTextStyle">Vamos a jugar</button>
        </Col>
      </Row>
    </Container>
  );
}
