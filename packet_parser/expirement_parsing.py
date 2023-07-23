import re
#test various parsing techniques

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