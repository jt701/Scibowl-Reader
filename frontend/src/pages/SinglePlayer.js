import Card from 'react-bootstrap/Card'
import {Row, Col, Container} from 'react-bootstrap';
import '../css/SinglePlayer.css'; 

function SinglePlayer() {
    return (
        <Container>
          <Row>
            {/* Question Column */}
            <Col xs={12} md={9}>
              <div className="options-container">
                <div className="question-header">
                    <Card>
                        <Card.Body className="faint-grey header-padding">
                            <Card.Text className="header-text header-padding">
                            <span>Set 1 Round 10</span>
                            <span>Question 24</span>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <Card>
                    <Card.Body className="faint-grey">
                        <Card.Text>
                        A cell phone company charges 25 cents per minute for the first 10 minutes of usage and 10 cents per minute for usage greater than 10 minutes. 
                        If you talked for 1½hours, what is your total airtime charge?
                        </Card.Text>
                    </Card.Body>
                </Card>
              </div>
            </Col>
            {/* Options column */}
            <Col xs={12} md={3}>
              <div className="question-container">
                <h2>Question goes here</h2>
                {/* Add more content as needed */}
              </div>
            </Col>
          </Row>
        </Container>
      );
}

export default SinglePlayer;