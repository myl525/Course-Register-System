const courseFunctions = require('../../../controllers/admin/course')
const getFilter = courseFunctions.getFilter;

test('get filters from search string', () => {
    const req1 = {'query': {'courseSearchStr': 'CSCI-UA.1114'}};
    const req2 = {'query': {'courseSearchStr': 'Fundamental Algorithms'}};
    const req3 = {'query':{}};
    const filter1 = {'courseId': 'CSCI-UA.1114'};
    const filter2 = {'courseName': 'Fundamental Algorithms'};
    const filter3 = {};

    expect(getFilter(req1, {})).toEqual(filter1);
    expect(getFilter(req2, {})).toEqual(filter2);
    expect(getFilter(req3,{})).toEqual(filter3);
})
