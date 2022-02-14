const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
} = require('../../src/model/data/memory/index');
describe('memory', () => {
  test('writeFragment()', async () => {
    const data = { fragment: 'pretend fragment 1', id: '1', ownerId: 'aa' };
    const result = await writeFragment(data);
    expect(result).toBe(undefined);
  });
  test('readFragment()', async () => {
    const data = { fragment: 'pretend fragment 1', id: '1', ownerId: 'aa' };
    await writeFragment(data);
    const result = await readFragment('aa', '1');
    expect(result).toBe(data);
  });
  test('writeFragmentData()', async () => {
    const data = 'pretend fragment 1';
    const result = await writeFragmentData('aa', '1', data);
    expect(result).toBe(undefined);
  });
  test('readFragmentData()', async () => {
    const data = 'pretend fragment 1';
    await writeFragmentData('aa', '1', data);
    const result = await readFragmentData('aa', '1');
    expect(result).toBe(data);
  });
});
