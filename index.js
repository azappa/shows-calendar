const { prompt } = require('enquirer');
const axios = require('axios');
const moment = require('moment');
const isEmpty = require('lodash/isEmpty');
const sortBy = require('lodash/sortBy');
const kebabCase = require('lodash/kebabCase');
const { Parser } = require('json2csv');
const Vinyl = require('vinyl');
const mkdirp = require('mkdirp');
const fs = require('fs');
const _c = require('./consts');


const handleError = (e) => {
  throw e;
};

const _jsonToCsv = (json) => {
  const fields = _c.CSV_DICT.map((f) => f.label);

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(json);
  return csv;
};

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
    handleError(e);
  }
};

const _searchShows = async (q) => {
  const _url = _c.API_SEARCH_SHOWS_PATH(q);
  try {
    return await _req(_url, 'GET');
  } catch (e) {
    handleError(e);
  }
};

const _getShowEpisodes = async (id) => {
  const _url = _c.API_GET_EPISODES_PATH(id);
  try {
    return await _req(_url, 'GET');
  } catch (e) {
    handleError(e);
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

    const { id: chosenId, name: chosenName } = queryResults;

    const episodes = await _getShowEpisodes(chosenId);
    const mappedEpisodes = episodes.map((e) => _c.parseEpisode(e));
    const sortedEpisodes = sortBy(mappedEpisodes, ['season', 'number']);
    const episodesToCsv = sortedEpisodes.map((e, index) => {
      const calendarDay = moment(new Date()).add(index, 'days').format('YYYY/MM/DD');
      return _c.episodeToCsv({ ...e, calendarDay, serieName: chosenName });
    });
    const _a = _jsonToCsv(episodesToCsv);
    const csvFile = new Vinyl({
      contents: Buffer.from(_a),
      path: `out/${kebabCase(chosenName)}.csv`,
    });

    mkdirp.sync(csvFile.dirname);
    fs.writeFileSync(csvFile.path, csvFile.contents, 'utf-8');

    console.info('All done!');
  } catch (e) {
    console.error('got error', e);
  }
})();
