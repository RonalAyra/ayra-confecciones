import { Model } from 'mongoose';

const defaultPageSize = 10;

function matchAggregate(aggregate, defaultSearch) {
  if (Object.keys(defaultSearch).length > 0) {
    aggregate.push({
      $match: defaultSearch,
    });
  }

  return aggregate;
}

export function sortAggregate(aggregate, params, defaultSort = {}) {
  let sort = {};
  if (params.sortBy) {
    if (params.sortBy === 'id') {
      params.sortBy = '_id';
    }
    sort[params.sortBy] = params.sortOrder === 'asc' ? 1 : -1;
  } else {
    sort = { ...defaultSort };
  }

  if (Object.keys(sort).length > 0) {
    const sorting = {
      $sort: { ...sort },
    };
    aggregate.push(sorting);
  }

  return aggregate;
}

export function paginationAggregate(aggregate, params) {
  const limit = params.limit ? parseInt(params.limit) : defaultPageSize;
  const pageNumber = parseInt(params.page);

  if (!isNaN(limit) && !isNaN(pageNumber)) {
    const pagination = {
      $facet: {
        rows: [
          { $skip: pageNumber > 0 ? (pageNumber - 1) * limit : 0 },
          { $limit: limit },
        ],
        total: [
          {
            $count: 'count',
          },
        ],
      },
    };
    aggregate.push(pagination);
  }

  return aggregate;
}

export function sort(records, params, defaultSort = {}) {
  let sort = {};
  if (params.sortBy) {
    if (params.sortBy === 'id') {
      params.sortBy = '_id';
    }
    sort[params.sortBy] = params.sortOrder;
  } else {
    sort = { ...defaultSort };
  }

  return records.sort(sort);
}

export function paginate(records, params) {
  if (params.page) {
    const limit = params.limit ? parseInt(params.limit) : 10;
    const pageNumber = parseInt(params.page);
    records = records.limit(limit);
    records = records.skip(pageNumber > 0 ? (pageNumber - 1) * limit : 0);
  }

  return records;
}

export async function getAggregateResults(
  model: Model<any>,
  aggregate: Array<any> = [],
  params: any = {},
  defaultSort: any = {},
  defaultSearch: any = {},
) {
  aggregate = matchAggregate(aggregate, defaultSearch);
  aggregate = sortAggregate(aggregate, params, defaultSort);
  aggregate = paginationAggregate(aggregate, params);

  // const query = model.aggregate(aggregate);
  const options: any = {};
  if (params.insensitiveCase) options.collation = { locale: 'en' };
  const query = aggregate.length
    ? model.aggregate(aggregate, options)
    : model.find();
  const result = await query.exec();

  const page_size = params.limit ? parseInt(params.limit) : defaultPageSize;
  let rows = [];
  let total = 0;
  let pages = 0;

  if (result[0] && result[0].total && result[0].rows) {
    rows = result[0].rows;
    total = result[0].total.length === 1 ? result[0].total[0].count : 0;
    pages = Math.ceil(total / page_size);
  } else {
    rows = result;
    total = result.length;
    pages = Math.ceil(total / page_size);
  }

  return { rows, total, pages };
}
