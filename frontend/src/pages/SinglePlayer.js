import Card from 'react-bootstrap/Card'
import ProgressBar from 'react-bootstrap/ProgressBar';
import Form from 'react-bootstrap/Form';
import {Row, Col, Container} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import '../css/SinglePlayer.css'; 

const baseUrl = 'http://localhost:3030';

function SinglePlayer() {
    
    //timer related useStates
    const [timeLeft, setTimeLeft] = useState(0.0);
    const [gameInProgress, setGameState] = useState(false);
    const initialTime = useRef(100);

    //Game setting use states
    const [timerOn, setTimerState] = useState(true);
    const [speech, setSpeech] = useState(true);
    const [pastQuestions, setPastQuestions] = useState(true);  
    const [readMode, setreadMode] = useState(false)
    
    //Question use states
    const [set, setSet] = useState(0);
    const [round, setRound] = useState(0);
    const [qNum, setqNum] = useState(0);
    const [qType, setqType] = useState("a");
    const [ansType, setAnsType] = useState("");
    const [subject, setSubject] = useState("");
    const [question, setQuestion] = useState("");
    const computer_question = useRef("");
    const questionId = useRef("")

    //decrements time is game in progress, timer option on, and timeLeft
    useEffect(() => {
        if (!timerOn || readMode) {
            return;
        }
        let timer = null;
        if (gameInProgress && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTimeLeft) => decrementTime(prevTimeLeft));
            }, 100); 
        }
        else {
            clearInterval(timer);
            if (gameInProgress && timeLeft === 0.0) {
                submitAnswer();
            }
        }
        return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameInProgress])

    function decrementTime(value) {
        return Number((value - 0.1).toFixed(1));
    };

    function resetQuestion() {
        setSet(0);
        setRound(0);
        setqNum(0);
        setqType("");
        setAnsType("");
        setSubject("");
        setQuestion("");
        setGameState(false);
        setTimeLeft(0);
    }

    async function fetchQuestion() {
        try {
            const response = await axios.get(baseUrl + '/question/random');
            const quest = response.data;
            setSet(quest.set);
            setRound(quest.round);
            setqNum(quest.q_num);
            setqType(quest.q_type);
            setAnsType(quest.ans_type);
            setSubject(quest.subject);
            setQuestion(quest.question);
            computer_question.current = quest.computer_question;
            questionId.current = quest._id
        }
        catch (error) {
            resetQuestion();
        }
    }

    async function handleNextClick() {
        resetQuestion();
        if (readMode) {
            try {
                await fetchQuestion();
            }
            catch (error) {
                resetQuestion();
                return;
            }
            setGameState(true);
        }
    }

    //can't use arrow function as they aren't mounted so useEffect() for timer will error 
    function submitAnswer() {
        //Submit answer needs to be donw
        setGameState(false);
    
    }

    return (
        <Container>
            <Row>
            {/* Question Column */}
                <Col xs={12} md={9}>
                <div className="options-container header-text">
                        <span>
                            <Button variant="success" className="button-margin" onClick={handleNextClick}>Next</Button>{' '}
                            <Button variant="primary" className="button-margin">Pause</Button>{' '}
                        </span>
                        <span>
                            <Button variant="danger" className="button-margin">Buzz</Button>{' '}
                        </span>
                    </div>
                <div className="options-container">
                    <div className="question-header">
                        <Card>
                            <Card.Body className="faint-grey">
                                <Card.Text className="header-text" style={{marginTop: -12, marginBottom: -12}}> 
                                <span>
                                    {set !== 0 && round !== 0 ? `Set ${set} Round ${round}` : 'Loading...'}
                                </span>
                                <span>
                                    {qNum !== 0 ? `Question ${qNum}` : 'Loading...' }
                                </span>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                    <Card>
                        <Card.Body className="faint-grey">
                            <Card.Text>
                                {qType !== "" && ansType !== "" && subject !== "" && question !== "" ?
                                <span>
                                    <b>{qType.toUpperCase()}</b> {subject} {'\u2014'}<i> {ansType}</i>{'   '}{question}
                                </span> : 'Loading...'
                                }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                </Col>
                {/* Options column */}
                <Col xs={12} md={3}>
                <div className="timer-card">
                    <Card className="options-spacing">
                        <Card.Body style={{marginTop: -12, marginBottom: -12}}>
                            <h3>{timeLeft} (sec)</h3>
                            <ProgressBar striped variant="info" now={(1 - timeLeft / initialTime.current) * 100} />
                        </Card.Body>
                    </Card>
                    <Card className="options-spacing">
                        <Card.Body>
                            <h2>Game Settings</h2>
                            <Form>
                                <Form.Check 
                                    type="switch"
                                    label="Turn Off Speech"
                                    onChange={() => setSpeech(!speech)}
                                />
                                <Form.Check 
                                    type="switch"
                                    label="Turn Off Timer"
                                    onChange={() => setTimerState(!timerOn)}
                                />
                                <Form.Check 
                                    type="switch"
                                    label="Turn On Read Mode"
                                    onChange={() => setreadMode(!readMode)}
                                />
                                <Form.Check 
                                    type="switch"
                                    label="Hide Past Questions"
                                    onChange={() => setPastQuestions(!pastQuestions)}
                                />
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <h2>Game Filters</h2>
                            
                        </Card.Body>
                    </Card>
                </div>
                </Col>
            </Row>
            
        </Container>
      );
}

export default SinglePlayer;