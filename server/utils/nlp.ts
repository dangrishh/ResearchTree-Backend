import natural from 'natural';
import { IUser } from '../models/User';

const { WordTokenizer, TfIdf } = natural;

export const analyzeProposal = (proposal: string, advisors: IUser[]): IUser[] => {
  const tokenizer = new WordTokenizer();
  const tfidf = new TfIdf();

  tfidf.addDocument(proposal);

  const scores = advisors.map((advisor) => {
    const advisorSpecializations = advisor.specializations.join(' ');
    const tokens = tokenizer.tokenize(advisorSpecializations);

    let score = 0;
    tokens.forEach((token) => {
      const tfidfScore = tfidf.tfidf(token, 0); // Get the TF-IDF score
      if (typeof tfidfScore === 'number') {
        score += tfidfScore;
      }
    });

    return { advisor, score };
  });

  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, 5).map((s) => s.advisor);
};
