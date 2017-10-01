var expect = chai.expect;

describe('Download Progress Selector', function () {
  it('Builds the constructor', function () {
    var files = ['/package.json'];
    var pl = pageLoading(files);
    expect(pl.files).to.equal(files);
    expect(pl.filesLength).to.equal(files.length);
    expect(pl.percentages).to.equal({});
    expect(pl.percentage).to.equal(0);
    var eventsKeys = Object.keys(pl.events);
    expect(eventsKeys).to.equal(['afterLoading', 'beforeLoading', 'progress']);
  });
});