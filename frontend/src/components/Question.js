import Card from 'react-bootstrap/Card';
import React, { useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import '../css/Question.css'; 

const Question = ({quest, answerChoices}) => {
  const {q_type, ans_type, subject, set, round, question, answer} = quest;

  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  
  const handleToggleExpand = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  return (
  <div className="spacing">
    <div className="header-gap">
    <Card>
      <Card.Body className='title faint-grey'>
          <span style={{marginTop: -12, marginBottom: -12}}>
          <b>{q_type.toUpperCase() || "can't load"}</b> {subject  || "can't load"} {'\u2014'}<i> {ans_type  || "can't load"}</i>
          </span>
          
          <span style={{marginTop: -12, marginBottom: -12}}>
          Set {set  || "can't load"} Round {round  || "can't load"}
          <button className="expand-button" onClick={handleToggleExpand}>
            {isOpen ? 'Collapse' : 'Expand'}
            <FontAwesomeIcon icon={faChevronDown} className="ml-1" />
          </button>
          </span>
      </Card.Body>
    </Card>
    </div>
    {isOpen && (
        <Card>
          <Card.Body className="faint-grey">
            <Card.Text>
              {question + answerChoices || "can't load"}
              {isRevealed && (
              <div>
                <br/>
                <b>ANSWER: </b>{answer || "can't load"}
              </div>
            )}
            </Card.Text>
            <button onClick={handleToggleReveal}>
              {isRevealed ? 'Hide Answer' : 'Show Answer'}
              <FontAwesomeIcon icon={faChevronUp} className="ml-1" />
            </button>
            
          </Card.Body>
        </Card>
      )}
    </div>
  );
 }

export default Question;