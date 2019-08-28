const { prompt } = require('enquirer');
const axios = require('axios');
const moment = require('moment');
const isEmpty = require('lodash/isEmpty');
const sortBy = require('lodash/sortBy');
const _c = require('./consts');

const _req = async (url, method) => {
  let res;
  try {
    switch (method) {
      case 'GET':
        res = await axios.get(url);
        return res.data;
      default:
        throw new Error({ data: 'No method allowed', error: true });
    }
  } catch (e) {
    return e;
  }
};

const _searchShows = async (q) => {
  const _url = _c.API_SEARCH_SHOWS_PATH(q);
  console.log({ _url });
  try {
    return await _req(_url, 'GET');
  } catch (e) {
    return e;
  }
};

const _getShowEpisodes = async (id) => {
  const _url = _c.API_GET_EPISODES_PATH(id);
  console.log({ _url });
  try {
    return await _req(_url, 'GET');
  } catch (e) {
    return e;
  }
};


(async () => {
  try {
    const userQuery = await prompt({
      type: 'input',
      name: 'q',
      message: 'Search query',
    });

    if (isEmpty(userQuery.q)) {
      console.error('No query.');
      return;
    }

    const results = await _searchShows(userQuery.q);

    const { queryResults } = await prompt({
      type: 'select',
      name: 'queryResults',
      message: 'Choose the serie',
      choices: results.map((r) => _c.parseShow(r)),
      limit: results.length,
      result() {
        return this.selected;
      },
    });

    const { id: chosenId } = queryResults;

    const episodes = await _getShowEpisodes(chosenId);
    const mappedEpisodes = episodes.map((e) => _c.parseEpisode(e));
    const sortedEpisodes = sortBy(mappedEpisodes, ['season', 'number']);
    console.log(sortedEpisodes);
  } catch (e) {
    console.log('got error', e);
  }
})();
