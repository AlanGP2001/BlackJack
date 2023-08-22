import React, { useEffect, useState } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import "../App.css";
import PrimaryButton from "./PrimaryButton";

// Función para realizar el algoritmo de k-means
function kMeans(data, k) {
  // Creamos un arreglo de clústeres inicializado con arreglos vacíos
  const clusters = new Array(k).fill().map(() => []);
  // Iteramos a través de cada valor en el conjunto de datos
  for (const value of data) {
    // Calculamos el índice de clúster para el valor actual
    const clusterIndex = value % k;
    // Verificamos si ya existe un clúster en el índice calculado
    if (clusters[clusterIndex]) {
      // Si existe, agregamos el valor al clúster correspondiente
      clusters[clusterIndex].push(value);
    } else {
      // Si no existe, creamos un nuevo clúster con el valor actual
      clusters[clusterIndex] = [value];
    }
  }
  // Devolvemos un objeto que contiene los clústeres resultantes
  return { clusters };
}

export default function Footer(props) {
  const [winners, setWinners] = useState([]);
  const [players, setPlayers] = useState([]);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showSaveButtonKMens, setShowSaveButtonKMens] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    displayWinners();
  }, []);

  // Obtener lista de jugadores ganadores
  const displayWinners = async () => {
    const response = await fetch(`api/getNames`);
    const data = await response.json();
    let winnerList = data.data.winners;
    winnerList.sort((a, b) => b.fields.funds - a.fields.funds);
    setPlayers(winnerList);
    const topWinners = winnerList.slice(0, 3);
    setWinners(topWinners);
  };

  // Función para categorizar jugadores en base a sus fondos
  function categorizePlayersByFunds(funds) {
    // Comprobamos si los fondos son menores o iguales a 500
    if (funds <= 500) {
      // Si es así, categorizamos al jugador como "Novato"
      return "Novato";
    } else if (funds <= 5000) {
      // Si los fondos son mayores que 500 pero menores o iguales a 5000,
      // categorizamos al jugador como "Promedio"
      return "Promedio";
    } else {
      // Si los fondos son mayores que 5000, categorizamos al jugador como "Experimentado"
      return "Experimentado";
    }
  }

  // Aplicar algoritmo de k-means a los jugadores
  function applyKMeansToPlayers(players) {
    // Definimos el número de clústeres deseado
    const k = 3;
    // Extraemos los datos de los fondos de los jugadores en un arreglo
    const fundsData = players.map((player) => player.fields.funds);
    // Aplicamos el algoritmo de k-means a los datos de fondos
    const result = kMeans(fundsData, k);
    // Asignamos categorías a los jugadores basadas en sus fondos
    const playersWithCategories = players.map((player) => ({
      ...player,
      category: categorizePlayersByFunds(player.fields.funds),
    }));
    // Asignamos información de clústeres a los jugadores
    const playersWithInfo = playersWithCategories.map((player) => ({
      ...player,
      // Verificamos la categoría del jugador y asignamos el clúster correspondiente
      // Propiedad para asignar el clúster del jugador
      cluster:
        categorizePlayersByFunds(player.fields.funds) === "Novato" // Si la categoría es "Novato"
          ? 0 // Asignar el valor 0 al clúster
          : categorizePlayersByFunds(player.fields.funds) === "Promedio" // Si la categoría es "Promedio"
          ? 1 // Asignar el valor 1 al clúster
          : categorizePlayersByFunds(player.fields.funds) === "Experimentado" // Si la categoría es "Experimentado"
          ? 2 // Asignar el valor 2 al clúster
          : result.clusters.findIndex(
              (
                cluster // Si la categoría no coincide con ninguna de las anteriores
              ) => cluster.includes(player.fields.funds) // Encontrar el índice del clúster que contiene los fondos del jugador
            ),
    }));

    // Devolvemos un arreglo de jugadores con información de clústeres y categorías
    return playersWithInfo;
  }

  return (
    <Container fluid className="footer-background">
      {/* Encabezado de la sección */}
      <Row>
        <Col className="center primaryColor">PUNTUACIONES ALTAS</Col>
      </Row>

      {/* Mostrar lista de ganadores */}
      {winners.map((player, id) => (
        <Row key={id}>
          <Col className="center primaryColor">{player.fields.Name}</Col>
          <Col className="center primaryColor">${player.fields.funds} </Col>
        </Row>
      ))}

      {/* Botones para ver la tabla */}
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

      {/* Modal para mostrar marcador */}
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
          {/* Encabezados de columnas */}
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
          {/* Mostrar lista de jugadores */}
          {players.map((player, id) => {
            return (
              <Row key={id}>
                <Col className="center">{id + 1}</Col>
                <Col className="center">{player.fields.Name}</Col>
                <Col className="center">${player.fields.funds} </Col>
              </Row>
            );
          })}
          {/* Mostrar el total de registros */}
          <Row>
            <Col className="center">
              <p>Total de registros: {players.length}</p>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      {/* Modal para mostrar K-Means */}
      <Modal
        show={showSaveButtonKMens}
        onHide={() => setShowSaveButtonKMens(false)}
        className="scoreboardBackground"
        size="lg"
        dialogClassName="modal-lg"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="center">
              <h1>K-Means</h1>
            </Col>
          </Row>
          {/* Encabezados de columnas */}
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
          {/* Mostrar lista de jugadores con K-Means y categorías */}
          {applyKMeansToPlayers(players).map((player, id) => (
            <Row key={id}>
              <Col className="center">{id + 1}</Col>
              <Col className="center">{player.fields.Name}</Col>
              <Col className="center">${player.fields.funds}</Col>
              <Col className="center">{player.cluster}</Col>
              <Col className="center">{player.category}</Col>
            </Row>
          ))}
          {/* Mostrar el total de registros */}
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
