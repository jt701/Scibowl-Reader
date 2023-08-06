import Card from 'react-bootstrap/Card'
import ProgressBar from 'react-bootstrap/ProgressBar';
import Form from 'react-bootstrap/Form';
import {Row, Col, Container} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import React, { useState, useEffect, useRef } from "react";

import axios from 'axios';
import '../css/SinglePlayer.css'; 


function SinglePlayer() {
    const baseUrl = 'http://localhost:3030';
    //timer related useStates
    const [timeLeft, setTimeLeft] = useState(0.0);
    const [gameInProgress, setGameState] = useState(false);
    const [timerOn, setTimerOn] = useState(false); //if timer is actually running
    const initialTime = useRef(100);

    //Game setting use states
    const [timerEnable, setTimerState] = useState(true);
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
    const questionId = useRef("");

    //Game Variables
    const [buzz, setBuzz] = useState(false);
    const [input, setInput] = useState("");
    const [inputVisible, setInputVisible] = useState(false); //for focusing buzz input area
    const inputRef = useRef(null);
    const [ansSubmit, setAnsSubmit] = useState(false);
    const isCorrect = useRef(false);

    //decrements time is game in progress, timer option on, and timeLeft
    useEffect(() => {
        if (!timerEnable || readMode) {
            return;
        }
        let timer = null;
        if (gameInProgress && timerOn && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTimeLeft) => decrementTime(prevTimeLeft));
            }, 100); 
        }
        else {
            clearInterval(timer);
        }
        return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timerOn])

    // Focus the input element when there is buzz
    useEffect(() => {
        if (inputVisible && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
              }, 0);
        }
      }, [inputVisible]);

    function decrementTime(value) {
        const newTime = Number((value - 0.1).toFixed(1));
        if (newTime === 0.0) {
            submitAnswer();
        }
        return newTime;
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
        setTimeLeft(0.0);
        setTimerOn(false);
        setBuzz(false); 
        setInput(""); 
        setInputVisible(false);
        setAnsSubmit(false);
    }

    async function fetchQuestion() {
        try {
            const response = await axios.get(baseUrl + '/question/random');
            const quest = response.data;
            let visualAnswerChoices = "";
            let compAnswerChoices = "";
            if (quest.ans_type === "Multiple Choice") {
                const answerChoices = quest.ans_choices;
                visualAnswerChoices = `\nW) ${answerChoices[0]}\nY) ${answerChoices[1]}\nX) ${answerChoices[2]}\nZ) ${answerChoices[3]}`;
                compAnswerChoices = `W) ${answerChoices[0]} Y) ${answerChoices[1]} X) ${answerChoices[2]} Z) ${answerChoices[3]}`;
            }
            setSet(quest.set);
            setRound(quest.round);
            setqNum(quest.q_num);
            setqType(quest.q_type);
            setAnsType(quest.ans_type);
            setSubject(quest.subject);
            setQuestion(quest.question + visualAnswerChoices);
            computer_question.current = quest.computer_question + compAnswerChoices;
            questionId.current = quest._id
            console.log(questionId);
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

    //going to want to have submit button to clear set buzz and input value
    async function handleBuzzClick() {
        setGameState(false);
        setTimerOn(false);
        setBuzz(true);
        setInputVisible(true);
    }

    //can't use arrow function as they aren't mounted so useEffect() for timer will error 
    //need to repeat resetting timer/game/buzz state because time may run out
    async function submitAnswer() {
        //Submit answer needs to be done
        setGameState(false);
        setTimerOn(false);
        try {
            if (input === "") {
                isCorrect.current = false;
            }
            else {
                console.log("yep");
                isCorrect.current = await axios.get(baseUrl + `/question/check/${questionId}?userAnswer=${input}`);
            }
        }
        catch (error) {
            isCorrect.current = false;
            
        }
        setBuzz(true);
        setAnsSubmit(true);

    }

    function handleInput(event) {
        setInput(event.target.value)
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
                            <Button variant="danger" className="button-margin" disabled={!gameInProgress} onClick={handleBuzzClick}>Buzz</Button>{' '}
                        </span>
                    </div>
                <div className="options-container">
                    {buzz ?  <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="Answer"
                        aria-label="Answer"
                        aria-describedby="submit-button"
                        value={input}
                        onChange={handleInput}
                        ref={inputRef}
                        readOnly={ansSubmit}
                    />
                    <Button variant={ansSubmit ? (isCorrect.current ? 'success' : 'danger') : 'warning'} id="submit-button" disabled={ansSubmit} onClick={submitAnswer}>
                        {ansSubmit ? (isCorrect.current ? 'Correct' : 'Incorrect') : 'Submit'}
                    </Button>
                    </InputGroup>
                    :null}
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
                                    onChange={() => setTimerState(!timerEnable)}
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