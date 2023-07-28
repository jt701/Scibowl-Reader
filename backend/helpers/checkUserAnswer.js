
//phrases should include whitespace, all be lowercase for consistency 
const remove_phrases = [' the ', ' a ', ' and ', ' is ', ' to ', ' or '];

//cleans answer from miscallaneous characters
const cleanAnswer = (answer) => {
    const lowercaseString = answer.toLowerCase(); //makes it easier to remove phrase
    const answerWithSpaces = " " + lowercaseString+ " "; //account for case where remove_phrase starts/ends an answer
    
    const phraseRemovedAnswer = remove_phrases.reduce((acc, phrase) => { //removing phrases
        const regex = new RegExp(phrase, "gi");
        return acc.replace(regex, "");
      }, answerWithSpaces);

    return phraseRemovedAnswer.replace(/\W/g, ""); //replace non-alphanumerical characters (including spaces) with ""
}

//runs in str1.length * str2.length time. uses partial lev. distances 
const levenshtein = (str1, str2) => {
    
    const a = str1.length;
    const b = str2.length;
    
    const partial_lev = new Array(a + 1).fill(null).map(() => new Array(b + 1).fill(0));
    
    for (let i = 0; i <= a; i++) {
        partial_lev[i][0] = i;
    }
    
    for (let j = 0; j <= b; j++) {
        partial_lev[0][j] = j;
    }
    
    
    for (let i = 1; i <= a; i++) {
        for (let j = 1; j <= b; j++) {
        if (str1[i - 1] === str2[j - 1]) {
            partial_lev[i][j] = partial_lev[i - 1][j - 1];
        } else {
            partial_lev[i][j] = 1 + Math.min(partial_lev[i - 1][j], partial_lev[i][j - 1], partial_lev[i - 1][j - 1]);
        }
        }
    }
    return partial_lev[a][b];
}

const checkUserAnswer = (userAnswer, answersList) => {
    const cleanedUserAnswer = cleanAnswer(userAnswer);
    const cleanedAnswerList = answersList.map(cleanAnswer);

    
    let correct = false;
    cleanedAnswerList.forEach((answer) => {
        const distance = levenshtein(answer, cleanedUserAnswer);
        const ratio = distance / answer.length;
        if (1 - ratio > 0.8) {
            correct = true;
        }
      });
    return correct;

}

module.exports = checkUserAnswer;