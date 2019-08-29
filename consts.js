const pick = require('lodash/pick');
const moment = require('moment');

const API_BASE_URL = 'http://api.tvmaze.com';

const csvKeys = [
  {
    label: 'Subject',
    desc: 'The name of the event, required.',
    example: 'Final exam',
  },
  {
    label: 'Start Date',
    desc: 'The first day of the event, required.',
    example: '05/30/2020',
  },
  {
    label: 'Start Time',
    desc: 'The time the event begins.',
    example: '10:00 AM',
  },
  {
    label: 'End Date',
    desc: 'The last day of the event.',
    example: '05/30/2020',
  },
  {
    label: 'End Time',
    desc: 'The time the event ends.',
    example: '1:00 PM',
  },
  {
    label: 'All Day Event',
    desc: 'Whether the event is an all-day event. Enter True if it is an all-day event, and False if it isn\'t.',
    example: 'False',
  },
  {
    label: 'Description',
    desc: 'Description or notes about the event.',
    example: '50 multiple choice questions and two essay questions ',
  },
  {
    label: 'Location',
    desc: 'The location for the event.',
    example: '"Columbia, Schermerhorn 614"',
  },
  {
    label: 'Private',
    desc: 'Whether the event should be marked private. Enter True if the event is private, and False if it isn\'t.',
    example: 'True',
  },
];


module.exports = {
  API_SEARCH_SHOWS_PATH: (q) => `${API_BASE_URL}/search/shows?q=${q}`,
  API_GET_EPISODES_PATH: (showId) => `${API_BASE_URL}/shows/${showId}/episodes`,
  CSV_DICT: csvKeys,
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

module.exports.episodeToCsv = (e) => {
  const {
    name, season, number, summary, runtime,
  } = e;
  return {
    Subject: `Watching ${name} (S${season}E${number})`,
    ['Start Date']: moment.now(),
    ['Start Time']: `01:00 PM`,
    ['End Date']: moment.now(),
    ['End Time']: `02:00 PM`,
    ['All Day Event']: `False`,
    Description: `Episode summary: ${summary}`,
    Location: `here`,
    Private: `True`,
  };
};
