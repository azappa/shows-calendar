const pick = require('lodash/pick');

module.exports = {
  API_BASE_URL: 'http://api.tvmaze.com',
  API_SEARCH_PATH: '/search',
  API_SHOWS_PATH: '/shows',
};

module.exports.parseShow = (s) => {
  const _keys = ['id', 'name', 'externals', 'image', 'summary', '_links'];
  const { show } = s;

  return pick(show, _keys);
};
