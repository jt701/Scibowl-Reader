import re
import json
import pdf_parser as p
import ast
import clean as c

""" 
Manual Checks (can't be automated, at least without copious amounts of work)
1. [] or (read as: ) with many lines (not pronunications) 
    remove preceding and replace with whatever is in [] or ()
2. Random symbols should just be put into words
3. Chemical formulas need spaces for computer question readable to ensure
    that they are read correctly
4. Weird math equations that didn't parse correctly must be put into words
5. Expressions that don't parse correctly
    sqrt(), usign e for scientic notation (1.5e10), ^ for powers, 

"""
#helper function to parse_questions
#gets detail once question is passed to it
def get_question_details(question, set, round, question_num, question_type):
    details = {}
    
    #dealing with simple parameters
    details['set'] = set
    details['round'] = round
    details['q_num'] = question_num
    details['q_type'] = question_type
    
    subject_pattern = r'\)([^)]+)\s+(Multiple Choice|Short Answer)'
    
    #getting subject and answer type
    subject_match = re.search(subject_pattern, question, re.DOTALL)
    subject = subject_match.group(1).strip()
    details['subject'] = c.clean_subject(subject)
    answer_type = subject_match.group(2).strip()
    details['ans_type'] = answer_type
    
    after_qtype = re.split(r"(Multiple Choice|Short Answer)", question)[2]
    question_and_answers = re.split(r"ANSWER:", after_qtype)
    question = question_and_answers[0]
    
    #extracting choices and readjusting question for MC
    if answer_type == "Multiple Choice":
        answer_choices_pattern = r'^[WXYZ]\)\s*(.*?)\s*(?=(?:^[WXYZ]\)|ANSWER:|$))'
        answer_choices_matches = re.findall(answer_choices_pattern, question, re.MULTILINE)
        answer_choices = [choice for choice in answer_choices_matches]
        details['ans_choices'] = c.clean_answer_choices(answer_choices)
        question = re.split(r"W\)", question)[0]
    
    #getting answer and question attributes, computer version and human version
    #human version is string, computer version is list with possible values
    cleaned_questions = c.clean_question(question)
    details['question'] = cleaned_questions[0]
    details['computer_question'] = cleaned_questions[1]
    answer_extended = question_and_answers[1]
    answer = re.split(r"\n \n", answer_extended)[0]
    
    cleaned_answers = c.clean_answer(answer)
    details['answer'] = cleaned_answers[0]
    details['computer_ans'] = cleaned_answers[1]
    return details
    
#main function to actually do the parsing
#takes file path, set and round
#writes questions to json file 
def parse_questions(file_path, set, round):
    questions_text = p.parse_pdf2(file_path)
    split_text = re.split(r"(TOSS-UP|BONUS)", questions_text)
    questions = split_text[1:]
    question_objects = []
    question_num = 1
    
    for i in range(0, len(questions), 4):
        tossup = get_question_details(questions[i + 1], set, round, question_num, "toss-up")
        bonus = get_question_details(questions[i + 3], set, round, question_num, "bonus")
        question_objects.append(tossup)
        question_objects.append(bonus)
        question_num += 1
    
    # Write the question objects to a JSON file
    with open("curr_questions.json", "w", encoding="utf-8") as json_file:
        json.dump(question_objects, json_file, indent=2, ensure_ascii=False)
    
parse_questions('packets/set1-round1.pdf', 1, 1)

"""   


 
exceptions
1. Order with semicolon necessiates that order
2. order with number has comma
3. short answer need similairty coefficeint (fuzzy string ratio)
4. pronunciations
5. OR keyword, ACCEPT, multiple choice takes letter and exact expression
6. readable, speakable
7. list for choices, each choice is possible, ,says needs that otder
8. math answers like fractions, sqrt, etc. 

fields 
set, round1, question_num

question_type, answer_type, subject, question, answer choices, answer

problems:
    1. question/answer choices
        1. readibility
        2. pronunication, read as etc.
    2. answer
        1. readibilily
        2. pronunication
        3. accept more than one (MC, ACCEPT)
        4. longer short answers that need similairty coefficient
        5. listing, longer outputs 
tackle basic readibility
consult gpt
manual checking
"""
    

