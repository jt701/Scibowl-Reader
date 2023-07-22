
const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    window.speechSynthesis(utterance);
}

speak("and");