export interface RankInterface {
    name: string;
    min: number|null;
    max: number|null;
}

export const Ranks: RankInterface[] = [
    {name: 'Crypto God', min: 1000000, max: null},
    {name: 'Crypto King', min: 100000, max: 1000000},
    {name: 'Manager', min: 100000, max: 1000000},
    {name: 'Skilled Guy', min: 1000, max: 10000},
    {name: 'Noob', min: 100, max: 1000},
    {name: 'Looser', min: 30, max: 100},
    {name: 'Dead', min: null, max: 30},
];


export function RankFundsDetail(rank: RankInterface) {
    return (rank.min === null)
        ? '< ' + HumanizeRankFunds(rank.max)
        : HumanizeRankFunds(rank.min) + '+';
}

export function HumanizeRankFunds(funds: number | null) {
    if (!funds) {
        return '';
    }

    let kAmount = 1;
    while (funds >= 1000) {
        kAmount++;
        funds = funds / 1000;
    }
    return funds + Array(kAmount).join('k');

}
