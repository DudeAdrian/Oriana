const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: `http://${process.env.ELASTICSEARCH_HOST || 'localhost'}:${process.env.ELASTICSEARCH_PORT || 9200}`
});

/**
 * Index or update a user in Elasticsearch
 */
const indexUser = async (user) => {
  try {
    await client.index({
      index: 'users',
      id: user.id,
      document: {
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        profileImage: user.profileImage,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Elasticsearch Indexing Error:', error.message);
  }
};

/**
 * Full-text search for users with relevance scoring
 */
const searchUsers = async (query) => {
  try {
    const result = await client.search({
      index: 'users',
      query: {
        multi_match: {
          query,
          fields: ['username^3', 'displayName^2', 'bio'],
          fuzziness: 'AUTO'
        }
      }
    });

    return result.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source,
      score: hit._score
    }));
  } catch (error) {
    console.error('Elasticsearch Search Error:', error.message);
    return []; // Fallback to empty results
  }
};

module.exports = { client, indexUser, searchUsers };