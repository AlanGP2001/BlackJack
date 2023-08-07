import React, { useEffect, useState } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import "../App.css";
import PrimaryButton from "./PrimaryButton";
// import kMeans from "./K-Means";

// Función de k-means (por simplificar, solo se muestra cómo agrupar por valor)
function kMeans(data, k) {
  const clusters = new Array(k).fill().map(() => []);
  for (const value of data) {
    const clusterIndex = value % k;
    if (clusters[clusterIndex]) {
      clusters[clusterIndex].push(value);
    } else {
      clusters[clusterIndex] = [value];
    }
  }
  return { clusters };
}

export default function Footer(props) {
  const [winners, setWinners] = useState([]);
  const [players, setPlayers] = useState([]);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showSaveButtonKMens, setShowSaveButtonKMens] = useState(false);

  useEffect(() => {
    displayWinners();
  }, []);

  const displayWinners = async () => {
    const response = await fetch(`api/getNames`);
    const data = await response.json();
    let winnerList = data.data.winners;
    winnerList.sort((a, b) => b.fields.funds - a.fields.funds);
    setPlayers(winnerList);
    const topWinners = winnerList.slice(0, 3);
    setWinners(topWinners);
  };

  function categorizePlayersByFunds(funds) {
    if (funds <= 500) {
      return "Novato";
    } else if (funds <= 5000) {
      return "Promedio";
    } else {
      return "Experimentado";
    }
  }

  function applyKMeansToPlayers(players) {
    const k = 3; // Número de clústeres deseados (puedes ajustarlo)
    const fundsData = players.map((player) => player.fields.funds);
    const result = kMeans(fundsData, k);

    // Asignar categorías a jugadores basados en los fondos
    const playersWithCategories = players.map((player) => ({
      ...player,
      category: categorizePlayersByFunds(player.fields.funds),
    }));

    // Asignar clústeres a categorías usando el mapeo
    const playersWithInfo = playersWithCategories.map((player) => ({
      ...player,
      cluster: result.clusters.findIndex((cluster) =>
        cluster.includes(player.fields.funds)
      ),
    }));

    return playersWithInfo;
  }

  return (
    <Container fluid className="footer-background">
      <Row>
        <Col className="center primaryColor">PUNTUACIONES ALTAS</Col>
      </Row>
      {winners.map((player, id) => (
        <Row key={id}>
          <Col className="center primaryColor">{player.fields.Name}</Col>
          <Col className="center primaryColor">${player.fields.funds} </Col>
        </Row>
      ))}
      <Row>
        <Col className="center">
          <PrimaryButton
            size="largeButtonSize"
            title="Ver marcador"
            action={() => setShowSaveButton(true)}
          />
        </Col>
        <Col className="center">
          <PrimaryButton
            size="largeButtonSize"
            title="K-Means"
            action={() => setShowSaveButtonKMens(true)}
          />
        </Col>
      </Row>

      <Modal
        show={showSaveButton}
        onHide={() => setShowSaveButton(false)}
        className="scoreboardBackground"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="center">
              <h1>ScoreBoard</h1>
            </Col>
          </Row>
          <Row>
            <Col className="center">
              <h4>#</h4>
            </Col>
            <Col className="center">
              <h4>Nombre</h4>
            </Col>
            <Col className="center">
              <h4>Fondos</h4>
            </Col>
          </Row>
          {players.map((player, id) => {
            return (
              <Row key={id}>
                <Col className="center">{id + 1}</Col>
                <Col className="center">{player.fields.Name}</Col>
                <Col className="center">${player.fields.funds} </Col>
              </Row>
            );
          })}
          <Row>
            <Col className="center">
              <p>Total de registros: {players.length}</p>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <Modal
        show={showSaveButtonKMens}
        onHide={() => setShowSaveButtonKMens(false)}
        className="scoreboardBackground"
        size="lg" // Tamaño grande (lg)
        dialogClassName="modal-lg" // Clase CSS personalizada para un tamaño grande
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="center">
              <h1>K-Means</h1>
            </Col>
          </Row>
          <Row>
            <Col className="center">
              <h4>#</h4>
            </Col>
            <Col className="center">
              <h4>Nombre</h4>
            </Col>
            <Col className="center">
              <h4>Fondos</h4>
            </Col>
            <Col className="center">
              <h4>Cluster</h4>
            </Col>
            <Col className="center">
              <h4>Categoría</h4>
            </Col>
          </Row>
          {applyKMeansToPlayers(players).map((player, id) => (
            <Row key={id}>
              <Col className="center">{id + 1}</Col>
              <Col className="center">{player.fields.Name}</Col>
              <Col className="center">${player.fields.funds}</Col>
              <Col className="center">{player.cluster}</Col>
              <Col className="center">{player.category}</Col>
            </Row>
          ))}
          <Row>
            <Col className="center">
              <p>Total de registros: {players.length}</p>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
