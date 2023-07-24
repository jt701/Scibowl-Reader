import re

#several functions for cleaning individual data fragments
#includes universal cleaning, smaller cleaning functions, and cleaning functions for attribute types

#mapping symbols to word for computer readable question and computer readable answers
def check_question_symbols(text):
    symbol_to_word_question = {
    "–" : " minus",
    "π" : " pi",
    "Δ" : " delta"
    }
    for key in symbol_to_word_question:
        text = re.sub(f"{key}", f"{symbol_to_word_question[key]}", text)
    return text

def check_answer_symbols(text):
    symbol_to_word_answer = {
        "–" : "-",
        "π" : "pi",
        "Δ" : "delta"
    }
    for key in symbol_to_word_answer:
        text = re.sub(f"{key}", f"{symbol_to_word_answer[key]}", text)
    return text

#removes pronunciation clarification including (read as: a-b-c) and [a-b-c..]
def remove_pronunciations(text):
    pattern1 = r'\s*\[\w+(?:-\w+)+\]'
    pattern2 = r'\s*(?:\(|\[)read as:\s*\w+(?:-\w+)+(?:\)|\])'
    cleaned_text = re.sub(pattern1, '', text)
    return re.sub(pattern2, '', cleaned_text)

#removes pronunciations, excess whitespace, and newline characters
def universal_clean(string):
    string = remove_pronunciations(string)
    string = string.strip().replace("\n", "")
    #helps with unicode characters, needs to be after stripping whitespace
    return string

#returns human readable and computer readable question
def clean_question(question):
    human_question = universal_clean(question)
    computer_question = human_question
    return human_question, check_question_symbols(computer_question)

#returns human readable and computer readable answer
#if accept present, delimiter is or, OR, comma (comma only used if not present in main answer)
def clean_answer(answer):
    human_answer = universal_clean(answer)
    computer_answers = []
    answers = re.split(r"\(ACCEPT: |\(ACCEPT", human_answer)
    main_answer = answers[0]
    computer_answers.append(main_answer)
    
    if len(answers) > 1:
        other_answers = re.split(r"\;\sDO\sNOT\sACCEPT", answers[1])[0]
        individual_answers = re.split(r"\sor\s|\sOR\s", other_answers)
        if len(individual_answers) > 1:
            computer_answers.extend(individual_answers)
        elif ',' not in main_answer:
            individual_answers = re.split(r",", other_answers)
            if len(individual_answers) > 1:
                computer_answers.extend(individual_answers)
        #check if any answers have been added
        if len(computer_answers) == 1:
            computer_answers.append(other_answers)
        computer_answers[-1] = re.split(r"\)", individual_answers[-1])[0] #removing end parentheses
    else:
        computer_answers[0] = re.split(r"\(",  computer_answers[0])[0] #remove beggining parentheses
    computer_answers = [answer.strip() for answer in computer_answers]
    computer_answers = [check_answer_symbols(answer) for answer in computer_answers]
    return human_answer, computer_answers


def clean_answer_choices(choices):
    for choice in choices:
        choice = universal_clean(choice)
    return choices

def clean_subject(subject):
    subject = universal_clean(subject)
    cleaned_text = re.sub(r'[^a-zA-Z\s]', '', subject)
    return cleaned_text.upper()