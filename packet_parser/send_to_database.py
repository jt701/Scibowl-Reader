import pymongo
import json
import jsonschema

#write to questions collection of scibowl database 
mongo_url = 'mongodb://127.0.0.1:27017/'

schema = {
  "type": "object",
  "properties": {
    "set": { "type": "integer" },
    "round": { "type": "integer" },
    "q_num": { "type": "integer" },
    "q_type": { "type": "string" },
    "subject": { "type": "string" },
    "ans_type": { "type": "string" },
    "question": { "type": "string" },
    "computer_question": { "type": "string" },
    "answer": { "type": "string" },
    "computer_ans": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": [
    "set",
    "round",
    "q_num",
    "q_type",
    "subject",
    "ans_type",
    "question",
    "computer_question",
    "answer",
    "computer_ans"
  ]
}

def write_file(relative_path):
    client = pymongo.MongoClient(mongo_url)
    db = client['scibowl'] 
    collection = db['questions']
    
    with open(relative_path) as file:
        data = json.load(file)
    
    for obj in data:
        jsonschema.validate(obj, schema)
    
    collection.insert_many(data)
    client.close()

write_file("packet_parser/parsed_packets/set1_round1.json")
