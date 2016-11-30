import { writeFileSync } from 'filendir';
import fs from 'fs';
import _ from 'lodash/fp';
import Kohonen, { hexagonHelper } from 'kohonen';

const stars = _.flow(
  fs.readFileSync,
  JSON.parse,
  _.filter(_.has('data')),
  _.filter(_.flow(
    _.get('data'),
    _.reduce((seed, current) => seed && _.negate(_.isNull), true),
  )),
  _.filter(_.flow(
    _.get('data'),
    _.size,
    _.isEqual(2799)
  )),
)('data/data.json');

const neurons = hexagonHelper.generateGrid(13, 13);

const k = new Kohonen({
  data: _.map(_.get('data'), stars),
  neurons,
  maxStep: 10000,
  maxLearningCoef: .3,
  minLearningCoef: .01,
  maxNeighborhood: 1,
  minNeighborhood: .3
});

k.training((neurons, step) => console.log(step));

const positions = k.mapping();

const results = _.unzip([
  positions,
  _.map(
    _.pick(['name', 'spectralType']),
    stars,
  ),
]);

writeFileSync(`data/result.json`, JSON.stringify(results));