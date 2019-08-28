const pick = require('lodash/pick');

const API_BASE_URL = 'http://api.tvmaze.com';

module.exports = {
  API_SEARCH_SHOWS_PATH: (q) => `${API_BASE_URL}/search/shows?q=${q}`,
  API_GET_EPISODES_PATH: (showId) => `${API_BASE_URL}/shows/1871/episodes`,
};

module.exports.parseShow = (s) => {
  const _keys = ['id', 'name', 'externals', 'image', 'summary', '_links'];
  const { show } = s;

  return pick(show, _keys);
};

module.exports.parseEpisode = (e) => {
  const _keys = ['id', 'name', 'season', 'number', 'runtime', 'image', 'summary', '_links'];

  return pick(e, _keys);
};
