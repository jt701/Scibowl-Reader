import Card from 'react-bootstrap/Card'
import ProgressBar from 'react-bootstrap/ProgressBar';
import Form from 'react-bootstrap/Form';
import {Row, Col, Container} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import React, { useState, useEffect, useRef } from "react";

import axios from 'axios';
import Question from "../components/Question";
import {syllable} from 'syllable'
import '../css/SinglePlayer.css'; 


function SinglePlayer() {
    const baseUrl = 'http://localhost:3030';
    const pause = [",", ";", "?", ":", "!", ")"]
    //timer related useStates
    const [timeLeft, setTimeLeft] = useState(0.0);
    const [gameInProgress, setGameState] = useState(false);
    const [timerOn, setTimerOn] = useState(false); //if timer is actually running
    const initialTime = useRef(100);

    //Game setting use states, timerEnable/readMode only change for next question
    //  to avoid confusion/side effects
    const timerEnable = useRef(true);
    const wasTimerEnable = useRef(true);
    const [pastQuestionsShow, setPastQuestionsShow] = useState(true);  
    const readMode = useRef(false);
    const wasReadMode = useRef(false)
    
    //Question use states (reduced to just question itself)
    const [quest, setQuest] = useState(null);
    const [answerChoices, setChoices] = useState("");
    const [pastQuestions, setPastQuestions] = useState([]);
   

    //Game Variables
    const [buzz, setBuzz] = useState(false);
    const [input, setInput] = useState("");
    const [inputVisible, setInputVisible] = useState(false); //for focusing buzz input area
    const inputRef = useRef(null);
    const [ansSubmit, setAnsSubmit] = useState(false);
    const [checked, setCheck] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    //button refs
    const buzzRef = useRef(null);
    const nextRef = useRef(null);
    const pauseRef = useRef(null);
    const submitRef = useRef(null);

    //reading variables
    const [readQuestion, setReadQuestion] = useState("");
    const [currIndex, setCurrIndex] = useState(0);
    const seenIndex = useRef(-1); //helps avoid repeated word bug and premature timing bug
    const questionWords = useRef([])

    //initial button says start instead of next
    const [start, setStart] = useState(true)

    //pause ref that stores whether reading, timerOn, or buzzing
    const pauseState = useRef(0)

    //decrements time is game in progress, timer option on, and timeLeft
    useEffect(() => {
        if (!wasTimerEnable.current || wasReadMode.current) {
            return;
        }
        let timer = null;
        if (timerOn && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTimeLeft) => decrementTime(prevTimeLeft));
            }, 100); 
        }
        else {
            clearInterval(timer);
        }
        return () => clearInterval(timer)
    }, [timerOn])

    // Focus the input element when there is buzz
    useEffect(() => {
        if (inputVisible && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
              }, 0);
        }
      }, [inputVisible]);
    
    //handle key press shortcuts
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    //handle reading question
    useEffect(() => {
        let timeOut;
        if (gameInProgress && !wasReadMode.current) {
            if (currIndex <= seenIndex.current) {
                setCurrIndex(seenIndex.current + 1);
                return;
            }
            seenIndex.current = currIndex;
            if (currIndex < questionWords.current.length) {
                const word = questionWords.current[currIndex]
                setReadQuestion(readQuestion + word + " ")
                timeOut = setTimeout(() => {
                    setCurrIndex(currIndex + 1);
                  }, getTimeout(word));
            } else {
                setTimerOn(true)
            }
        }
        return () => {
            clearTimeout(timeOut); 
        };
    }, [gameInProgress, currIndex])

    function decrementTime(value) {
        const newTime = (Math.round(10 * value) / 10 - 0.1).toFixed(1);
        if (newTime < 0.05) {
            setGameState(false);
            setTimerOn(false);
            setBuzz(true);
            setInput("No Answer")
            submitAnswer();
        }
        return newTime;
    };

    function handleKeyDown(event) {
        switch (event.key) {
            case ' ':
                if (buzzRef.current) {
                    buzzRef.current.click(); 
                }
                break;
            case 'n':
                if (nextRef.current) {
                    nextRef.current.click(); 
                }
                break;
            case 'p':
                if (pauseRef.current) {
                    pauseRef.current.click(); 
                }
                break;
            case 'Enter':
                if (submitRef.current) {
                    submitRef.current.click(); 
                }
            break;
            default:
                break;
        }
    };

    function resetQuestion() {
        setQuest(null); 
        setGameState(false);
        setTimeLeft(0.0);
        setTimerOn(false);
        setBuzz(false); 
        setInput(""); 
        setInputVisible(false);
        setAnsSubmit(false);
        setCheck(false);
        setIsCorrect(false);
        setReadQuestion("");
        setChoices("")
        setCurrIndex(0)
        questionWords.current = [];
        seenIndex.current = -1;
    }

    async function fetchQuestion() {
        try {
            const response = await axios.get(baseUrl + '/question/random');
            const quest = response.data;
            let visualAnswerChoices = "";
            if (quest.ans_type === "Multiple Choice") {
                const answerChoices = quest.ans_choices;
                visualAnswerChoices = ` W) ${answerChoices[0]} X) ${answerChoices[1]} Y) ${answerChoices[2]} Z) ${answerChoices[3]}`;
            }
            if (quest.q_type == "bonus") {
                initialTime.current = 22.0;
            } else {
                initialTime.current = 7.0;
            }
            setTimeLeft(initialTime.current)
            setQuest(quest);
            setChoices(visualAnswerChoices);
            questionWords.current = (quest.question + visualAnswerChoices).split(" ");

        }
        catch (error) {
            resetQuestion();
        }
    }

    async function handleNextClick() {
        if (quest) {
            setPastQuestions([quest, ...pastQuestions])
        }
        resetQuestion();
        try {
            await fetchQuestion();
        }
        catch (error) {
            resetQuestion();
            return;
        }
        setStart(false)
        wasTimerEnable.current = timerEnable.current;
        wasReadMode.current = readMode.current;
        setGameState(true);
    }

    //going to want to have submit button to clear set buzz and input value
    async function handleBuzzClick() {
        setGameState(false);
        setBuzz(true);
        setInputVisible(true);
        setTimerOn(false)
        if (!wasReadMode.current && wasTimerEnable.current) {
            initialTime.current = 8.0;
            setTimeLeft(initialTime.current);
            setTimerOn(true);
        }
    }

    //can't use arrow function as they aren't mounted so useEffect() for timer will error 
    //need to repeat resetting timer/game/buzz state because time may run out
    async function submitAnswer() {
        setTimerOn(false);
        setAnsSubmit(true);
        try {
            if (input === "") {
                setIsCorrect(false);
            }
            else {
                const response = await axios.get(baseUrl + `/question/check/${quest._id}?userAnswer=${input}`);
                setIsCorrect(response.data.isCorrect);
            }
        }
        catch (error) {
            setIsCorrect(false);
            
        }

    }

    function handleInput(event) {
        setInput(event.target.value)
    }

    function handleCheck(event) {
        setCheck(!checked);
        setIsCorrect(!isCorrect);
    }

    function getSavedQuestions() {
        return (
            <div>
                {pastQuestions.map((question, index) => (
                <Question quest={question} answerChoices={answerChoices}/>
                ))}
            </div>
        );
    }

    //gets timeout between words when reading question
    function getTimeout(word) {
        const syl = syllable(word)
        let extra = 0
        if (word && pause.some(item => word[word.length - 1].includes(item))) {
            extra = 500
        }
        const sylTime = 200
        return Math.sqrt(Math.max(syl, 1)) * sylTime + extra;
    }

    //defines state 1 as reading, state 2 as after reading but not buzzed, state 3 as buzzed
    function handlePauseResume() {
        if (gameInProgress) {
            if (timerOn) {
                setGameState(false);
                setTimerOn(false);
                pauseState.current = 2;
            } else {
                setGameState(false);
                pauseState.current = 1;
            }
        } else if (timerOn) {
            setTimerOn(false)
            pauseState.current = 3;
        } else { //only time where we would be in resuming
            const state = pauseState.current;
            if (state == 1) {
                setGameState(true);
            } else if (state == 2) {
                setGameState(true);
                setTimerOn(true);
            } else {
                setTimerOn(true);
                if (inputRef.current) {
                    setTimeout(() => {
                        inputRef.current.focus();
                      }, 0);
                }
            }
        }
    }
    
    return (
        <Container>
            <Row>
            {/* Question Column */}
                <Col xs={12} md={9}>
                <div className="options-container header-text">
                        <span>
                            {/* fix hover bug when disabled */}
                            {buzz && !ansSubmit ?
                                <Button variant="success" disabled={buzz && !ansSubmit} ref={nextRef} className="button-margin next-button" 
                                onClick={handleNextClick}>{start? "Start": "Next"}</Button> :
                                <OverlayTrigger placement="top" overlay={(<Tooltip>n key</Tooltip>)}>
                                    <Button variant="success" disabled={buzz && !ansSubmit} ref={nextRef}className="button-margin next-button" 
                                        onClick={handleNextClick}>{start? "Start": "Next"}</Button>
                                </OverlayTrigger>
                            }
                            {ansSubmit || !quest || wasReadMode.current ? 
                                <Button variant="primary" className="button-margin" ref={pauseRef} 
                                    disabled={ansSubmit || !quest || wasReadMode.current} onClick={handlePauseResume}>
                                    {gameInProgress || timerOn? "Pause" : "Resume"}</Button> :
                                <OverlayTrigger placement="top" overlay={(<Tooltip>p key</Tooltip>)}>
                                    <Button variant="primary" className="button-margin" ref={pauseRef} 
                                        disabled={ansSubmit || !quest || wasReadMode.current} onClick={handlePauseResume}>
                                        {gameInProgress || timerOn ? "Pause" : "Resume"}</Button> 
                                </OverlayTrigger>
                            }
                        </span>
                        <span>
                            {ansSubmit ?
                                <ToggleButton
                                className="button-margin checked-button"
                                id="toggle-check"
                                type="checkbox"
                                variant="secondary"
                                checked={checked}
                                onChange={handleCheck}
                              >
                                Change Answer
                              </ToggleButton>
                                : ""
                            }
                            {!gameInProgress ?
                                <Button variant="danger" className="button-margin" disabled={!gameInProgress} 
                                ref={buzzRef} onClick={handleBuzzClick}>Buzz</Button> :
                                <OverlayTrigger placement="top" overlay={(<Tooltip>space key</Tooltip>)}>
                                    <Button variant="danger" className="button-margin" disabled={!gameInProgress} 
                                    ref={buzzRef} onClick={handleBuzzClick}>Buzz</Button>
                                </OverlayTrigger>
                            }
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
                        disabled={ansSubmit || !buzz}
                    />
                    {!buzz || ansSubmit ? 
                        <Button variant={ansSubmit ? (isCorrect ? 'success' : 'danger') : 'warning'} ref={submitRef} disabled={!buzz || ansSubmit} 
                        onClick={submitAnswer}> {ansSubmit ? (isCorrect ? 'Correct' : 'Incorrect') : 'Submit'}
                        </Button> :
                        <OverlayTrigger placement="top" overlay={(<Tooltip>enter key</Tooltip>)}>
                            <Button variant={ansSubmit ? (isCorrect ? 'success' : 'danger') : 'warning'} ref={submitRef} disabled={!buzz || ansSubmit} 
                            onClick={submitAnswer}> {ansSubmit ? (isCorrect ? 'Correct' : 'Incorrect') : 'Submit'}
                            </Button>
                        </OverlayTrigger> 
                    }
                    </InputGroup>
                    :null}
                    <div className="question-header">
                        <Card>
                            <Card.Body className="faint-grey">
                                <Card.Text className="header-text" style={{marginTop: -12, marginBottom: -12}}> 
                                <span>
                                    {quest && quest.set && quest.round ? `Set ${quest.set} Round ${quest.round}` : 
                                        (start ? 'Click Start or press n key to start' : 'Loading...')}
                                </span>
                                <span>
                                    {quest && quest.q_num? `Question ${quest.q_num}` : 'Loading...' }
                                </span>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="before-saved">
                        <Card>
                            <Card.Body className="faint-grey">
                                <Card.Text>
                                    {quest && quest.q_type && quest.ans_type && quest.subject && quest.question ?
                                    <span>
                                        <b>{quest.q_type.toUpperCase()}</b> {quest.subject} {'\u2014'}<i> {quest.ans_type}</i>{'   '}
                                        {wasReadMode.current ? quest.question + answerChoices: readQuestion}{ansSubmit ? <span><br/><br/><b>ANSWER</b>: {quest.answer}</span>: ""}
                                    </span> : 'Loading...'
                                    }
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                    {pastQuestionsShow ?
                    getSavedQuestions() : ""
                    } 
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
                                    label="Turn Off Timer (next q)"
                                    onChange={() => timerEnable.current = !timerEnable.current}
                                />
                                <Form.Check 
                                    type="switch"
                                    label="Turn On Read Mode (next q)"
                                    onChange={() => readMode.current = !readMode.current}
                                />
                                <Form.Check 
                                    type="switch"
                                    label="Hide Past Questions"
                                    onChange={() => setPastQuestionsShow(!pastQuestionsShow)}
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