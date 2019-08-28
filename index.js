const fs = require('fs');
const path = require('path');
const { prompt } = require('enquirer');
const moment = require('moment');
const axios = require('axios');
const isEmpty = require('lodash/isEmpty');
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

const _search = async (q) => {
  const _url = `${_c.API_BASE_URL}${_c.API_SEARCH_PATH}${_c.API_SHOWS_PATH}?q=${q}`;
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

    const results = await _search(userQuery.q);

    const { queryResults } = await prompt({
      type: 'select',
      name: 'queryResults',
      message: 'Pick up a template',
      choices: results.map((r) => _c.parseShow(r)),
      limit: results.length,
      result() {
        return this.selected;
      },
    });
    console.log(queryResults);
  } catch (e) {
    console.log('got error', e);
  }
})();
