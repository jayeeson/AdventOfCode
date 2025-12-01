import { readLinesIntoLists } from '../../src/helpers/readFile';
import {
  convertOrderingRulesStringToRecords,
  getInvalidUpdates,
  getMiddleNumbersFromUpdates,
  getRulesAndUpdatesFromFile,
  PageNumberUpdate,
  PageNumberValidation,
  reorderInvalidUpdate,
  sortOrderingRuleRecords,
  validateUpdateLineWithRules,
} from '../../src/solutions/2024/5';

const orderingRulesInput = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13`;

const updatesInput = `75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

test('can turnOrderingRules to array Record<number, number[]>[]', () => {
  const recordArray = convertOrderingRulesStringToRecords(orderingRulesInput);
  const sortedRecordArray = sortOrderingRuleRecords(recordArray);

  const expectedObject = {
    47: [53, 13, 61, 29],
    97: [13, 61, 47, 29, 53, 75],
    75: [29, 53, 47, 61, 13],
    61: [13, 53, 29],
    29: [13],
    53: [29, 13],
  };
  const expectedObjectSorted = sortOrderingRuleRecords(expectedObject);
  expect(sortedRecordArray).toMatchObject(expectedObjectSorted);
});

test('can convert update strings to PageNumberUpdates', () => {
  const updates = readLinesIntoLists(updatesInput);
  const expectedUpdates: PageNumberUpdate[] = [
    [75, 47, 61, 53, 29],
    [97, 61, 53, 29, 13],
    [75, 29, 13],
    [75, 97, 47, 61, 53],
    [61, 13, 29],
    [97, 13, 75, 29, 47],
  ];
  expect(updates).toEqual(expectedUpdates);
});

test.each<{
  update: PageNumberUpdate;
  expected: Partial<PageNumberValidation>;
}>([
  { update: [75, 47, 61, 53, 29], expected: { valid: true, middleNumber: 61 } },
  { update: [97, 61, 53, 29, 13], expected: { valid: true, middleNumber: 53 } },
  { update: [75, 29, 13], expected: { valid: true, middleNumber: 29 } },
  { update: [75, 97, 47, 61, 53], expected: { valid: false } },
  { update: [61, 13, 29], expected: { valid: false } },
  { update: [97, 13, 75, 29, 47], expected: { valid: false } },
])(
  'can identify which rules are valid, and get middle numbers',
  ({ update, expected }) => {
    const recordArray = convertOrderingRulesStringToRecords(orderingRulesInput);
    const validationOutput = validateUpdateLineWithRules(update, recordArray);
    expect(validationOutput).toMatchObject(expected);
  }
);

test('can return middle numbers of all updates', () => {
  const rules = convertOrderingRulesStringToRecords(orderingRulesInput);
  const updates = readLinesIntoLists(updatesInput);
  const middleNumbers = getMiddleNumbersFromUpdates(updates, rules);
  expect(middleNumbers).toEqual([61, 53, 29]);
});

test('read file input can parse into rules and updates', async () => {
  const { rules, updates } = await getRulesAndUpdatesFromFile(
    '../test/2024/test-data/5_fake_data.txt'
  );
  expect(rules).toBe(orderingRulesInput);
  expect(updates).toBe(updatesInput);
});

test.each([
  { input: [75, 97, 47, 61, 53], expected: [97, 75, 47, 61, 53] },
  { input: [61, 13, 29], expected: [61, 29, 13] },
  { input: [97, 13, 75, 29, 47], expected: [97, 75, 47, 29, 13] },
])('can reorder invalid rules to become valid', ({ input, expected }) => {
  const rules = convertOrderingRulesStringToRecords(orderingRulesInput);
  const reorderedUpdate = reorderInvalidUpdate(input, rules);
  expect(reorderedUpdate).toEqual(expected);
});

test('can get invalid updates', () => {
  const expectedInvalidUpdates = [
    [75, 97, 47, 61, 53],
    [61, 13, 29],
    [97, 13, 75, 29, 47],
  ];
  const rules = convertOrderingRulesStringToRecords(orderingRulesInput);
  const updates = readLinesIntoLists(updatesInput);
  const invalidUpdates = getInvalidUpdates(updates, rules);
  expect(invalidUpdates).toEqual(expectedInvalidUpdates);
});
