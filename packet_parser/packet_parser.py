import re
import json
import pdf_parser as p

def extract_question_details(question_text):
    question_details = {}
    # Extract type of question (TOSS-UP or BONUS)
    question_details["type"] = "TOSS-UP" if "TOSS-UP" in question_text else "BONUS"
    
    # Extract subject (BIOLOGY, CHEMISTRY, etc.)
    subject_match = re.search(r"[A-Z\s]+(?= Short Answer| Multiple Choice)", question_text)
    if subject_match:
        question_details["subject"] = subject_match.group().strip()
    
    # Extract the question text
    question_match = re.search(r"\d+\)\s+(.*)\n", question_text)
    if question_match:
        question_details["question"] = question_match.group(1).strip()
    
    # Extract the answer choices (for Multiple Choice questions)
    choices_match = re.search(r"(?<=W\)\s).+(?=\n)", question_text)
    if choices_match:
        answer_choices = choices_match.group().split("\n")
        question_details["answer_choices"] = answer_choices
    
    # Extract the correct answer
    answer_match = re.search(r"ANSWER: (.+)", question_text)
    if answer_match:
        correct_answer = answer_match.group(1).strip()
        # For Multiple Choice, separate the letter and the answer if it says both
        if " or " in correct_answer:
            correct_answer = correct_answer.split(" or ")
        question_details["answer"] = correct_answer
    
    return question_details

def main():
    questions_text = p.parse_pdf3("packets/set1-round1.pdf")
    
    # Split the text into individual questions
    questions = re.split(r"(TOSS-UP|BONUS)", questions_text)[1:]
    
    question_objects = []
    for i in range(0, len(questions), 2):
        question_text = questions[i + 1]
        question_details = extract_question_details(question_text)
        question_objects.append(question_details)
    
    # Write the question objects to a JSON file
    with open("questions.json", "w") as json_file:
        json.dump(question_objects, json_file, indent=2)
        
def clean_question():
    print(0)
def clean_answer():
    print(0)
def clean_answer_choices():
    print(0)
    

def get_question_details(question, set, round, question_num, question_type):
    details = {}
    details['set'] = set
    details['round'] = round
    details['question_num'] = question_num
    details['question_type'] = question_type
    
    parts = question.split(')')
    parts2 = re.split(r"(Short Answer|Multiple Choice)", parts[1])
    details['subject'] = parts2[0].strip()
    
    question_type = parts2[1].strip()
    details['question_type'] = question_type
    if question_type == "Short Answer":
        parts3= re.split(r"(ANSWER:)", parts2[2])
        question = parts3[0].strip().replace("\n", " ")
        details['question'] = question
        parts4 = re.split(r" ", parts3[1])
        answer = parts4[0].strip().replace("\n", " ")
        details['answer'] = answer
    return details
    
    

def parse_questions(file_path, set, round):
    questions_text = p.parse_pdf4(file_path)
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
    
    #call chatgpt
    
    # Write the question objects to a JSON file
    with open("questions.json", "w") as json_file:
        json.dump(question_objects, json_file, indent=2)


    
    
    
parse_questions('packets/set1-round1.pdf', 1, 2)
#problem with split is that ) or 1) can be seen in question and fuck up parsing
"""    
exceptions
1. Order with semicolon necessiates that order
2. order with number has comma
3. short answer need similairty coefficeint (fuzzy string ratio)
4. pronunciations
5. OR keyword, ACCEPT, multiple choice takes letter and exact expression
6. readable, speakable
7. list for choices, each choice is possible, ,says needs that otder

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
    

