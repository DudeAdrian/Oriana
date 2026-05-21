export const RewardEngine = {
  calculatePoints: (rarity) => (rarity === 'Common' ? 10 : 100),
  mintReward: (userId, points) => console.log('Minting', points, 'to', userId)
};
