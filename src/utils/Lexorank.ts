import { LexoRank } from "lexorank"

export default class LexorankService {

    static getNextRank(prevRank: string, nextRank: string): [string, boolean] {
        try {
            if (!prevRank && !nextRank) {
                return [LexoRank.middle().toString(), false];
            }
            if (!prevRank && nextRank) {
                const minRank = LexoRank.min();
                const nextLexoRank = LexoRank.parse(nextRank);
                return [minRank.between(nextLexoRank).toString(), false];
            }
            if (prevRank && !nextRank) {
                const maxRank = LexoRank.max();
                const prevLexoRank = LexoRank.parse(prevRank);
                return [prevLexoRank.between(maxRank).toString(), false];
            }
            return [LexoRank.parse(prevRank).between(LexoRank.parse(nextRank)).toString(), false];
        } catch (err) {
            return ['', true]
        }
    };
    static rebalancingRank(prevRank: string):string {
        if (!prevRank) {
            return LexoRank.middle().toString();
        }
        return LexoRank.parse(prevRank).genNext().toString();
    }
};

