import re
#test various parsing techniques

def clean_answer(answer):
    human_answer = answer
    computer_answers = []
    answers = re.split(r"\(ACCEPT: ", human_answer)
    main_answer = answers[0]
    computer_answers.append(main_answer)
    
    if len(answers) > 1:
        other_answers = answers[1]
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
    return human_answer, computer_answers

# print(clean_answer("NORTH STAR  (ACCEPT:  POLARIS , ALPHA URSA MINORIS)")[1])



#tested both positive and negative cases
def remove_pronunciations(text):
    pattern1 = r'\s*\[\w+(?:-\w+)+\]'
    pattern2= r'\s*(?:\(|\[)read as:\s*\w+(?:-\w+)+(?:\)|\])'
    cleaned_text = re.sub(pattern1, '', text)
    return re.sub(pattern2, '', cleaned_text)
# a ="1) BIOLOGY Short Answer What is the biological term most often used for the act of a cell engulfing a particle by extending its pseudopodia (read as: ju SU-doe-POH-dee-ah) around the particle?"
# print(remove_pronunciations(a))


import ast

# Function to convert Unicode escape sequences to characters
def convert_unicode_escape(text):
    return ast.literal_eval(f'"{text}"')
input_text = "An aqueous solution in which the concentration of OH\u2013 ions is greater than that of H+ ions is:"

# Convert Unicode escape sequences to characters
# converted_text = convert_unicode_escape(input_text)
# print(converted_text)
