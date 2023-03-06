
import {increment} from '../src/utils/math'

it('Increment by 1, 3, 19', () => {
    const value = 27;
    expect(increment(value)).toBe(28);
    expect(increment(value, 3)).toBe(30);
    expect(increment(value, 19)).toBe(46);
});

