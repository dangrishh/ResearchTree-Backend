import sys
import json
from collections import Counter
from difflib import SequenceMatcher

def extract_keywords(text):
    words = text.split()
    return [word.lower() for word in words if len(word) > 3]

def calculate_similarity(a, b):
    return SequenceMatcher(None, a, b).ratio()

def analyze_proposal(proposal, specializations):
    proposal_keywords = extract_keywords(proposal)
    proposal_sentences = proposal.split('.')

    scores = []

    for advisor in specializations:
        specialization_keywords = [word.lower() for word in advisor['specializations']]
        keyword_matches = sum((Counter(proposal_keywords) & Counter(specialization_keywords)).values())
        
        sentence_similarity = sum(calculate_similarity(proposal_sentence, ' '.join(specialization_keywords))
                                  for proposal_sentence in proposal_sentences) / len(proposal_sentences)
        
        total_score = keyword_matches + sentence_similarity
        scores.append((advisor['id'], total_score))

    scores.sort(key=lambda x: x[1], reverse=True)
    return scores

if __name__ == "__main__":
    proposal = sys.argv[1]
    specializations = json.loads(sys.argv[2])
    result = analyze_proposal(proposal, specializations)
    print(json.dumps(result))
